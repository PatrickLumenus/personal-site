import { Component } from "solid-js";
import { missionText } from "../../constants";

/**
 * AboutMe
 *
 * The AboutMe component
 */

const Mission: Component = () => {
  return (
    <div class="max-w-6xl mx-auto md:px-6 px-4">
      <div class="md:py-8 py-4">
        <div class="md:pb-20 pb-12 max-w-3xl mx-auto text-center ">
          <h2 class="md:text-6xl text-4xl text-primary dark:text-white font-bold mb-4">
            About Me
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">{missionText}</p>
        </div>
      </div>
    </div>
  );
};

export default Mission;
