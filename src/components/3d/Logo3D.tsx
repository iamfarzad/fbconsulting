import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import ErrorBoundary3D from './ErrorBoundary3D'
import { Logo3DLoader } from '@/components/loaders/Logo3DLoader'

function Model() {
  const { scene } = useGLTF('/f_b_logo.glb')
  return <primitive object={scene} scale={0.3} />
}

export interface Logo3DProps {
  className?: string;
  size?: string;
}

function Fallback({ size, className }: Logo3DProps) {
  return (
    <div className={`${size} ${className} flex items-center justify-center bg-muted rounded-md`}>
      <span className="text-xs text-muted-foreground">FB</span>
    </div>
  )
}

function LoadingSpinner({ size, className }: Logo3DProps) {
  return (
    <div className={`${size} ${className} flex items-center justify-center bg-muted rounded-md`}>
      <Loader2 className="h-4 w-4 animate-spin" />
    </div>
  )
}

export function Logo3D({ className, size = "w-10 h-10" }: Logo3DProps) {
  return (
    <ErrorBoundary3D fallback={<Fallback size={size} className={className} />}>
      <div className={`${size} ${className}`}>
        <Suspense fallback={<Logo3DLoader size={size} />}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
            <OrbitControls 
              enableZoom={false}
              autoRotate
              autoRotateSpeed={4}
            />
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary3D>
  )
}

// Preload the model
useGLTF.preload('/f_b_logo.glb')

export default Logo3D
