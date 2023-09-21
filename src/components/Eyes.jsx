import * as THREE from 'three';
 import React, { useRef, useState } from 'react'
 import { useFrame, extend } from "@react-three/fiber";
import { useGLTF, shaderMaterial } from "@react-three/drei";
useGLTF.preload("/Eyes_Keem.glb");


export const ImageFadeMaterial = shaderMaterial(
   {
     uTime: 0
   },
   /*glsl */` 
   varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
     }`,
   
     /*glsl */` 
     #define ss(a,b,t) smoothstep(a,b,t)
     varying vec2 vUv;
     uniform float uTime;

     float gyroid (vec3 seed) {
         return dot(sin(seed), cos(seed.yzx));
      }
      
      float fbm (vec3 seed) {
            float result = 0.0, a = 0.5;
            for (int i = 0; i < 5; ++i, a /= 2.0) {
               seed.z += result * 0.5;
               result += abs(gyroid(seed / a) * a);
            }
            return result;
      }
      
      vec3 getColor(float t) {
            // Define a color palette here
            vec3 colors[5];
            colors[0] = vec3(0.0, 0.5, 0.0); // Blue
            colors[1] = vec3(0.0, 1.0, 0.0); // Green
            colors[2] = vec3(1.0, 0.0, 0.0); // Red
            colors[3] = vec3(1.0, 1.0, 0.0); // Yellow
            colors[4] = vec3(0.8, 0.2, 0.8); // Purple
            
            int numColors = 5;
            int index = int(floor(t * float(numColors)));
            return colors[index];
      }

     void main() {
      vec2 p = vUv;
      float d = length(p);
      p = normalize(p) * log(length(p) * 0.5);
      p = vec2(atan(p.y, p.x), length(p) * 0.5 + uTime * 0.5);
      float shades = 6.0;
      float shape = ss(0.9, 0.5, fbm(vec3(p * 0.5, 0.0)));
      float shade = ceil(shape * shades) / shades;
      
      // Get a color based on the shade value
      vec3 bgColor = getColor(shade);
      
      vec3 color = mix(bgColor, vec3(1.0), ss(2.0, 0.0, d));
      
       vec4 finalTexture = vec4(color, 1.0);
       gl_FragColor = finalTexture;

     }`
 )
 
 extend({ ImageFadeMaterial })

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

      // shaderRef.current.uTime = clock.getElapsedTime();

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
            {/* <colorShiftMaterial uColor={"pink"} ref={shaderRef} /> */}
            {/* <imageFadeMaterial ref={shaderRef} /> */}
      </mesh>
       
     </group>
      </>
      
     );
   };
 
 export default Eyes