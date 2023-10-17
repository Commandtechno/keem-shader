import './App.css'
import React, { useRef, useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Effects, Environment } from '@react-three/drei';
import { gsap } from "gsap-trial"
import {ReactComponent as Learning} from './learning.svg';
import Eyes from './components/Eyes';
<<<<<<< Updated upstream
import { Suspense } from "react";

const App = () => {

   const isMobile = window.innerWidth <= 576;
  const [mousePosition, setMousePosition] = useState([0, 0]);
 
  const mainRef = useRef(null);
=======
import { gsap } from "gsap";
import ScrambleText from './components/ScrambleText';
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
   const [startAnim, setStartAnim] = useState(false)

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

// ".-.. . .- .-. -. .. -. --"
    useEffect(() => {
     if (enter || hasPermission) {
      let tl = gsap.timeline({ delay: 1})
      tl.to(charRef.current, {duration: audioRef.current.duration, 
         text: "L e a r n i n g", onStart: () => {
         audioRef.current.play()
      }, onComplete: () => { 
         audioRef.current.pause(); 
         // setStartAnim(true) 
      }})
      }
    },[enter, hasPermission])

>>>>>>> Stashed changes


  const onMouseMove = (event) => {
   if (!isMobile) {
   const { clientX, clientY } = event;
   const mouseX = (clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
   setMousePosition([mouseX, mouseY]);
   }};

  return (
    <>
<<<<<<< Updated upstream
      <div style={{ width: "100vw", height: "100%" }} 
      onMouseMove={onMouseMove}>
         <div className='diction'>      
         <p>LEARNING</p>
=======
      <div style={{ width: "100vw", height: "100%" }} onMouseMove={onMouseMove}>
     { isMobile && !hasPermission && 
     <div onClick={getPermssion} className="enter"> <p>ENTER</p></div> }
     { !isMobile && !enter &&
       <div onClick={() => isEnter(true)} className="enter"> <p>ENTER</p></div> }
         <div className='diction'>
             <p ref={charRef}>
               {/* { startAnim? <ScrambleText startAnim={startAnim}/> : '' } */}
            </p>
>>>>>>> Stashed changes
         </div>
        <main ref={mainRef}>
          <Canvas camera={{ position: [0, 0, 1.5] }} >
               <Effects>
                  <glitchPass attachArray="passes"/>
               </Effects>
               <Suspense fallback={null}>     
                  <Eyes mousePosition={mousePosition} deviceOrientation={null} />
               </Suspense>
          </Canvas>
        </main>
      </div>
    </>
  );
};

export default App;
