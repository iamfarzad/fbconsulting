
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const ContactInfoCard = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>contact@example.com</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>123 AI Street, Tech City</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-3">Business Hours</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
