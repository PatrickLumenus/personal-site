import { 
  Component, 
  Show, 
  createMemo, 
  createSignal} from "solid-js";
import {
  createMailingListSubscription,
  getEmailErrors,
  getNameErrors,
} from "./mailing-list-registration.fns";
import MessageBox from "./../../components/message-box/MessageBox";
import Spinner from "./../../components/spinner/Spinner";
import { ForbiddenException } from "../../utils/errors/forbidden.exception";
import { ConflictException } from "../../utils/errors/conflict.exception";
import { TooManyRequestsException } from "../../utils/errors/too-many-requests.exception";
import { ServerErrorException } from "../../utils/errors/server-error.exception";
import { recaptchaKey } from "../../constants";
import { recaptchaScriptLoading } from "../../App";

import mailinglistBg from './../../assets/mailing-list-bg.jpg';

interface FormField {
  value: string;
  hasChanged: boolean;
}

/**
 * The MailingListRegistration Component
 * 
 * The mailing list component creates a mailing list subscriber.
 */

const MailingListRegistration: Component = () => {
  const initializing = createMemo(() => {
    return recaptchaScriptLoading();
  });

  // loads the recaptcha

  // general error
  const [error, setError] = createSignal("");

  // the name field.
  const [nameField, setNameField] = createSignal({
    value: "",
    hasChanged: false,
  } as FormField);

  const nameError = createMemo(() => {
    let message = "";
    const fieldInfo = nameField();

    if (fieldInfo.hasChanged) {
      message = getNameErrors(fieldInfo.value);
    }

    return message.trim();
  });

  // the email field.
  const [emailField, setEmailField] = createSignal({
    value: "",
    hasChanged: false,
  } as FormField);

  const emailError = createMemo(() => {
    const fieldInfo = emailField();
    let message = "";

    if (fieldInfo.hasChanged) {
      message = getEmailErrors(fieldInfo.value);
    }

    return message.trim();
  });

  // form submissiion.

  /**
   * Determines if the form can be submitted.
   */
  const canSubmitForm = createMemo(() => {
    const noErrors = (nameError().length == 0) && (emailError().length == 0);
    const formCompleted = (nameField().value.length > 0) && (emailField().value.length > 0);
    return noErrors && formCompleted;
  });

  /**
   * Indicates the form is processing.
   */

  const [processingSubscription, setProcessingSubscription] =
    createSignal(false);
  const [formSubmitted, setFormSubmitted] = createSignal(false);

  /**
   * submits the form.
   */
  const submitForm = async () => {
    try {
      setError("");
      setProcessingSubscription(true);
      await createMailingListSubscription({
        email: emailField().value,
        name: nameField().value,
        token: await grecaptcha.enterprise.execute( recaptchaKey, { action: 'subscribe' })
      });
      setFormSubmitted(true);
    } catch (e) {
      // an error occured.

      if (e instanceof ForbiddenException) {
        // they likely failed human checks.
        setError("We are unable to complete the operation.");
      } else if (e instanceof ConflictException) {
        // email already in use.
        setError("That email address is already in use by someone else.");
      } else if (e instanceof TooManyRequestsException) {
        // you are being rate limited.
        setError("Too many requests. Slow down, partner.");
      } else if (e instanceof ServerErrorException) {
        setError(
          "Something went wrong on our end. Please try again in a little bit."
        );
      } else {
        // server cannot be reached.
        setError(
          "The server cannot be reached. Please try again in a little bit."
        );
      }
    } finally {
      setProcessingSubscription(false);
    }
  };

  /**
   * determines the styles of the submit button.
   */
  const submitButtonStyle = createMemo(() => {
    if (canSubmitForm()) {
      return "w-full text-white p-2 bg-primary rounded-lg text-center";
    }
    else {
      return "w-full text-white p-2 bg-primary rounded-lg text-center opacity-50";
    }
  });

  const reset = () => {
    // reset the form fields.
    setEmailField({ value: "", hasChanged: false});
    setNameField({value: "", hasChanged: false});
    setFormSubmitted(false);
    setError("");
  };

  /**
   * getBgStyles()
   * 
   * gets the background styles.
   */
  const getBgStyles = (): string => {
    return `background-repeat: no-repeat; background-size: cover; background-blend-mode: multiply;background-position: center center;background-image: url('${mailinglistBg}');`;
  }

  return (
    <Show when={!initializing()} fallback={<Spinner />}>
      <div
        class="w-full flex flex-row flex-wrap bg-gray-600 p-10 py-20 justify-center"
        style={getBgStyles()}
      >
        <div class="w-full text-center">
          <h1 class="text-3xl text-center text-white antialiased">
            Stay in the Loop
          </h1>
          <p class="text-xl text-center text-white antialiased">
            Stay in the loop about latest project updates and other content.
          </p>
        </div>

        <Show when={error().length > 0}>
          <div class="w-full text-center">
            <p class="text-md text-center text-error antialiased">{error()}</p>
          </div>
        </Show>

        <Show when={!processingSubscription()} fallback={<Spinner />}>
          <Show
            when={!formSubmitted()}
            fallback={
              <MessageBox
                message="Thanks for Subscribing."
                actionText="Ok"
                onConfirm={reset}
              />
            }
          >
            <div class="mt-3 flex flex-row flex-wrap">
              <div class="my-2 text-gray-600  w-full">
                <Show when={nameError().length > 0}>
                  <p class="text-md text-center text-error antialiased">
                    {nameError()}
                  </p>
                </Show>
                <input
                  type="text"
                  name="name"
                  class="w-full p-2 rounded-lg"
                  placeholder="Name"
                  autocomplete="name"
                  value={emailField().value}
                  onInput={(e) =>
                    setNameField({
                      value: e.currentTarget.value,
                      hasChanged: true,
                    })
                  }
                />
              </div>
              <div class="my-2 text-gray-600  w-full">
                <Show when={emailError().length > 0}>
                  <p class="text-md text-center text-error antialiased">
                    {emailError()}
                  </p>
                </Show>
                <input
                  type="text"
                  name="email"
                  class="w-full p-2 rounded-lg"
                  placeholder="email"
                  autocomplete="email"
                  value={emailField().value}
                  onInput={(e) =>
                    setEmailField({
                      value: e.currentTarget.value,
                      hasChanged: true,
                    })
                  }
                />
              </div>
              <div class="my-2 w-full">
                <button
                  class={submitButtonStyle()}
                  type="submit"
                  onClick={submitForm}
                  disabled={!canSubmitForm()}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </Show>
        </Show>
      </div>
    </Show>
  );
};

export default MailingListRegistration;
