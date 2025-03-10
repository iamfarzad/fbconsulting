
import React from 'react';
import PageHeader from '@/components/PageHeader';
import ContactInfoCard from './ContactInfoCard';
import ContactForm from './ContactForm';
import BookingCalendarSection from './BookingCalendarSection';
import { trackEvent } from '@/services/analyticsService';

const ContactSection = () => {
  return (
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 relative z-10">
        <PageHeader
          title="Let's Work Together"
          subtitle="Book a consultation or send me a message"
        />

        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Card - Left Column */}
            <ContactInfoCard />

            {/* Contact Form - Center Column */}
            <ContactForm />
          </div>

          {/* Booking Calendar Section */}
          <BookingCalendarSection />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
