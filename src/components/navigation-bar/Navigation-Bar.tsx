import { Component, createEffect, createSignal } from "solid-js";
import { NavLink, Link, useLocation } from "solid-app-router";
import Logo from "./../../assets/logo.svg";

/**
 * Navigation Bar
 *
 * The Navigation Bar component.
 * For the Navigation Bar component, we use this:
 * https://tailwindcomponents.com/component/ecommerce-navbar
 */

const NavigationBar: Component = () => {
  // =======================================
  // Menu functions
  // =======================================

  // handles the menu state on mobile, and whether or not to show the menu.
  const [menuIsOpen, setMenuOpen] = createSignal(false);

  // Toggles the menu state.
  const toggleMenu = () => {
    setMenuOpen(!menuIsOpen());
  };

  // closes the menu.
  const closeMenu = () => {
    setMenuOpen(false);
  };
  // ==========================================

  // ==========================================
  // Navigation functions
  // ==========================================

  createEffect(() => {
    //const path = getRouteLocationPathName();
    const path = useLocation().pathname;
    closeMenu();
  });

  // ==========================================

  return (
    <nav class="bg-white shadow">
      <div class="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div class="flex justify-between items-center">
          <div>
            <Link
              class="text-gray-800 text-xl font-bold md:text-2xl hover:text-gray-700"
              href="/"
            >
              <figure class="flex items-center flex-shrink-0 text-white mr-6">
                <img src={Logo} alt="Logo" />
              </figure>
            </Link>
          </div>

          <div class="flex md:hidden">
            <button
              type="button"
              class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label="toggle menu"
              onClick={toggleMenu}
            >
              <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current">
                <path
                  fill-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div
          class={
            menuIsOpen()
              ? "md:flex items-center block"
              : "md:flex items-center hidden"
          }
        >
          <div class="flex flex-col md:flex-row md:mx-6">
            <NavLink
              class="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
              href="/"
            >
              Home
            </NavLink>
            <NavLink
              class="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
              href="/portfolio"
            >
              Portfolio
            </NavLink>
            <NavLink
              class="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
              href="/blog"
            >
              Blog
            </NavLink>
            <NavLink
              class="my-1 text-sm text-gray-700 font-medium hover:text-indigo-500 md:mx-4 md:my-0"
              href="/contact"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
