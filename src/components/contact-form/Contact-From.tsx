import { Component, Show, createMemo, createSignal } from 'solid-js';
import { recaptchaScriptLoading } from '../../App';
import { recaptchaKey } from '../../constants';
import { BadRequestException } from '../../utils/errors/bad-request.exception';
import { RequestTimedoutException } from '../../utils/errors/request-timed-out.exception';
import { TooManyRequestsException } from '../../utils/errors/too-many-requests.exception';
import Spinner from './../spinner/Spinner';
import MessageBox from '../message-box/MessageBox';
import { sendMessage } from './contact-form.fns';
import { ForbiddenException } from '../../utils/errors/forbidden.exception';

interface FormField {
    hasChanged: boolean;
    value: string;
}

const ContactForm: Component = () => {
  // initializing
  const initializing = createMemo(() => recaptchaScriptLoading());
  const [formSubmitted, setFormSubmitted] = createSignal(false);
  const [processing, setProcessing] = createSignal(false);
  const [formSubmissionError, setFormSubmissionError] = createSignal("");

  // server errors.
  const [serverError, setServerError] = createSignal("");

  // the name field
  const [nameField, setNameField] = createSignal<FormField>({
    value: "",
    hasChanged: false,
  });

  /**
   * Determines if there are any errors with the name field.
   */

  const nameFieldError = createMemo(() => {
    let error = "";
    const field = nameField();
    if (field.hasChanged) {
      // validate the name field.
      if (field.value.trim().length == 0) {
        // it is an empty string
        error = "Name field is required.";
      }
    }
    return error.trim();
  });

  // the email field
  const [emailField, setEmailField] = createSignal<FormField>({
    value: "",
    hasChanged: false,
  });

  /**
   * determines if there are any errors in the email.
   */

  const emailFieldError = createMemo(() => {
    let error = "";
    const field = emailField();
    const emailSubmissionError = formSubmissionError().trim();
    if (field.hasChanged) {
      // validate the name field.
      const VALID_EMAIL_REGEX = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"
      );

      if (field.value.trim().length == 0) {
        error = "Email field is required.";
      } else if (!VALID_EMAIL_REGEX.test(field.value)) {
        error = "Email must be a valid email address.";
      } else if (emailSubmissionError.length > 0) {
        error = emailSubmissionError;
      }
    }

    return error.trim();
  });

  // the subject field
  const [subjectField, setSubjectField] = createSignal<FormField>({
    value: "",
    hasChanged: false,
  });

  const subjectFieldError = createMemo(() => {
    let error = "";
    const field = subjectField();

    if (field.hasChanged) {
      // validate the subject input.
      if (field.value.trim().length == 0) {
        error = "Subject field is required.";
      }
    }

    return error.trim();
  });

  // the message field.
  const [messageField, setMessageField] = createSignal<FormField>({
    value: "",
    hasChanged: false,
  });

  const messageFieldError = createMemo(() => {
    let error = "";
    const field = messageField();

    if (field.hasChanged) {
      // validate the field

      if (field.value.trim().length == 0) {
        error = "Message field is required.";
      }
    }

    return error.trim();
  });

  // determines if the form can be submitted
  const canSendMessage = createMemo(() => {
    const validName =
      nameFieldError().length == 0 && nameField().value.length > 0;
    const validEmail =
      emailFieldError().length == 0 && emailField().value.length > 0;
    const validSubject =
      subjectFieldError().length == 0 && subjectField().value.length > 0;
    const validMessage =
      messageFieldError().length == 0 && messageField().value.length > 0;
    return validName && validEmail && validSubject && validMessage;
  });

  // determines the button style
  const getButtonStyle = () => {
    const enabledStyle =
      "py-3 px-6 bg-primary text-white font-bold w-full sm:w-32";
    const disabledStyle =
      "py-3 px-6 bg-primary text-white font-bold w-full sm:w-32 opacity-50";

    return canSendMessage() ? enabledStyle : disabledStyle;
  };

  const resetForm = () => {
    setNameField({ value: "", hasChanged: false });
    setEmailField({ value: "", hasChanged: false });
    setSubjectField({ value: "", hasChanged: false });
    setMessageField({ value: "", hasChanged: false });
    setFormSubmitted(false);
  };

  const submitForm = async () => {
    setProcessing(true);
    setServerError("");
    const token = await grecaptcha.enterprise.execute(recaptchaKey, { action: 'contact'});

    try {
        await sendMessage({
            name: nameField().value,
            email: emailField().value,
            subject: subjectField().value,
            message: messageField().value,
            token: token
        });

        setFormSubmitted(true);
    }
    catch(e) {
        let message = "";
        if (e instanceof BadRequestException) {
            // bad request
            message = "One or more fields is invalid.";
        }
        else if (e instanceof ForbiddenException) {
          message = "We cannot send your message. Sorry about that.";
        }
        else if (e instanceof RequestTimedoutException) {
            // request timed out.
            message = "The server cannot be reached. Please try again in a little bit.";
        }
        else if (e instanceof TooManyRequestsException) {
            message = "Wow. Slow down partner.";
        }
        else {
            // server exception
            message = "Something went wrong on our end. Please try again in a little bit.";
        }
        setServerError(message);
    }
    finally {
        setProcessing(false);
    }
  }

  return (
    <Show when={!initializing()} fallback={<Spinner />}>
      <Show when = {!formSubmitted()} fallback={<MessageBox message="Message Sent" actionText="Ok" onConfirm={resetForm}/>}>
        <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
          <div class="text-3xl mb-6 text-center">Send a Message</div>
          <div class="text-xl mb-6 text-center ">
            Got something you want to share? Send me a message and I'll get back
            to you as soon as I can.
          </div>

          <Show when={serverError().trim().length > 0}>
            <div class="text-sm mb-6 text-center text-error">
              {serverError()}
            </div>
          </Show>

          <Show when={!processing()} fallback={() => <Spinner />}>
            <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
              <div class="col-span-2">
                <Show when={nameFieldError().length > 0}>
                  <div class="text-md mb-2 text-center text-error">
                    {nameFieldError()}
                  </div>
                </Show>
                <input
                  type="text"
                  class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                  placeholder="Name"
                  value={nameField().value}
                  autocomplete="name"
                  onInput={(e) =>
                    setNameField({
                      hasChanged: true,
                      value: e.currentTarget.value,
                    })
                  }
                />
              </div>

              <div class="col-span-2">
                <Show when={emailFieldError().length > 0}>
                  <div class="text-md mb-2 text-center text-error">
                    {emailFieldError()}
                  </div>
                </Show>
                <input
                  type="text"
                  class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                  placeholder="Email Address"
                  autocomplete="email"
                  value={emailField().value}
                  onInput={(e) => {
                    setEmailField({
                      hasChanged: true,
                      value: e.currentTarget.value,
                    });
                    setFormSubmissionError("");
                  }}
                />
              </div>

              <div class="col-span-2">
                <Show when={subjectFieldError().length > 0}>
                  <div class="text-md mb-2 text-center text-error">
                    {subjectFieldError()}
                  </div>
                </Show>
                <input
                  type="text"
                  class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                  placeholder="Subject"
                  value={subjectField().value}
                  onInput={(e) =>
                    setSubjectField({
                      hasChanged: true,
                      value: e.currentTarget.value,
                    })
                  }
                />
              </div>

              <div class="col-span-2">
                <Show when={messageFieldError().length > 0}>
                  <div class="text-md mb-2 text-center text-error">
                    {messageFieldError()}
                  </div>
                </Show>
                <textarea
                  cols="30"
                  rows="8"
                  class="border-solid border-gray-400 border-2 p-3 md:text-xl w-full"
                  placeholder="Message"
                  value={messageField().value}
                  onInput={(e) =>
                    setMessageField({
                      hasChanged: true,
                      value: e.currentTarget.value,
                    })
                  }
                ></textarea>
              </div>

              <div class="col-span-2 text-right">
                <button
                  class={getButtonStyle()}
                  onClick={submitForm}
                  disabled={!canSendMessage()}
                >
                  Send
                </button>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </Show>
  );
}

export default ContactForm;