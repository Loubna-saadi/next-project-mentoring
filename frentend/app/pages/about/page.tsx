'use client'
import { useEffect } from 'react';
interface FormData {
  [key: string]: FormDataEntryValue;
}

const VismeForm = () => {
  useEffect(() => {
    const handleFormSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const formValues: FormData = {};
      formData.forEach((value, key) => {
        formValues[key] = value;
      });
      console.log('Form data:', formValues);
    };

    const formContainer = document.querySelector('.visme_d');
    const form = formContainer?.querySelector('form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
      }
    };
  }, []);

  return (
    <div>
      <div className="visme_d" data-title="Untitled Project" data-url="76neyegx-untitled-project" data-domain="forms" data-full-page="false" data-min-height="500px" data-form-id="70245"></div>
      <script src="https://static-bundles.visme.co/forms/vismeforms-embed.js"></script>
    </div>
  );
};

export default VismeForm;
