
import React from 'react';

const BookingCalendarSection = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Schedule a Consultation</h2>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          Choose a convenient time for a detailed discussion about your project needs.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-3xl mx-auto">
          <div className="text-center py-16">
            <p>Calendar integration will be implemented soon.</p>
            <p className="text-gray-500 mt-2">Please check back later or contact us directly.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCalendarSection;
