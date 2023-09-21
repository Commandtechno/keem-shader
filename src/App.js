import './App.css'
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import Eyes from './components/Eyes';
import { Suspense } from "react";

const fonts = [
   'Redaction',
   'Ferrum',
   'FA1',
   'Nacelle',
   'Keem',
   'Seshat',
   'Times New Roman',
 ];

const App = () => {

   const isMobile = window.innerWidth <= 576; // Adjust the threshold as needed
   // const scaleFactor = isMobile? '150' : '90';
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const [prevMousePosition, setPrevMousePosition] = useState([0, 0]);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [hasPermission, setHasPermission] = useState(false); // Permission state

  const mainRef = useRef(null);
  const charRef = useRef(null)
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
    }, 150); // Change fonts every 500 milliseconds

    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    const charElements = charRef.current.querySelectorAll('span');
    charElements.forEach((char, index) => {
      char.style.fontFamily = fonts[(fontIndex + index) % fonts.length];
    });
  }, [fontIndex]);

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


  const onMouseMove = (event) => {
   if (!isMobile) {
   const { clientX, clientY } = event;
   const mouseX = (clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
 
   // Calculate the time difference since the last mouse move
   const newTime = performance.now();
   const deltaTime = newTime - currentTime;
 
   // Calculate the change in mouse position
   const deltaX = mouseX - prevMousePosition[0];
   const deltaY = mouseY - prevMousePosition[1];
 
   // Calculate mouse speed based on change in position and time
   const mouseSpeed = Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime;
 
   setMousePosition([mouseX, mouseY]);
   setPrevMousePosition([mouseX, mouseY]);
   setCurrentTime(newTime);

      if (mouseSpeed > 0.018)  {

      }
   }};

   


  return (
    <>
      <div style={{ width: "100vw", height: "100%" }} onMouseMove={onMouseMove}>
     { !hasPermission && isMobile && 
     <div onClick={getPermssion} className="enter"> <p>ENTER</p></div> }
            <p ref={charRef} className='diction'
            style={{ filter: 'url(#distort)' }}
            >
        {Array.from('Learning...').map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </p>
        <main
          ref={mainRef}
          style={{background: '#BABABA'}}>
          <Canvas camera={{ position: [0, 0, 300] }} >
               {/* <ambientLight/> */}
               <pointLight position={[0, 0, 15]} intensity={1} />
               <pointLight position={[3, -3, 20]} />
            <Suspense fallback={null}>     
            {isMobile ? (
               <Eyes mousePosition={null} deviceOrientation={deviceOrientation} />
               ) : (
               <Eyes mousePosition={mousePosition} deviceOrientation={null} />
            )}
               {/* <fog attach="fog" args={['#000', 2, 10]} /> */}
               {/* <OrbitControls/> */}
            </Suspense>
          </Canvas>
        </main>
      </div>
    </>
  );
};

export default App;
