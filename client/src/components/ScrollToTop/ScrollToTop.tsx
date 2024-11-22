import React, { useEffect, useState } from 'react';
import Button from '../Common/Button';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-10 right-28 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-blue-100 transition"
    >
      <FaArrowUp />
    </Button>
  );
};

export default ScrollToTop;
