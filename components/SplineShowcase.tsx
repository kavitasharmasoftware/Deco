import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';
import { Loader2 } from 'lucide-react';

// --- Components adapted from the request ---

export function Spotlight({ className, fill }: { className?: string; fill?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0 animate-spotlight ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill || "white"}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="151"
            result="effect1_foregroundBlur_1065_8"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function SplineScene({ scene, className }: { scene: string; className?: string }) {
  return (
    <div className={className}>
       <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-500"><Loader2 className="animate-spin"/></div>}>
          <Spline scene={scene} />
       </Suspense>
    </div>
  );
}

export function Card({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden shadow-2xl border-slate-800">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center pointer-events-none">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive 3D
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
            that capture attention and enhance your design.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[300px] md:min-h-auto">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}