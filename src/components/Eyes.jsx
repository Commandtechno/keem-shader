
 import React, { useRef, useEffect, useState } from 'react'
 import { extend, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GlitchPass } from '../GlitchPass';
import { gsap } from "gsap-trial"
useGLTF.preload("/Eyes_Keem.glb");

extend({ GlitchPass })

const Eyes = ({ mousePosition, deviceOrientation }) => {

   const isMobile = window.innerWidth <= 576; 
   const objRef = useRef();
   const matRef = useRef()
   const objScale = isMobile ? 0.58 : 0.011;
   const objPos = isMobile ? [30, 0, 0] : [0.5, -0.3, -1.5]
   const { nodes, materials } = useGLTF("/Eyes_Keem.glb");
   const phoneAngle = 90;
   const sensitivityY = 0.03; 
   const sensitivityX = 0.04; 

   useEffect(() => {
      // Create a MutationObserver
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'anim') {
            const hasAnimAttribute = document.body.hasAttribute('anim');
            if (hasAnimAttribute) {
               // gsap.set(matRef.current.color, { r: 0, g: 0.8, b: 0.8 });
                  gsap.to('main', { filter:'invert(1) contrast(1) blur(20px)', yoyo:true, duration: 0.1, repeat: 5, onComplete: () => {
                     // gsap.set(matRef.current.color, { r: 1, g: 1, b: 1 });
                  } })
            } else {
               gsap.set('main', {filter: 'invert(0) contrast(1) blur(10px)' })
            }
          }
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['anim'] });
      return () => {
        observer.disconnect();
      };
    }, []);

     useFrame(() => {

      if (mousePosition) {
       const targetRotationX = -mousePosition[1] * Math.PI / 4;
       const targetRotationY = mousePosition[0] * Math.PI / 12;
       const clampedRotationY = Math.max(-1, Math.min(0.5, targetRotationY));
       const clampedRotationX = Math.max(0.1, Math.min(1, targetRotationX));
   
       objRef.current.rotation.x += 0.05 * (clampedRotationX - objRef.current.rotation.x);
       objRef.current.rotation.y += 0.09 * (clampedRotationY - objRef.current.rotation.y); 
       
      } else if (deviceOrientation) {

         // const alpha = deviceOrientation.alpha;
         const beta = deviceOrientation.beta || 0;
         const gamma = deviceOrientation.gamma || 0;
         let targetRotationY;
         
         const betaSign = Math.sign(beta);
         const targetRotationX = (phoneAngle - beta) * (Math.PI / 12) * sensitivityX;
         const positionY = beta * 0.2;
         objRef.current.position.y = positionY;
          if (beta === -1) {
            targetRotationY = gamma * (Math.PI / 12) * sensitivityY * betaSign; // Adjust rotation based on beta sign
         } else {
            targetRotationY = -gamma * (Math.PI / 12) * sensitivityY; // Adjust rotation based on beta sign
         }
         objRef.current.rotation.x += 0.04 * (targetRotationX - objRef.current.rotation.x);
         objRef.current.rotation.y += 0.03 * (targetRotationY - objRef.current.rotation.y);
       }
     });
     return (
      <>
         <group dispose={null} >
            <mesh ref={objRef}
               scale={objScale}
               castShadow
               receiveShadow
               geometry={nodes.Volume_Mesher.geometry}
               material={nodes.Volume_Mesher.material}
               position={objPos}>
             <meshBasicMaterial ref={matRef} color={0xf0f0f0} attach="material" />
            </mesh>
         </group>
      </>
      
     );
   };
 
 export default Eyes