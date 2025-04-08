
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ContactInfoCard = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-4">Get In Touch</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email</p>
              <a href="mailto:contact@farzad-ai.com" className="text-muted-foreground hover:text-primary">
                contact@farzad-ai.com
              </a>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Phone</p>
              <a href="tel:+11234567890" className="text-muted-foreground hover:text-primary">
                +1 (123) 456-7890
              </a>
            </div>
          </div>
          
          <div className="flex gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">
                San Francisco, CA
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
