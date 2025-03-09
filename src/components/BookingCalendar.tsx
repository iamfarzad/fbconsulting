
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, startOfDay } from 'date-fns';
import { trackEvent } from '@/services/analyticsService';

// Dummy time slots
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const BookingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate available dates (next 30 days)
  const today = startOfDay(new Date());
  const thirtyDaysFromNow = addDays(today, 30);

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select both a date and time.",
      });
      return;
    }

    // This would normally send to the Calendly API
    toast({
      title: "Consultation booked!",
      description: `Your consultation is scheduled for ${format(date, 'MMMM d, yyyy')} at ${selectedTime}.`,
    });
    
    // Track the lead generation event for consultation booking
    trackEvent({
      action: 'generate_lead',
      category: 'conversion',
      label: 'consultation_booking',
      value: 10, // Higher value assigned to consultation bookings
      lead_type: 'consultation',
      lead_source: window.location.pathname,
      booking_date: format(date, 'yyyy-MM-dd'),
      booking_time: selectedTime,
    });
    
    console.log('Lead generated: Consultation booking', {
      date: format(date, 'yyyy-MM-dd'),
      time: selectedTime
    });
    
    // Reset form
    setDate(undefined);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => {
            // Disable dates in the past and more than 30 days in the future
            return date < today || date > thirtyDaysFromNow;
          }}
          className="rounded-md border shadow-sm"
        />
      </div>
      
      {date && (
        <div className="space-y-4">
          <h3 className="font-medium">
            Available times for {format(date, 'MMMM d, yyyy')}:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="text-sm"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={handleBooking}
            className="w-full mt-4"
            disabled={!date || !selectedTime}
          >
            Book Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
