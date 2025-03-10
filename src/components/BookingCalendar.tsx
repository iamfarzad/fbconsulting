
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, startOfDay } from 'date-fns';
import { trackEvent } from '@/services/analyticsService';
import { CalendarDays, Clock, Check } from 'lucide-react';

// Dummy time slots
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

interface BookingCalendarProps {
  onBookingSelected?: (date: Date | undefined, time: string | null) => void;
}

const BookingCalendar = ({ onBookingSelected }: BookingCalendarProps) => {
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

    if (onBookingSelected) {
      // If using the confirmation step, pass data to parent
      onBookingSelected(date, selectedTime);
    } else {
      // Legacy direct booking flow (for backward compatibility)
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
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-teal-600 mb-4">
          <CalendarDays size={20} />
          <h3 className="font-medium">Select Date</h3>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => {
              // Disable dates in the past and more than 30 days in the future
              return date < today || date > thirtyDaysFromNow;
            }}
            className="rounded-md"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-teal-600 mb-4">
          <Clock size={20} />
          <h3 className="font-medium">Select Time</h3>
        </div>
        
        {date ? (
          <div className="bg-white rounded-lg p-6 shadow-sm h-full">
            <h4 className="font-medium mb-4">
              Available on {format(date, 'MMMM d, yyyy')}:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={`justify-start px-4 py-6 text-base font-normal ${
                    selectedTime === time 
                      ? 'bg-teal-50 text-teal-700 border-teal-300 hover:bg-teal-100' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {selectedTime === time && (
                    <Check size={16} className="mr-2 text-teal-600" />
                  )}
                  {time}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={handleBooking}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white"
              disabled={!date || !selectedTime}
            >
              {onBookingSelected ? "Continue to Confirm" : "Confirm Booking"}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <Clock size={36} className="mb-3 opacity-40" />
            <p>Please select a date first to see available time slots</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
