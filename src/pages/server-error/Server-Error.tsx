import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

const ServerError: Component = () => {
  const navigate = useNavigate();

  return (
    <div class="w-screen flex items-center p-8">
      <div class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div class="max-w-md">
          <div class="text-5xl font-dark font-bold">500</div>
          <p class="text-2xl md:text-3xl font-light leading-normal">
            It seems that someone was messing with the wiring again.
          </p>
          <p class="mb-8">Sorry about that. Do try again later.</p>

          <button
            onClick={() => navigate("/")}
            class="bg-primary rounded-md font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-white hover:text-primary mr-2"
          >
            Take Me Home
          </button>
        </div>
        <div class="max-w-lg"></div>
      </div>
    </div>
  );
};

export default ServerError;
