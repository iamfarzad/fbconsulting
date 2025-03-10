
import React from 'react';

interface WaveformBarsProps {
  isRecording: boolean;
  small?: boolean;
}

export const WaveformBars: React.FC<WaveformBarsProps> = ({ isRecording, small = false }) => {
  return (
    <div className={`flex items-end gap-[2px] ${small ? 'h-4 w-8' : 'h-8 w-20'}`}>
      {[...Array(small ? 4 : 9)].map((_, i) => (
        <div
          key={i}
          className={`
            w-1 bg-white/70
            transition-all duration-75 rounded-t-sm
          `}
          style={{ 
            height: isRecording ? `${Math.random() * 100}%` : '33%',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};
