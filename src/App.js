import './App.css'
import React, { useRef, useState, useEffect } from "react";
import { Canvas, extend } from "@react-three/fiber";
import { OrbitControls, Effects, Environment } from '@react-three/drei';
import { gsap } from "gsap-trial"
import {ReactComponent as Learning} from './learning.svg';
import Eyes from './components/Eyes';
import { Suspense } from "react";

const App = () => {

   const isMobile = window.innerWidth <= 576;
  const [mousePosition, setMousePosition] = useState([0, 0]);
 
  const mainRef = useRef(null);

  const onMouseMove = (event) => {
   if (!isMobile) {
   const { clientX, clientY } = event;
   const mouseX = (clientX / window.innerWidth) * 2 - 1;
   const mouseY = -(clientY / window.innerHeight) * 2 + 1;
   setMousePosition([mouseX, mouseY]);
   }};

  return (
    <>
      <div style={{ width: "100vw", height: "100%" }} 
      onMouseMove={onMouseMove}>
         <div className='diction'>      
         <p>LEARNING</p>
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
