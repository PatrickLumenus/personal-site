
import { useNavigate } from "solid-app-router";
import { Component, createSignal, createMemo, Show } from "solid-js";
import Spinner from "../../components/spinner/Spinner";
import UnsubscribeComplete from "../../components/unsubscribe-complete/UnsubscribeComplete";
import { recaptchaScriptLoading } from './../../App';

interface UnsubscribeFormField {
    value: string;
    hasChanged: boolean;
}

const Unsubscribe: Component = () => {
  // a flag to indicate
  const [hasUnsubscribed, setHasUnsubscribed] = createSignal(false);
  const [emailFormField, setEmailFormField] = createSignal({
      value: '',
      hasChanged: false
  } as UnsubscribeFormField);

  // determines if there is an email error.
  const emailError = createMemo(() => {
    const field = emailFormField();
    let error = "";
    const validEmailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"
    );
    
    if (field.hasChanged) {
        if (field.value.length == 0) {
            error = "This field is required";
        }
        else if (!validEmailRegex.test(field.value)) {
            error = "Please enter a valid email address.";
        }
    }

    return error.trim();
  });

  const initialized = createMemo(() => recaptchaScriptLoading());
  const [processing, setProcessing] = createSignal(false);


  return (
    <Show when={initialized()} fallback={<Spinner />}>
        <Show when = {!hasUnsubscribed()} fallback={<UnsubscribeComplete />}>
            <Show when = {!processing()} fallback={<Spinner />}>
                Form
            </Show>
        </Show>
    </Show>
  );
};

export default Unsubscribe;
