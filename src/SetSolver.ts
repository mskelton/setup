import { solve } from 'solver';
import { DetectedCard } from './CardDetector';
import type { DetectedSet } from './CardOverlay';

export class SetSolver {
  findSets(cards: DetectedCard[]): DetectedSet[] {
    const validCards = cards.filter(card => card.attributes !== undefined);

    if (validCards.length < 3) {
      return [];
    }

    const encodedCards = validCards.map(card => {
      const attrs = card.attributes!;
      return (
        (attrs.fill << 6) |
        (attrs.color << 4) |
        (attrs.number << 2) |
        attrs.shape
      );
    });

    try {
      const result = solve(new Int32Array(encodedCards));

      if (result) {
        const setCards: [DetectedCard, DetectedCard, DetectedCard] = [
          validCards[result[0]],
          validCards[result[1]],
          validCards[result[2]],
        ];

        return [
          {
            cards: setCards,
            confidence: 1.0,
          },
        ];
      }
    } catch (error) {
      console.warn('Set solver error:', error);
    }

    return [];
  }

  private isValidSet(
    card1: DetectedCard,
    card2: DetectedCard,
    card3: DetectedCard,
  ): boolean {
    if (!card1.attributes || !card2.attributes || !card3.attributes) {
      return false;
    }

    const attrs = ['number', 'shape', 'color', 'fill'] as const;

    return attrs.every(attr => {
      const values = [
        card1.attributes![attr],
        card2.attributes![attr],
        card3.attributes![attr],
      ];
      const uniqueValues = new Set(values);
      return uniqueValues.size === 1 || uniqueValues.size === 3;
    });
  }
}
