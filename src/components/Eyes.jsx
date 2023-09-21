import * as THREE from 'three';
 import React, { useRef } from 'react'
 import { useFrame, extend } from "@react-three/fiber";
import { useGLTF, shaderMaterial } from "@react-three/drei";
useGLTF.preload("/Eyes_Keem.glb");

const ColorShiftMaterial = shaderMaterial(
   { uTime: 0, uColor: new THREE.Color(0.2, 0.0, 0.1) },
   // vertex shader
   /*glsl*/`
   uniform float uTime;
   varying vec3 fragPosition;

   // Perlin noise function
   float noise(vec3 p) {
     return sin(p.x * 10.0 + uTime) * sin(p.y * 10.0 + uTime) * sin(p.z * 10.0 + uTime);
   }

   void main() {
     // Generate noise and use it to displace the vertex position
     vec3 offset = vec3(
       noise(position),
       noise(position + vec3(0.0, 0.0, uTime)),
       noise(position + vec3(uTime, 0.0, 0.0))
     );

     vec3 distortedPosition = position + offset * 0.1; // Adjust the scale as needed

     gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPosition, 1.0);
     fragPosition = distortedPosition;
   }
   `,
   // fragment shader
   /*glsl*/`
   varying vec3 fragPosition;

   void main() {
     // Output color based on the distorted position
     gl_FragColor = vec4(fragPosition, 1.0);
   }
   `
 )
 // declaratively
 extend({ ColorShiftMaterial })

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

      shaderRef.current.uTime = clock.getElapsedTime();

      if (mousePosition) {
       const targetRotationX = -mousePosition[1] * Math.PI / 8;
       const targetRotationY = mousePosition[0] * Math.PI / 8;
       const clampedRotationY = Math.max(-0.5, Math.min(0.5, targetRotationY));
       const clampedRotationX = Math.max(-0.2, Math.min(0.5, targetRotationX));
   
       objRef.current.rotation.x += 0.09 * (clampedRotationX - objRef.current.rotation.x);
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


         // Calculate the yaw rotation angle (clamped alpha)
         // const yawRotation = alpha * (Math.PI / 180); // Convert degrees to radians
         // const minFaceYaw = -Math.PI / 4; // -90 degrees in radians
         // const maxFaceYaw = Math.PI / 4;  // 90 degrees in radians
         // const clampedYawRotation = Math.min(Math.max(yawRotation, minFaceYaw), maxFaceYaw);
         // const portraitModeBeta = 90; // Adjust as needed
         // // Calculate the tilt rotation based on the difference from portrait mode
         // const tiltFactor = 0.6; // Adjust the factor as needed
         // const tiltRotation = -(beta - portraitModeBeta) * tiltFactor * (Math.PI / 180);
         // objRef.current.rotation.y = clampedYawRotation;
         // objRef.current.rotation.x = tiltRotation;
       }
     });


   
     return (
      <>
      <group dispose={null} ref={objRef} >
       <mesh scale={objScale}
         castShadow
         receiveShadow
         geometry={nodes.Volume_Mesher.geometry}
         material={nodes.Volume_Mesher.material}
         position={objPos}>
            {/* <meshBasicMaterial color={"#5b5b5b"}/> */}
            <colorShiftMaterial uColor={"pink"} ref={shaderRef}/>
      </mesh>
       
     </group>
      </>
      
     );
   };
 
 export default Eyes