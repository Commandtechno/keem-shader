import { useRef, useEffect, useState } from "react";
import { shuffle } from "txt-shuffle";
import audioSrc from "../assets/morse-1.wav";

const ScrambleText = ({ enter, hasPermission }) => {
  const [chars, setChars] = useState("");
  const audioRef = useRef(null);
  const [canPlayThrough, setCanPlayThrough] = useState(false);
  const targetString = "learning";
  const originalString = ".-.. . .- .-. -. .. -. --.";

  useEffect(() => {
    if ((enter || hasPermission) && canPlayThrough) {
      audioRef.current.play();
      shuffle({
        text: targetString,
        fps: 24,
        direction: "random",
        glyphs: originalString,
        duration: audioRef.current.duration,
        onUpdate: output => {
          setChars(output);
        }
        //  onComplete: () => {
        //    audio.pause();
        //  }
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
  }, [enter, hasPermission, canPlayThrough]);

  return (
    <>
      <audio ref={audioRef} src={audioSrc} autoplay preload onCanPlayThrough={() => setCanPlayThrough(true)} />
      <p>{chars}</p>
    </>
  );
};

export default ScrambleText;
