import { useRoutes } from "solid-app-router";
import { Component, createSignal } from "solid-js";
import { routes } from "./routes";
import NavigationBar from "./components/navigation-bar/Navigation-Bar";
import Footer from './components/footer/Footer';
import { createScriptLoader } from "@solid-primitives/script-loader";
import { recaptchaKey } from "./constants";

// indicates the reCAPTCHA script is loading.
export const [recaptchaScriptLoading, setRecaptchaScriptLoading] = createSignal(true);

const App: Component = () => {
  const Routes = useRoutes(routes);

  createScriptLoader({
    src: `https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`,
    onload: () => setRecaptchaScriptLoading(false),
  });

  return (
    <>
      <NavigationBar />
      <Routes />
      <Footer />
    </>
  );
};

export default App;
