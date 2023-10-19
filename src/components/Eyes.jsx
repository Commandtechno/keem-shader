
 import React, { useRef, useEffect } from 'react'
 import { gsap } from "gsap"
 import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
useGLTF.preload('/Eyes_Keem-Small.glb');


const Eyes = ({ mousePosition, deviceOrientation }) => {

   const isMobile = window.innerWidth <= 576; 
   const objRef = useRef();
   const matRef = useRef();
   const objScale = isMobile ? 0.9 : 1.6;
   const objPos = isMobile ? [-6.111, 50, 9.711] : [-6.111, 25, 9.711]
   const { nodes, materials } = useGLTF('/Eyes_Keem-Small.glb')
     const phoneAngle = 90; // Set the initial beta value you want
      const sensitivityY = 0.03; 
      const sensitivityX = 0.04; 

      useEffect(() => {
            // Create a MutationObserver
            const observer = new MutationObserver((mutationsList) => {
               for (const mutation of mutationsList) {
                 if (mutation.type === 'attributes' && mutation.attributeName === 'anim') {
                   const hasAnimAttribute = document.body.hasAttribute('anim');
                   if (hasAnimAttribute) {
                     // console.log(matRef.current.emissive)
                      gsap.set(matRef.current.emissive, { r: 0.2, g: 0.2, b: 0.2 });
                      gsap.to('main', { backgroundColor: "darkgrey" , 
                      yoyo:true, duration: 0.1, repeat: 5, onComplete: () => {
                        gsap.set(matRef.current.emissive, { r: 0.15, g: 0.15, b: 0.15 });
                      }} )
                   } else {
                   
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
       const clampedRotationY = Math.max(-0.5, Math.min(0.5, targetRotationY));
       const clampedRotationX = Math.max(0, Math.min(0.5, targetRotationX));
   
       objRef.current.rotation.x += 0.05 * (clampedRotationX - objRef.current.rotation.x);
       objRef.current.rotation.y += 0.09 * (clampedRotationY - objRef.current.rotation.y); 
       
      } else if (deviceOrientation) {
         // const alpha = deviceOrientation.alpha;
         const beta = deviceOrientation.beta || 0;
         const gamma = deviceOrientation.gamma || 0;
         const betaSign = Math.sign(beta);
         let targetRotationY, targetRotationX;
         
       
         targetRotationX = (phoneAngle - beta) * (Math.PI / 12) * sensitivityX;
         const clampedRotationX = Math.max(0, Math.min(0.5, targetRotationX));

         const positionY = beta * 0.2;
         objRef.current.position.y = positionY;
          if (beta === -1) {
            targetRotationY = gamma * (Math.PI / 12) * sensitivityY * betaSign; // Adjust rotation based on beta sign
         } else {
            targetRotationY = -gamma * (Math.PI / 12) * sensitivityY; // Adjust rotation 
         }
         objRef.current.rotation.x += 0.04 * (clampedRotationX - objRef.current.rotation.x);
         objRef.current.rotation.y += 0.03 * (targetRotationY - objRef.current.rotation.y);
       }
     });


     return (
      <>
      <group dispose={null} ref={objRef} >
       <mesh 
         scale={objScale}
         castShadow
         receiveShadow
         geometry={nodes.Volume_Mesher.geometry}
         material={nodes.Volume_Mesher.material}
         position={objPos}>
         <meshStandardMaterial ref={matRef} color={"rgb(65,65,65)"}/>
      </mesh>
       
     </group>
      </>
      
     );
   };
 
 export default Eyes