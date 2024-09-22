import { useRef, useEffect } from "react";
import { shuffle } from "txt-shuffle";
import audioSrc from "../assets/morse-1.wav";

const ScrambleText = ({ enter, hasPermission }) => {
  const charRef = useRef(null);
  const targetString = "learning";
  const originalString = ".-.. . .- .-. -. .. -. --";
  let isPlaying = false;

  useEffect(() => {
    if (enter || hasPermission) {
      const audio = new Audio(audioSrc);
      shuffle({
        text: targetString,
        fps: 24,
        direction: "random",
        glyphs: originalString,
        onUpdate: output => {
          if (isPlaying) {
            charRef.current.innerText = output;
          } else {
            audio.play();
            isPlaying = true;
          }
        }
        // onComplete: () => {
        //   audio.pause();
        // }
      });

      //  let tl = gsap.timeline({ delay: 1, duration: audioRef.current.duration})

      //  tl.to(charRef.current, {
      // onStart: () => {
      //     audioRef.current.play()
      //    //  shuffle({ text: targetString, fps: 25, onUpdate: (output) => {
      //    //    charRef.current.innerText = output
      //    //  } });
      //  },
      //  onComplete: () => {
      //     audioRef.current.pause();
      //    //  charRef.current.innerText = targetString
      //  }})
    }
  }, [enter, hasPermission]);

  return <p ref={charRef}></p>;
};

export default ScrambleText;
