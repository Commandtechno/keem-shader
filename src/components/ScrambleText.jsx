import React, { useState, useEffect } from 'react';

const ScrambleText = ( { startAnim }) => {
  const targetString = "learning";
  const originalString = ".-.. . .- .-. -. .. -. --";
  const scrambleChars = ['.', '--', '-', '.'];
  const [scrambledString, setScrambledString] = useState(originalString);

  useEffect(() => {
   if (startAnim) {
    const scrambleInterval = setInterval(() => {
      setScrambledString((prevString) => scramble(prevString, targetString, scrambleChars));
    }, 500); // Update every 100ms

    setTimeout(() => {
      clearInterval(scrambleInterval);
    }, 10000); // Stop after 10 seconds

    return () => { clearInterval(scrambleInterval) }
   }
  }, []);

  const scramble = (str, target, chars) => {
    const indexToScramble = Math.floor(Math.random() * str.length);
    const scrambledArray = str.split('');
    if (str[indexToScramble] !== target[indexToScramble]) {
      scrambledArray[indexToScramble] = chars[Math.floor(Math.random() * chars.length)];
    }
    return scrambledArray.join('');
  };

  return (
      <p>{scrambledString}</p>
  );
};

export default ScrambleText;
