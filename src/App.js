import './App.css';
import React, { useState, useEffect, Suspense } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { Effects } from '@react-three/drei';
import { GlitchPass } from "./GlitchPass";
import Eyes from './components/Eyes';
import ScrambleText from './components/ScrambleText';
import { ReactComponent as Notch } from './Website-Notch.svg';


extend({ GlitchPass });

const App = () => {

   const isMobile = window.innerWidth <= 576; 
   const [mousePosition, setMousePosition] = useState([0, 0]);
   const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
   const [hasPermission, setHasPermission] = useState(false); // Permission state
   const [enter, isEnter] = useState(false);
   const [loader, setLoader] = useState(true);

  const getPermssion = (e) => {
   if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      console.log('DeviceOrientationEvent is defined')
     DeviceOrientationEvent.requestPermission()
       .then((permissionState) => {
         if (permissionState === "granted") {
           setHasPermission(true);
           isEnter(true)
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


  const onMouseMove = (event) => {
   if (!isMobile) {
   const { clientX, clientY } = event;
   const mouseX = (clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
      setMousePosition([mouseX, mouseY]);
   }};

     // This will run one time after the component mounts
  useEffect(() => {
   // callback function to call when event triggers
   const onPageLoad = () => {
     setLoader(false)
   };

   // Check if the page has already loaded
   if (document.readyState === 'complete') {
     onPageLoad();
     console.log('loaded')
   } else {
     window.addEventListener('load', onPageLoad, false);
     // Remove the event listener when component unmounts
     return () => window.removeEventListener('load', onPageLoad);
   }
 }, []);

   if (loader) return <div className='diction'>Loading..</div>
  return (
    <>
      <div style={{ width: "100vw", height: "100%" }} onMouseMove={onMouseMove}>
     { isMobile && !hasPermission && 
     <div onClick={getPermssion} className="enter"> <p>ENTER</p></div> }
     { !isMobile && !enter &&
       <div onClick={() => isEnter(true)} className="enter"> <p>ENTER</p></div> }
         <div className='diction'>
         <ScrambleText enter={enter}/> 
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
