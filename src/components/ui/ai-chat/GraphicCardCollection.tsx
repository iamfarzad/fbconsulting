
import React from 'react';
import { GraphicCard, CardType } from './GraphicCard';

interface GraphicCardCollectionProps {
  cards: Array<{
    type: CardType;
    title: string;
    description: string;
  }>;
}

export const GraphicCardCollection: React.FC<GraphicCardCollectionProps> = ({ cards }) => {
  return (
    <div className="flex flex-col gap-2 my-2 w-full">
      {cards.map((card, index) => (
        <GraphicCard
          key={index}
          type={card.type}
          title={card.title}
          description={card.description}
        />
      ))}
    </div>
  );
};
