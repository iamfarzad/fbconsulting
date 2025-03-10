
import React from 'react';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BookingCalendar from '@/components/BookingCalendar';
import AnimatedText from '@/components/AnimatedText';

const BookingCalendarSection = () => {
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
            text="Select a date and time that works for you"
            tag="p"
            delay={200}
            className="text-muted-foreground"
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <BookingCalendar />
        </div>
        
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
