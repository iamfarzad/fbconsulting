
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, PresentationControls, ContactShadows, Html } from '@react-three/drei';
import { Vector3 } from 'three';

// Brain node component to represent different AI capabilities
const BrainNode = ({ position, color, label, onClick }: { 
  position: [number, number, number], 
  color: string, 
  label: string,
  onClick: () => void 
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.005;
      ref.current.rotation.y += 0.005;
    }
  });
  
  return (
    <group position={new Vector3(...position)}>
      <mesh
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.5 : 0.2} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="px-2 py-1 rounded-md bg-deep-purple text-neon-white text-sm whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

// Simplified brain model
const BrainModel = ({ onNodeClick }: { onNodeClick: (label: string) => void }) => {
  const brainRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });
  
  return (
    <group ref={brainRef}>
      {/* Central Brain Shape */}
      <mesh>
        <ellipsoidGeometry args={[1.5, 1.2, 1.2]} />
        <meshStandardMaterial 
          color="#2E1A47" 
          transparent 
          opacity={0.7} 
          wireframe 
          emissive="#2E1A47"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Brain connections */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#00C4B4" emissive="#00C4B4" emissiveIntensity={0.5} />
        </mesh>
      ))}
      
      {/* Feature nodes */}
      <BrainNode 
        position={[1.2, 0.7, 0.5]} 
        color="#FF007A" 
        label="Strategy" 
        onClick={() => onNodeClick("Strategy")}
      />
      <BrainNode 
        position={[0, 1.2, 0.8]} 
        color="#00C4B4" 
        label="Design" 
        onClick={() => onNodeClick("Design")}
      />
      <BrainNode 
        position={[-1.1, 0.5, 0.7]} 
        color="#FF007A" 
        label="Execution" 
        onClick={() => onNodeClick("Execution")}
      />
      <BrainNode 
        position={[0.8, -0.8, 0.6]} 
        color="#00C4B4" 
        label="Analysis" 
        onClick={() => onNodeClick("Analysis")}
      />
    </group>
  );
};

interface Brain3DProps {
  className?: string;
  onNodeClick?: (label: string) => void;
}

const Brain3D: React.FC<Brain3DProps> = ({ 
  className,
  onNodeClick = () => {} 
}) => {
  return (
    <div className={`brain-3d-container ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 2, tension: 400 }}
        >
          <BrainModel onNodeClick={onNodeClick} />
        </PresentationControls>
        <ContactShadows 
          opacity={0.4} 
          scale={5} 
          blur={2.4} 
          position={[0, -1.5, 0]} 
        />
      </Canvas>
    </div>
  );
};

export default Brain3D;
