import * as THREE from 'three';
 import React, { useRef, useState } from 'react'
 import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
useGLTF.preload("/Eyes_Keem.glb");


const Eyes = ({ mousePosition, deviceOrientation }) => {

   const isMobile = window.innerWidth <= 576; 
   const objRef = useRef();
   const shaderRef = useRef();
   const objScale = isMobile ? 0.58 : 0.01;
   const objPos = isMobile ? [30, 0, 0] : [0.5, 0, -1.5]
   const { nodes, materials } = useGLTF("/Eyes_Keem.glb");
  
     const phoneAngle = 90; // Set the initial beta value you want
      const sensitivityY = 0.03; 
      const sensitivityX = 0.04; 
      const viewport = useThree(state => state.viewport)

     useFrame(({clock}) => {
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
      <group>
         <mesh position={[0.5, 0, 0.5]} scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1, 1]}/>
            <MeshTransmissionMaterial samples={4} resolution={32} anisotropy={1} thickness={0.1} roughness={0.3} toneMapped={true} />
         </mesh>
      </group>
         <group dispose={null} >
            <mesh ref={objRef}
               scale={objScale}
               castShadow
               receiveShadow
               geometry={nodes.Volume_Mesher.geometry}
               material={nodes.Volume_Mesher.material}
               position={objPos}>
               <meshStandardMaterial emissive={"grey"} color={"#1f1e1e"}/>
               {/* <shaderMaterial ref={shaderRef} attach="material" args={[ShaderMaterial]} /> */}
            </mesh>
         </group>

      </>
      
     );
   };
 
 export default Eyes