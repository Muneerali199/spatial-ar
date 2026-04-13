'use client';

import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Thermometer, Gauge, Zap, Cpu, Settings, Hexagon } from 'lucide-react';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const machines = [
  { id: 'm1', name: 'Quantum Generator', status: 'Optimal', temp: '340K', rpm: '12,500', power: '98%' },
  { id: 'm2', name: 'Turbine Engine V9', status: 'Warning', temp: '410K', rpm: '18,200', power: '75%' },
  { id: 'm3', name: 'Cryo-Cooler System', status: 'Standby', temp: '77K', rpm: '0', power: '12%' },
  { id: 'm4', name: 'Plasma Confinement', status: 'Critical', temp: '1.2MK', rpm: 'N/A', power: '104%' },
];

function Machine3D({ activeMachine }: { activeMachine: typeof machines[0] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const statusColor = activeMachine.status === 'Optimal' ? '#34d399' :
                      activeMachine.status === 'Warning' ? '#fbbf24' :
                      activeMachine.status === 'Critical' ? '#f43f5e' : '#60a5fa';

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Core */}
        <mesh>
          <octahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color={statusColor} wireframe={true} transparent opacity={0.3} />
        </mesh>
        
        {/* Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={0.5} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
        </mesh>

        {/* Lines */}
        <Line points={[[0, 0.5, 0], [-3.5, 2, 0]]} color="white" opacity={0.4} transparent lineWidth={1.5} />
        <Line points={[[0, 0.5, 0], [3.5, 2, 0]]} color="white" opacity={0.4} transparent lineWidth={1.5} />
        <Line points={[[0, -0.5, 0], [3.5, -2, 0]]} color="white" opacity={0.4} transparent lineWidth={1.5} />
        
        {/* Anchor Points for Cards */}
        <Html position={[-3.5, 2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="pointer-events-auto">
            <DataCard icon={<Thermometer className="w-4 h-4 text-rose-400" />} label="Core Temp" value={activeMachine.temp} trend="+2.4%" />
          </div>
        </Html>
        <Html position={[3.5, 2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="pointer-events-auto">
            <DataCard icon={<Gauge className="w-4 h-4 text-cyan-400" />} label="Rotational Speed" value={activeMachine.rpm} unit="RPM" />
          </div>
        </Html>
        <Html position={[3.5, -2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
          <div className="pointer-events-auto">
            <DataCard icon={<Zap className="w-4 h-4 text-amber-400" />} label="Power Output" value={activeMachine.power} trend="-0.5%" trendDown />
          </div>
        </Html>
      </Float>
    </group>
  );
}

export default function SpatialUI() {
  const [activeMachineId, setActiveMachineId] = useState(machines[0].id);
  const activeMachine = machines.find(m => m.id === activeMachineId) || machines[0];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black selection:bg-white/30 font-sans">
      {/* Background Camera Feed Placeholder */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/warehouse/1920/1080"
          alt="Warehouse Background"
          fill
          className="object-cover opacity-50 scale-105"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* UI Layer */}
      <div className="relative z-10 w-full h-full flex items-center p-8">
        
        {/* Left Sidebar - Selection Menu */}
        <motion.div 
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-80 h-[85vh] flex flex-col gap-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.6)] p-6 relative overflow-hidden"
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent opacity-30 pointer-events-none" />
          
          <div className="flex items-center gap-4 px-2 pt-2 relative z-10">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner backdrop-blur-md">
              <Hexagon className="w-6 h-6 text-white/90" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight text-white/90">Facility Alpha</h1>
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mt-0.5">Sector 7G</p>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none relative z-10">
            {machines.map((machine) => {
              const isActive = activeMachineId === machine.id;
              return (
                <button
                  key={machine.id}
                  onClick={() => setActiveMachineId(machine.id)}
                  className={`w-full text-left p-4 rounded-3xl transition-all duration-500 relative group overflow-hidden ${
                    isActive 
                      ? 'bg-white/15 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  } border`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-glow"
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-40"
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.15)] rounded-3xl pointer-events-none" />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                        {machine.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          machine.status === 'Optimal' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' :
                          machine.status === 'Warning' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' :
                          machine.status === 'Critical' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' :
                          'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]'
                        }`} />
                        <span className="text-xs text-white/50 font-medium tracking-wide">{machine.status}</span>
                      </div>
                    </div>
                    <Cpu className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/30 group-hover:text-white/50'}`} />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Bottom Settings Button */}
          <button className="mt-auto flex items-center justify-center gap-2 w-full p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-white/60 hover:text-white relative z-10 group">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-sm font-medium tracking-wide">System Settings</span>
          </button>
        </motion.div>

        {/* Center Stage - Interactive 3D Machine */}
        <div className="flex-1 h-full relative flex items-center justify-center z-20 cursor-move">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
            <Environment preset="city" />
            
            <Machine3D activeMachine={activeMachine} />
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={15}
              autoRotate={false}
              makeDefault
            />
          </Canvas>
        </div>
      </div>
    </main>
  );
}

function DataCard({ icon, label, value, unit, trend, trendDown }: { icon: React.ReactNode, label: string, value: string, unit?: string, trend?: string, trendDown?: boolean }) {
  return (
    <div className="group relative w-64 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.5)] p-5 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_24px_64px_rgba(0,0,0,0.6)] hover:-translate-y-1 cursor-default">
      {/* Glossy reflection */}
      <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/15 to-transparent opacity-40 rounded-t-3xl pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] rounded-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner backdrop-blur-md">
          {icon}
        </div>
        <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">{label}</span>
      </div>
      
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-4xl font-light tracking-tighter text-white drop-shadow-md">{value}</span>
        {unit && <span className="text-sm font-medium text-white/50 mb-1">{unit}</span>}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 relative z-10">
          <Activity className={`w-3.5 h-3.5 ${trendDown ? 'text-rose-400' : 'text-emerald-400'}`} />
          <span className={`text-xs font-semibold tracking-wide ${trendDown ? 'text-rose-400' : 'text-emerald-400'}`}>
            {trend}
          </span>
          <span className="text-xs font-medium text-white/40 ml-1">vs last hour</span>
        </div>
      )}
    </div>
  );
}
