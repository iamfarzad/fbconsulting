
import React from 'react';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ContactInfoCard = () => {
  return (
    <Card className="overflow-hidden shadow-md border border-border/50 h-full">
      <div className="bg-gradient-to-br from-violet-500 to-violet-700 text-white p-8">
        <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
        <div className="space-y-8">
          <div className="flex items-start gap-4 group">
            <div className="mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium mb-1">Email</p>
              <a 
                href="mailto:Farzad@fbconsulting.com" 
                className="text-white/90 hover:text-white transition-colors"
              >
                Farzad@fbconsulting.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium mb-1">Phone</p>
              <p className="text-white/90">+47 94446446</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium mb-1">Location</p>
              <p className="text-white/90">Oslo, Norway</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="mt-1 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium mb-1">Office Hours</p>
              <p className="text-white/90">Mon-Fri: 9am-5pm CET</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactInfoCard;
