
import React from 'react';
import { GraphicCard, CardType } from './GraphicCard';

interface GraphicCardCollectionProps {
  cards: Array<{
    type: CardType;
    title: string;
    description: string;
    variant?: 'default' | 'bordered' | 'minimal';
  }>;
  variant?: 'default' | 'bordered' | 'minimal';
}

export const GraphicCardCollection: React.FC<GraphicCardCollectionProps> = ({ 
  cards, 
  variant = 'default' 
}) => {
  return (
    <div className="flex flex-col gap-2 my-2 w-full">
      {cards.map((card, index) => (
        <GraphicCard
          key={index}
          type={card.type}
          title={card.title}
          description={card.description}
          variant={card.variant || variant}
        />
      ))}
    </div>
  );
};
