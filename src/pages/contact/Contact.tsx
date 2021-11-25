import { Component } from "solid-js";
import ContactForm from './../../components/contact-form/Contact-From';

const Contact: Component = () => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
      <div>
          <ContactForm />
      </div>

      <div>
          <h1>Right</h1>
      </div>
    </div>
  );
};

export default Contact;
