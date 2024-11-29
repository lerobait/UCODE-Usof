import { useEffect, useRef } from 'react';

// Custom hook to observe intersection of an element with the viewport
export const useObserver = (
  ref: React.MutableRefObject<HTMLDivElement | null>, // Reference to the element to be observed
  canLoad: boolean, // Flag to indicate if loading is allowed
  isLoading: boolean, // Flag to indicate if loading is in progress
  callback: () => void, // Callback to execute when the element becomes visible
) => {
  const observer = useRef<IntersectionObserver | null>(null); // Reference to the IntersectionObserver instance

  useEffect(() => {
    if (isLoading) return; // Prevent observer activation while loading
    if (observer.current) observer.current.disconnect(); // Disconnect any previous observer

    // Callback function for intersection changes
    const cb = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && canLoad) {
        // If element is in view and loading is allowed
        callback(); // Trigger the callback
      }
    };

    observer.current = new IntersectionObserver(cb); // Create a new IntersectionObserver
    if (ref.current) observer.current.observe(ref.current); // Start observing the element

    return () => {
      if (observer.current) observer.current.disconnect(); // Cleanup observer on component unmount or dependency change
    };
  }, [isLoading, canLoad, callback, ref]); // Dependencies that will trigger the effect
};
