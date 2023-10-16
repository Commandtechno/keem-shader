import './App.css'
import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Effects } from '@react-three/drei';
import { GlitchPass } from "./GlitchPass";
import Eyes from './components/Eyes';
import { gsap } from "gsap";
import { shuffle } from 'txt-shuffle';
import {ReactComponent as Notch} from './Website-Notch.svg';
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

extend({ GlitchPass });

const App = () => {

   const isMobile = window.innerWidth <= 576; 
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState(false); // Permission state
   const [enter, isEnter] = useState(false)
  const charRef = useRef(null);
  const audioRef = useRef(new Audio('/assets/morse-1.wav'));

  const getPermssion = (e) => {
   if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      console.log('DeviceOrientationEvent is defined')
     DeviceOrientationEvent.requestPermission()
       .then((permissionState) => {
         if (permissionState === "granted") {
           setHasPermission(true);
         } else {
           console.error("Permission denied for device orientation.");
         }
       })
       .catch((error) => {
         console.error("Error requesting device orientation permission:", error);
       });
      }
   }

   useEffect(() => {
      if (hasPermission) {
        const handleDeviceOrientation = (event) => {
         const { alpha, beta, gamma } = event;  
          setDeviceOrientation({ alpha, beta, gamma });
        };
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        return () => {
          window.removeEventListener("deviceorientation", handleDeviceOrientation);
        };
      }
    }, [hasPermission]);

   //  - .... .  ..-. ..- - ..- .-. .  .. ...  . . .-. .. . the future is eerie
   // .-.. . .- .-. -. .. -. -- learning


   const items = ['.', '-', '.-.. . .- .-. -. .. -. --']

   // function shuffler () {
   //    shuffle({ text: 'learning', fps: 5, delay: 2, duration: 2, glyphs: ".-", direction: "random", onUpdate: (output) => {
   //       console.log(output);
   //       charRef.current.innerHTML = output
   //     } });
   // }
    useEffect(() => {
     if (enter || hasPermission) {
      let tl = gsap.timeline({ delay: 1})
      tl.to(charRef.current, {duration: audioRef.current.duration, text: ".-.. . .- .-. -. .. -. --", onStart: () => {
         audioRef.current.play()
      }, onComplete: () => { audioRef.current.pause(); 
         setInterval( () => {
            shuffle({ text: 'learning', fps: 5, delay: 0, duration: 10, glyphs: ".-.-.-.-", direction: "random", onUpdate: (output) => {
               console.log(output);
               charRef.current.innerHTML = output
             }, onComplete: () => {
                 shuffle({ text: '.-.. . .- .-. -. .. -. --', fps: 5, delay: 0, duration: 10, glyphs: "LEARNING", direction: "random", onUpdate: (output) => {
               charRef.current.innerHTML = output } });
             } });
         }, 20000)
      }})
      }
    },[enter, hasPermission])


  const onMouseMove = (event) => {
   if (!isMobile) {
   const { clientX, clientY } = event;
   const mouseX = (clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
      setMousePosition([mouseX, mouseY]);
   }};

  return (
    <>
      <div style={{ width: "100vw", height: "100%" }} onMouseMove={onMouseMove}>
     { isMobile && !hasPermission && 
     <div onClick={getPermssion} className="enter"> <p>ENTER</p></div> }
     { !isMobile && !enter &&
       <div onClick={() => isEnter(true)} className="enter"> <p>ENTER</p></div> }
         <div className='diction'>
             <p ref={charRef}></p>
         </div>
         <div className="notch">
         <Notch/>
         </div>
        <main
          style={{backgroundColor: '#fAfffA'}}>
          <Canvas camera={{ position: [0, 0, 300] }} >
               <Effects>
                  <glitchPass attach="passes"/>
               </Effects>
               <Suspense fallback={null}>     
               {isMobile ? (
                  <Eyes mousePosition={null} deviceOrientation={deviceOrientation} />
                  ) : (
                  <Eyes mousePosition={mousePosition} deviceOrientation={null} />
               )}
               </Suspense>
          </Canvas>
        </main>
      </div>
    </>
  );
};

export default App;
