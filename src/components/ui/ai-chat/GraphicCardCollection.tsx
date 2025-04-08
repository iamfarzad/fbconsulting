
import React from 'react';
import GraphicCard, { type CardType } from './GraphicCard';

interface Card {
  type: CardType;
  title: string;
  content: React.ReactNode;
  variant?: 'default' | 'bordered' | 'minimal';
}

interface GraphicCardCollectionProps {
  cards: Card[];
  className?: string;
  columns?: 1 | 2 | 3;
}

const GraphicCardCollection: React.FC<GraphicCardCollectionProps> = ({
  cards,
  className = '',
  columns = 1,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-4 my-4 ${className}`}>
      {cards.map((card, i) => (
        <GraphicCard
          key={i}
          type={card.type}
          title={card.title} 
          variant={card.variant || 'default'}
        >
          {card.content}
        </GraphicCard>
      ))}
    </div>
  );
};

export default GraphicCardCollection;
