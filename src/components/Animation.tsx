import React, { useEffect, useState } from "react";

export const TextAnimator = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const letters = "abcdeghijkmnopqrstuvwxyz";

    useEffect(() => {
      let iterations = 0;
      const maxIterations = text.length < 10 ? text.length * 2 : text.length;
      const interval = setInterval(() => {
        iterations++;
        const newText = text.split('').map((char, index) => {
          if (char === ' ' || char === '.') return char;
          if (text.length < 10 && index < Math.floor(iterations / 2)) {
            return char;
          } else if (text.length >= 10 && index < iterations) {
            return char;
          }
          return letters[Math.floor(Math.random() * letters.length)];
        }).join('');
  
        setDisplayText(newText);
  
        if (iterations >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text); 
        }
      }, 60);
  
      return () => clearInterval(interval);
    }, [text]); 
  
    return <span className="text-nowrap">{displayText}</span>
  };