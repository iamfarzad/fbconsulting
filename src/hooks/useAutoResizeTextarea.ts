
import { useRef, useCallback, useEffect } from 'react';

interface UseAutoResizeTextareaOptions {
  minHeight?: number;
  maxHeight?: number;
}

export function useAutoResizeTextarea({
  minHeight = 60,
  maxHeight = 200
}: UseAutoResizeTextareaOptions = {}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to allow proper calculation
    textarea.style.height = 'auto';
    
    // Set new height (constrained by min/max heights)
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
    textarea.style.height = `${newHeight}px`;
    
    // If content exceeds max height, enable scrolling
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [minHeight, maxHeight]);

  // Initialize height on mount
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);
  
  return { textareaRef, adjustHeight };
}

export default useAutoResizeTextarea;
