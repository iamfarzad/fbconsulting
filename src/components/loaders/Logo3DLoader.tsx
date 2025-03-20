import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'

function LoaderModel() {
  const { scene } = useGLTF('/f_b_logo_CircularProgress.glb')
  return <primitive object={scene} scale={0.3} />
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  )
}

export function Logo3DLoader({ size = "w-10 h-10" }: { size?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 10 : 100))
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`${size} flex flex-col gap-2`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <Environment preset="studio" />
        <LoaderModel />
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={4} 
        />
      </Canvas>
      <ProgressBar progress={progress} />
    </div>
  )
}

useGLTF.preload('/f_b_logo_CircularProgress.glb')
