import { Component, createSignal, createMemo, Show } from "solid-js";
import Spinner from "../../components/spinner/Spinner";
import UnsubscribeComplete from "../../components/unsubscribe-complete/UnsubscribeComplete";
import { recaptchaKey } from "../../constants";
import { BadRequestException } from "../../utils/errors/bad-request.exception";
import { ForbiddenException } from "../../utils/errors/forbidden.exception";
import { NotFoundException } from "../../utils/errors/not-found.exception";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";
import { TooManyRequestsException } from "../../utils/errors/too-many-requests.exception";
import { recaptchaScriptLoading } from "./../../App";
import { unsubscribeEmail } from "./unsubscribe.fns";

interface UnsubscribeFormField {
  value: string;
  hasChanged: boolean;
}

const Unsubscribe: Component = () => {
  // a flag to indicate
  const [hasUnsubscribed, setHasUnsubscribed] = createSignal(false);
  const [emailField, setEmailField] = createSignal({
    value: "",
    hasChanged: false,
  } as UnsubscribeFormField);

  // indicates if there is a server error.
  const [serverError, setServerError] = createSignal("");

  // determines if there is an email error.
  const emailFieldError = createMemo(() => {
    const field = emailField();
    let error = "";
    const validEmailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"
    );

    if (field.hasChanged) {
      if (field.value.length == 0) {
        error = "This field is required";
      } else if (!validEmailRegex.test(field.value)) {
        error = "Please enter a valid email address.";
      }
    }

    return error.trim();
  });

  const initialized = createMemo(() => !recaptchaScriptLoading());
  const [processing, setProcessing] = createSignal(false);

  const canUnsubscribe = createMemo(() => {
    return emailField().value.length > 0 && emailFieldError().length == 0;
  });

  // determines the button style
  const getButtonStyle = () => {
    const enabledStyle =
      "py-3 px-6 bg-primary text-white font-bold w-full sm:w-32 rounded-lg";
    const disabledStyle =
      "py-3 px-6 bg-primary text-white font-bold w-full sm:w-32 opacity-50 rounded-lg";

    return canUnsubscribe() ? enabledStyle : disabledStyle;
  };

  const submitForm = async () => {
    setProcessing(true);
    setServerError("");
    const token = await grecaptcha.enterprise.execute(recaptchaKey, {
      action: "unsubscribe",
    });

    try {
      await unsubscribeEmail(emailField().value, token);

      setHasUnsubscribed(true);
    } catch (e) {
      let message = "";
      if (e instanceof BadRequestException) {
        // bad request
        message = "Invalid Email Address";
      } else if (e instanceof ForbiddenException) {
        message =
          "We cannot complete your request at this tiime. Sorry about that.";
      } else if (e instanceof NotFoundException) {
        // just so we don't give any snoopers any ideas, we just succeed even though the email was not found.
        // in a future update we need to switch to using the subscription id so it is a lot harder to brute force
        // removing people from the subscription list.
        setHasUnsubscribed(true);
      } else if (e instanceof TooManyRequestsException) {
        message = "Wow. Slow down partner.";
      } else if (e instanceof RequestTimedoutException) {
        message =
          "The server cannot be reached. Please try again in a little bit.";
      } else {
        // server exception
        message =
          "Something went wrong on our end. Please try again in a little bit.";
      }
      setServerError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Show when={initialized()} fallback={<Spinner />}>
      <Show when={!hasUnsubscribed()} fallback={<UnsubscribeComplete />}>
        <div class="max-w-2xl bg-white py-10 px-5 m-auto w-full mt-10">
          <div class="text-3xl mb-6 text-center">Are You Sure?</div>
          <div class="text-xl mb-6 text-center ">
            By unsubscribing, you will no longer receive emails and updates from
            us.
          </div>

          <Show when={serverError().trim().length > 0}>
            <div class="text-sm mb-6 text-center text-error">
              {serverError()}
            </div>
          </Show>

          <Show when={!processing()} fallback={() => <Spinner />}>
            <div class="grid grid-cols-2 gap-4 max-w-xl m-auto">
              <div class="col-span-2">
                <Show when={emailFieldError().length > 0}>
                  <div class="text-md mb-2 text-center text-error">
                    {emailFieldError()}
                  </div>
                </Show>
                <input
                  type="text"
                  class="border-solid border-gray-400 border-2 rounded-lg p-3 md:text-xl w-full"
                  placeholder="Email Address"
                  autocomplete="email"
                  value={emailField().value}
                  onInput={(e) => {
                    setEmailField({
                      hasChanged: true,
                      value: e.currentTarget.value,
                    });
                    setServerError("");
                  }}
                />
              </div>

              <div class="col-span-2 text-right">
                <button
                  class={getButtonStyle()}
                  onClick={submitForm}
                  disabled={!canUnsubscribe()}
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
};

export default Unsubscribe;
