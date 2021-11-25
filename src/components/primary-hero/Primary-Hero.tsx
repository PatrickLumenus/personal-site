import { Component } from "solid-js";
import { Link } from "solid-app-router";
import "./primary-hero.css";
import { heroSubtitle, heroTitle } from "../../constants";

/**
 * Hero
 *
 * A Hero component.
 * For the Hero component, we used this:
 * https://tailwindcomponents.com/component/heros
 */

const Hero: Component = () => {
  return (
    <div class="w-full h-screen bg-center bg-no-repeat bg-cover hero-background-image">
      <div class="w-full h-screen bg-opacity-50 bg-black flex justify-center items-center">
        <div class="mx-4 text-center text-white">
          <h1 class="font-bold text-6xl mb-4">{heroTitle}</h1>
          <h2 class="font-bold text-3xl mb-12">{heroSubtitle}</h2>
          <div>
            <Link
              href="/portfolio"
              class="bg-primary rounded-md font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-white hover:text-primary mr-2"
            >
              See Portfolio
            </Link>
            <Link
              href="/contact"
              class="bg-secondary rounded-md font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-white hover:text-secondary ml-2"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
