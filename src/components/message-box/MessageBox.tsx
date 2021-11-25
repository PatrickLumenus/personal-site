import { Component } from "solid-js";

interface MessageBoxProps {
  message: string;
  actionText: string;
  onConfirm: () => void;
}

const MessageBox: Component<MessageBoxProps> = (props) => {
  const confirm = props.onConfirm ? props.onConfirm : () => {};

  return (
    <div class="max-w-screen-lg bg-white rounded-lg mx-auto text-center py-12 mt-4">
      <h2 class="text-3xl leading-9 font-bold tracking-tight text-primary sm:text-4xl sm:leading-10">
        {props.message}
      </h2>
      <div class="mt-8 flex justify-center">
        <div class="inline-flex rounded-md bg-white shadow">
          <button
            class="button text-primary font-bold py-2 px-6"
            onClick={props.onConfirm}
          >
            {props.actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
