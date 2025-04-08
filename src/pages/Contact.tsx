
import ContactForm from '@/components/contact/ContactForm';
import BookingCalendarSection from '@/components/contact/BookingCalendarSection';
import ContactInfoCard from '@/components/contact/ContactInfoCard';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about how AI can transform your business? Need expert consulting on your next AI project?
            I'm here to help.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ContactForm />
          <ContactInfoCard />
        </div>
      </div>
      
      <BookingCalendarSection />
    </div>
  );
};

export default Contact;
