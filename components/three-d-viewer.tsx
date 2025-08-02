"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"

interface ThreeDViewerProps {
  productName: string
}

function TShirtModel() {
  return (
    <group>
      {/* Simple T-shirt representation using basic shapes */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-1.2, 0.8, 0]}>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[1.2, 0.8, 0]}>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Design element */}
      <mesh position={[0, 0.2, 0.06]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  )
}

export default function ThreeDViewer({ productName }: ThreeDViewerProps) {
  return (
    <div className="w-full h-96 lg:h-[500px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<LoadingFallback />}>
          <TShirtModel />
          <Environment preset="studio" />
          <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
        <p className="text-sm">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  )
}
