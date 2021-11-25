import { Component } from "solid-js";

const Spinner: Component = () => {
  return (
    <div class="grid place-items-center h-full">
      <div
        style="border-top-color:transparent"
        class="w-16 h-16 border-4 border-primary border-solid rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Spinner;
