
import { ContactInfo } from './ContactInfo';
import { ContactFormFields } from './ContactFormFields';

export function ContactCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl animate-fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ContactInfo />
        <ContactFormFields />
      </div>
    </div>
  );
}
