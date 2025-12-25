import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Rect, Path, Skia } from '@shopify/react-native-skia';
import { DetectedCard } from './CardDetector';

export interface DetectedSet {
  cards: [DetectedCard, DetectedCard, DetectedCard];
  confidence: number;
}

interface CardOverlayProps {
  detectedCards: DetectedCard[];
  detectedSets: DetectedSet[];
  width: number;
  height: number;
}

export const CardOverlay: React.FC<CardOverlayProps> = ({
  detectedCards,
  detectedSets,
  width,
  height,
}) => {
  const renderCardBounds = () => {
    const elements: React.ReactElement[] = [];

    detectedCards.forEach(card => {
      const isInSet = detectedSets.some(set =>
        set.cards.some(setCard => setCard.id === card.id),
      );

      const color = isInSet ? '#00FF00' : '#FFFF00';

      elements.push(
        <Rect
          key={`card-${card.id}`}
          x={card.bounds.x}
          y={card.bounds.y}
          width={card.bounds.width}
          height={card.bounds.height}
          style="stroke"
          strokeWidth={3}
          color={color}
        />,
      );
    });

    return elements;
  };

  const renderSetHighlights = () => {
    const elements: React.ReactElement[] = [];

    detectedSets.forEach((set, setIndex) => {
      const setColors = ['#FF0000', '#00FF00', '#0000FF'];
      const color = setColors[setIndex % setColors.length];

      set.cards.forEach((card, cardIndex) => {
        const path = Skia.Path.Make();

        card.corners.forEach((corner, cornerIndex) => {
          if (cornerIndex === 0) {
            path.moveTo(corner.x, corner.y);
          } else {
            path.lineTo(corner.x, corner.y);
          }
        });
        path.close();

        elements.push(
          <Path
            key={`set-${setIndex}-card-${cardIndex}`}
            path={path}
            style="stroke"
            strokeWidth={4}
            color={color}
          />,
        );
      });
    });

    return elements;
  };

  return (
    <View style={[styles.overlay, { width, height }]}>
      <Canvas style={{ width, height }}>
        {renderCardBounds()}
        {renderSetHighlights()}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});
