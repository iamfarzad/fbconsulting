
import React from 'react';
import { ShareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ShareSection: React.FC = () => {
  return (
    <div className="border-t border-b py-6 my-8">
      <div className="flex items-center justify-between">
        <div className="font-medium">Share this article</div>
        <div className="flex space-x-4">
          <Button variant="outline" size="icon">
            <ShareIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
