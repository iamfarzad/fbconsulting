
import React from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ContactInfoCard = () => {
  return (
    <Card className="lg:col-span-2 overflow-hidden shadow-md border-0">
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-8">
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:Farzad@fbconsulting.com" className="text-white/90 hover:text-white">
                Farzad@fbconsulting.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Phone className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-white/90">+47 94446446</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-white/90">Oslo, Norway</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Clock className="w-5 h-5 mt-1" />
            <div>
              <p className="font-medium">Office Hours</p>
              <p className="text-white/90">Mon-Fri: 9am-5pm PST</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactInfoCard;
