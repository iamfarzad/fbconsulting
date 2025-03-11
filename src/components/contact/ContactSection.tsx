
import React from 'react';
import PageHeader from '@/components/PageHeader';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import BookingCalendarSection from './BookingCalendarSection';
import { trackEvent } from '@/services/analyticsService';

const ContactSection = () => {
  React.useEffect(() => {
    trackEvent({
      action: 'page_view', 
      category: 'navigation', 
      label: 'contact'
    });
  }, []);

  return (
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 relative z-10">
        <PageHeader
          title="Let's Work Together"
          subtitle="Book a consultation or send me a message"
        />

        <div className="mt-12 space-y-12">
          {/* Main Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Contact Card - Left Column */}
            <div className="md:col-span-4">
              <ContactInfoCard />
            </div>

            {/* Contact Form - Right Column */}
            <div className="md:col-span-8">
              <ContactForm />
            </div>
          </div>

          {/* Booking Calendar Section */}
          <div className="border-t border-border/30 pt-12">
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">Schedule a Free Consultation</h3>
            <BookingCalendarSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
