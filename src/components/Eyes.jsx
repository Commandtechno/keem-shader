import * as THREE from 'three';
 import React, { useRef, useState } from 'react'
 import { useFrame, extend } from "@react-three/fiber";
import { useGLTF, shaderMaterial } from "@react-three/drei";
useGLTF.preload("/Eyes_Keem.glb");


const Eyes = ({ mousePosition, deviceOrientation }) => {

   const isMobile = window.innerWidth <= 576; 
   const objRef = useRef();
   const shaderRef = useRef();
   const objScale = isMobile ? 0.58 : 1;
   const objPos = isMobile ? [30, 0, 0] : [45.463, -29.926, 22.715]
   const { nodes, materials } = useGLTF("/Eyes_Keem.glb");
  
     const phoneAngle = 90; // Set the initial beta value you want
      const sensitivityY = 0.03; 
      const sensitivityX = 0.04; 

     useFrame(({clock}) => {

      // shaderRef.current.uTime = clock.getElapsedTime() * 0.5;

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
      <group dispose={null} ref={objRef} >
       <mesh 
         scale={objScale}
         castShadow
         receiveShadow
         geometry={nodes.Volume_Mesher.geometry}
         material={nodes.Volume_Mesher.material}
         position={objPos}>
            <meshStandardMaterial emissive={"grey"} color={"#5b5b5b"}/>
      </mesh>
       
     </group>
      </>
      
     );
   };
 
 export default Eyes