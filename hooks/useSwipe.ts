
import { useState } from 'react';

interface SwipeInput {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
}

interface SwipeOutput {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const useSwipe = (input: SwipeInput): SwipeOutput => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartVertical, setTouchStartVertical] = useState<number | null>(null);
  const [touchEndVertical, setTouchEndVertical] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchEndVertical(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartVertical(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndVertical(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartVertical || !touchEndVertical) return;
    
    const distanceHorizontal = touchStart - touchEnd;
    const distanceVertical = touchStartVertical - touchEndVertical;

    const isHorizontalSwipe = Math.abs(distanceHorizontal) > Math.abs(distanceVertical);

    if (isHorizontalSwipe) {
      if (Math.abs(distanceHorizontal) < minSwipeDistance) return;
      const isLeftSwipe = distanceHorizontal > 0;
      if (isLeftSwipe) {
        input.onSwipedLeft?.();
      } else {
        input.onSwipedRight?.();
      }
    } else {
      if (Math.abs(distanceVertical) < minSwipeDistance) return;
      const isUpSwipe = distanceVertical > 0;
      if (isUpSwipe) {
        input.onSwipedUp?.();
      } else {
        input.onSwipedDown?.();
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartVertical(null);
    setTouchEndVertical(null);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
