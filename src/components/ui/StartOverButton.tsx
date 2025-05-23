
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useGeminiCopilot } from '@/components/copilot/GeminiCopilotProvider';
import { useToast } from '@/hooks/use-toast';

interface StartOverButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  confirmReset?: boolean;
}

export function StartOverButton({ 
  variant = 'outline', 
  size = 'default',
  className = '',
  confirmReset = true
}: StartOverButtonProps) {
  const { clearMessages } = useGeminiCopilot();
  const { toast } = useToast();
  
  const handleReset = () => {
    if (!confirmReset || confirm("Are you sure you want to start over? This will reset the conversation.")) {
      clearMessages?.();
      toast({
        description: 'Conversation reset successfully'
      });
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleReset}
    >
      <RotateCcw className="h-4 w-4" />
      Start Over
    </Button>
  );
}
