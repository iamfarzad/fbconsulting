
const BookingCalendarSection = () => {
  return (
    <div className="py-12 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Schedule a Consultation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Book a time that works for you and let's discuss how I can help your business leverage AI.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-background rounded-lg border p-6">
          {/* Placeholder for actual calendar component */}
          <div className="h-[400px] flex items-center justify-center bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Calendar component will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendarSection;
