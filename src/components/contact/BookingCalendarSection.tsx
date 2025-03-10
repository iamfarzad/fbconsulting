
import React, { useState } from 'react';
import { Clock, ArrowLeft, CalendarCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BookingCalendar from '@/components/BookingCalendar';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const BookingCalendarSection = () => {
  const [bookingDetails, setBookingDetails] = useState<{
    date: Date | undefined;
    time: string | null;
  }>({ date: undefined, time: null });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleBookingSelected = (date: Date | undefined, time: string | null) => {
    setBookingDetails({ date, time });
    setShowConfirmation(true);
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="mt-16">
      <Card className="p-8 border-0 shadow-md bg-white/50">
        <div className="text-center mb-8">
          <AnimatedText
            text="Schedule a Free Consultation"
            tag="h2"
            className="text-2xl font-bold mb-2"
          />
          <AnimatedText
            text={showConfirmation 
              ? "Confirm your booking details" 
              : "Select a date and time that works for you"}
            tag="p"
            delay={200}
            className="text-muted-foreground"
          />
        </div>
        
        {showConfirmation ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-teal-50 rounded-lg p-6 mb-6 border border-teal-100">
              <div className="flex items-center justify-center mb-4">
                <CalendarCheck size={28} className="text-teal-600 mr-2" />
                <h3 className="text-lg font-medium text-teal-700">Booking Summary</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">
                      {bookingDetails.date ? format(bookingDetails.date, 'MMMM d, yyyy') : 'Not selected'}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Time</p>
                    <p className="font-medium">
                      {bookingDetails.time || 'Not selected'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-medium">Free 30-minute consultation</p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Calendar
                </Button>
                
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!bookingDetails.date || !bookingDetails.time}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <BookingCalendar onBookingSelected={handleBookingSelected} />
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Clock size={14} />
            All consultations are 30 minutes and completely free of charge
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BookingCalendarSection;
