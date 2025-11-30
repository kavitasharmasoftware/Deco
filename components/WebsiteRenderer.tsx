import React, { useState, useEffect, useRef } from 'react';
import { GeneratedWebsite } from '../types';
import * as Icons from 'lucide-react';
import { Monitor, Smartphone, Tablet, ExternalLink, Wand2, Edit3, Check, Palette, Image as ImageIcon, Loader, Upload, X, Youtube, Settings, Rocket, Copy, Terminal, Cloud, CheckCircle2, Server, Globe, Sparkles, Layers, Pencil, Save, MousePointer2, ArrowLeft } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import * as THREE from 'three';
// @ts-ignore
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';

interface WebsiteRendererProps {
  data: GeneratedWebsite;
  onReset: () => void;
}

// --- Icons Helper ---
const IconResolver = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.Star;
  return <IconComponent className={className} />;
};

// --- Cloud Deployment Modal ---
const CloudDeployModal = ({ isOpen, onClose, companyName, onVisit }: { isOpen: boolean; onClose: () => void; companyName: string, onVisit: () => void }) => {
  const [step, setStep] = useState<'idle' | 'building' | 'optimizing' | 'uploading' | 'complete'>('idle');
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const siteUrl = `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.deco.site`;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('building');
      setLogs([{msg: 'Initializing build environment...', type: 'info'}]);
      
      const addLog = (msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
        setLogs(prev => [...prev, {msg, type}]);
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      };

      const sequence = [
        { t: 800, msg: 'Resolving dependencies (React 19, Tailwind, Motion)...', step: 'building' },
        { t: 1600, msg: 'Compiling assets...', step: 'building' },
        { t: 2200, msg: 'Optimizing images and generating srcsets...', step: 'optimizing' },
        { t: 2500, msg: 'Tree-shaking unused modules...', step: 'optimizing' },
        { t: 2800, msg: 'Minifying JS/CSS bundles...', step: 'optimizing' },
        { t: 3600, msg: 'Provisioning edge nodes (US-EAST, EU-WEST, AP-SOUTH)...', step: 'uploading' },
        { t: 4200, msg: 'Uploading static assets to Global CDN...', step: 'uploading' },
        { t: 4800, msg: 'Verifying SSL certificates...', step: 'uploading' },
        { t: 5500, msg: 'Deployment successful!', step: 'complete', type: 'success' },
      ];

      const timeouts = sequence.map(({ t, msg, step: s, type }) => 
        setTimeout(() => {
          addLog(msg, type as any);
          // @ts-ignore
          if (s) setStep(s);
        }, t)
      );

      return () => timeouts.forEach(clearTimeout);
    } else {
        setStep('idle');
        setLogs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={step === 'complete' ? onClose : undefined} />
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         className="relative bg-[#0d1117] border border-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/10"
       >
          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#161b22]">
             <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    <Cloud className="w-3 h-3" />
                    <span>deploy-pipeline</span>
                </div>
             </div>
             <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-4 h-4"/></button>
          </div>

          <div className="p-0 flex flex-col min-h-[400px]">
             {step !== 'complete' ? (
                <div className="flex-1 flex flex-col p-6">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-white">Deploying to Production</h3>
                        <p className="text-sm text-slate-400">Building and distributing your site globally.</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Loader className="w-4 h-4 text-purple-500 animate-spin" />
                         <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">{step}</span>
                      </div>
                   </div>
                   
                   {/* Progress Bar */}
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden relative mb-6">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: step === 'building' ? '30%' : step === 'optimizing' ? '60%' : step === 'uploading' ? '90%' : '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div 
                        className="absolute top-0 bottom-0 w-20 bg-white/50 blur-sm"
                        animate={{ x: [-100, 600] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                   </div>

                   {/* Terminal Logs */}
                   <div ref={scrollRef} className="flex-1 bg-[#0a0a0a] rounded-lg p-4 font-mono text-xs text-slate-300 overflow-y-auto custom-scrollbar border border-white/5 shadow-inner font-ligatures-none">
                      {logs.map((log, i) => (
                         <div key={i} className="mb-1.5 flex gap-2 break-all">
                            <span className="text-slate-600 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                            <span className={log.type === 'success' ? 'text-green-400' : 'text-blue-400'}>➜</span>
                            <span className={log.type === 'success' ? 'text-green-300 font-bold' : ''}>{log.msg}</span>
                         </div>
                      ))}
                      {step !== 'complete' && (
                         <div className="animate-pulse text-purple-500 mt-2">_</div>
                      )}
                   </div>
                </div>
             ) : (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0d1117] to-[#161b22]"
                >
                   <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }}
                     type="spring"
                     className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] relative"
                   >
                      <CheckCircle2 className="w-12 h-12 text-white" />
                      <motion.div 
                        className="absolute inset-0 border-4 border-green-500 rounded-full"
                        animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                   </motion.div>
                   
                   <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Deployment Complete!</h2>
                   <p className="text-slate-400 mb-8 max-w-md">Your website has been successfully published to the DECo Cloud Edge Network.</p>
                   
                   <div className="w-full max-w-md bg-black/40 border border-slate-700 rounded-lg p-1.5 flex items-center justify-between mb-8 pl-4 pr-2">
                      <div className="flex items-center gap-2 overflow-hidden mr-2">
                         <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                         <span className="text-purple-400 text-sm font-mono truncate">{siteUrl}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(siteUrl);
                            }}
                            className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy URL"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={onVisit}
                            className="bg-white text-black px-4 py-2 rounded font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Visit Live Site <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                   </div>
                   
                   <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">
                      Back to Editor
                   </button>
                </motion.div>
             )}
          </div>
       </motion.div>
    </div>
  );
};

// --- Editable Text Component ---
interface EditableTextProps {
  text: string;
  className?: string;
  tag?: React.ElementType;
  isEditing: boolean;
  onChange?: (value: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  text, 
  className, 
  tag = 'div', 
  isEditing,
  onChange 
}) => {
  const [content, setContent] = useState(text);

  useEffect(() => { setContent(text) }, [text]);

  const Tag = tag as any;

  if (!isEditing) {
    return <Tag className={className}>{content}</Tag>;
  }

  return (
    <Tag 
      className={`${className} outline-none border-b border-dashed border-purple-500/50 hover:bg-purple-500/10 hover:border-solid hover:border-purple-500 rounded px-1 -mx-1 cursor-text transition-all relative group`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent) => {
          const newVal = e.currentTarget.textContent || "";
          setContent(newVal);
          onChange?.(newVal);
      }}
    >
      {content}
    </Tag>
  );
};

// --- Editable Media Component ---
const EditableMedia = ({ 
  src, 
  type = 'image', 
  className, 
  isEditing,
  keyword,
  alt,
  onChange
}: { 
  src: string, 
  type?: 'image' | 'video' | 'youtube', 
  className?: string, 
  isEditing: boolean, 
  keyword?: string,
  alt?: string,
  onChange?: (val: string) => void
}) => {
  const getPlaceholder = () => {
     if (type === 'image' && keyword) {
        if (keyword.startsWith('http') || keyword.startsWith('blob:') || keyword.startsWith('data:')) {
            return keyword;
        }
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(keyword)}?width=800&height=600&nologo=true`;
     }
     return src;
  };

  const [currentSrc, setCurrentSrc] = useState(src || getPlaceholder());
  const [youtubeInput, setYoutubeInput] = useState(keyword || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (src && src !== currentSrc && type !== 'youtube') {
       setCurrentSrc(src);
    } else if (!currentSrc && keyword) {
       setCurrentSrc(getPlaceholder());
    }
  }, [src, keyword]);

  useEffect(() => {
    if (type === 'youtube') {
        const videoIdMatch = youtubeInput.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
            const url = `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=0&controls=1&rel=0`;
            setCurrentSrc(url);
            onChange?.(url);
        } else if (youtubeInput.startsWith('http')) {
             setCurrentSrc(youtubeInput);
             onChange?.(youtubeInput); 
        } else {
            const url = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(youtubeInput)}&autoplay=0&controls=1&rel=0`;
            setCurrentSrc(url);
            onChange?.(url);
        }
    }
  }, [youtubeInput, type]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCurrentSrc(objectUrl);
      onChange?.(objectUrl);
    }
  };

  const handleAiGenerate = async () => {
    if (type !== 'image' || !keyword) return;
    setLoading(true);
    try {
      const res = await generateImage(keyword);
      setCurrentSrc(res);
      onChange?.(res);
    } catch (e) {
      console.error(e);
      alert("AI Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (type === 'youtube' && isEditing) {
      return (
          <div className={`relative group ${className} overflow-hidden bg-slate-900 flex flex-col items-center justify-center border-2 border-dashed border-purple-500/50 hover:border-purple-500 transition-colors`}>
             <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <iframe src={currentSrc} className="w-full h-full object-cover grayscale" />
             </div>
             <div className="z-10 bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-slate-600">
                 <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Youtube className="w-5 h-5" />
                    <span className="font-bold text-sm">Edit Video Source</span>
                 </div>
                 <input 
                    type="text" 
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none mb-2 text-sm"
                    placeholder="Paste YouTube URL or Search Term"
                 />
             </div>
          </div>
      );
  }

  if (type === 'youtube') {
      return (
        <div className={`relative group ${className} overflow-hidden bg-black`}>
            <iframe 
                src={currentSrc} 
                className="w-full h-full" 
                frameBorder="0" 
                allowFullScreen 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
      );
  }

  return (
    <div className={`relative group ${className} overflow-hidden bg-slate-100`}>
      {type === 'image' ? (
         <img src={currentSrc} alt={alt} className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'blur-xl scale-110' : ''}`} />
      ) : (
         <video src={currentSrc} className="w-full h-full object-cover" autoPlay loop muted playsInline />
      )}
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-sm">
          <Loader className="animate-spin text-white w-8 h-8"/>
        </div>
      )}

      {isEditing && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-10 backdrop-blur-[2px] border-2 border-purple-500 m-1 rounded-lg">
           <input type="file" ref={fileInputRef} className="hidden" accept={type === 'image' ? "image/*" : "video/*"} onChange={handleFileUpload} />
           <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-slate-200 transform hover:scale-105 transition-all shadow-lg">
             <Upload className="w-3 h-3"/> Upload {type === 'image' ? 'Image' : 'File'}
           </button>
           {type === 'image' && (
             <button onClick={handleAiGenerate} className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-purple-500 transform hover:scale-105 transition-all shadow-lg">
               <Wand2 className="w-3 h-3"/> AI Regenerate
             </button>
           )}
        </div>
      )}
    </div>
  );
}

// --- Next Level 3D Background with Scroll Parallax ---

const createSoftParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // Create a brighter, sharper glow for visibility
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)'); // Increased brightness
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

const ThreeBackground = ({ type, colorPrimary, scrollRef }: { type: string, colorPrimary: string, scrollRef: React.MutableRefObject<number> }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    
    // IMPORTANT: Very light fog for depth but not obscuring
    scene.fog = new THREE.FogExp2(0x000000, 0.005);
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    // Clear color is transparent
    renderer.setClearColor(0x000000, 0);
    
    const container = mountRef.current;
    container.appendChild(renderer.domElement);

    // Robust Resizing
    const handleResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    
    // Initial size
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    
    const group = new THREE.Group();
    scene.add(group);
    
    // Fallback and parse color
    let safeColor = new THREE.Color(colorPrimary || '#8b5cf6');
    const hsl = { h: 0, s: 0, l: 0 };
    safeColor.getHSL(hsl);
    // FORCE bright color for visibility against black background
    safeColor.setHSL(hsl.h, hsl.s, Math.max(hsl.l, 0.6));

    const particleTexture = createSoftParticleTexture();

    let particles: THREE.Points;
    let grid: THREE.GridHelper;
    let mesh: THREE.Mesh;
    
    // --- Geometry Construction ---
    if (type === 'grid' || type === 'cyber') {
        grid = new THREE.GridHelper(200, 60, safeColor, 0x333333);
        grid.position.y = -20;
        group.add(grid);
    } 
    
    // Setup Particles
    const count = type === 'particles' ? 4000 : 2000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for(let i=0; i<count*3; i++) {
        // Wider spread for full screen coverage
        pos[i] = (Math.random() - 0.5) * 250; 
    }
    for(let i=0; i<count; i++) {
        sizes[i] = Math.random() * (type === 'particles' ? 2.5 : 2);
        speeds[i] = 0.02 + Math.random() * 0.05;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    
    const mat = new THREE.PointsMaterial({ 
        size: type === 'particles' ? 0.8 : 0.8, 
        color: safeColor, 
        transparent: true, 
        opacity: 0.9, 
        map: particleTexture || undefined,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    
    particles = new THREE.Points(geo, mat);
    group.add(particles);

    if (type === 'orb') {
        const sphereGeo = new THREE.IcosahedronGeometry(6, 2);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: safeColor, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        mesh = new THREE.Mesh(sphereGeo, sphereMat);
        group.add(mesh);

        // Add a glow mesh inside
        const glowGeo = new THREE.IcosahedronGeometry(5, 1);
        const glowMat = new THREE.MeshBasicMaterial({
             color: safeColor,
             transparent: true,
             opacity: 0.15,
             blending: THREE.AdditiveBlending
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        group.add(glowMesh);
    }

    // XR-Like Mouse Follower (Glowing Cursor)
    const cursorGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cursorMat = new THREE.MeshBasicMaterial({ color: safeColor, transparent: true, opacity: 0.8 });
    const cursorMesh = new THREE.Mesh(cursorGeo, cursorMat);
    scene.add(cursorMesh);
    
    // --- Animation Loop ---
    let frameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
        // Normalize mouse for tilt
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      
      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      // Move Cursor
      cursorMesh.position.x = mouseX * 30;
      cursorMesh.position.y = mouseY * 20;
      cursorMesh.position.z = 10;

      // XR-like Tilt Effect: Rotate the entire group based on mouse
      group.rotation.y = mouseX * 0.2; // Horizontal tilt
      group.rotation.x = -mouseY * 0.2; // Vertical tilt

      // Floating Particles
      if (type === 'particles' || type === 'orb') {
         const positions = particles.geometry.attributes.position.array as Float32Array;
         const speed = particles.geometry.attributes.speed.array as Float32Array;
         
         for(let i=0; i<count; i++) {
             const i3 = i * 3;
             positions[i3+1] += speed[i]; // Move up
             
             // Reset if too high
             if(positions[i3+1] > 100) {
                 positions[i3+1] = -100;
             }
         }
         particles.geometry.attributes.position.needsUpdate = true;
         
         // Slow continuous rotation
         particles.rotation.y = time * 0.05;
      }
      
      if (type === 'orb' && mesh) {
         mesh.rotation.x = time * 0.2;
         mesh.rotation.y = time * 0.1;
         
         const pulsate = 1 + Math.sin(time * 2) * 0.1;
         mesh.scale.setScalar(pulsate);
      }
      
      if (type === 'waves') {
         const positions = particles.geometry.attributes.position.array as Float32Array;
         for(let i=0; i<count; i++) {
             const i3 = i * 3;
             const x = positions[i3];
             const z = positions[i3+2];
             positions[i3 + 1] = Math.sin(time + x * 0.1 + z * 0.1) * 5;
         }
         particles.geometry.attributes.position.needsUpdate = true;
      }

      // Scroll Parallax Effect
      if (scrollRef.current !== undefined) {
         const scrollY = scrollRef.current;
         // Move camera down as we scroll
         camera.position.y = -scrollY * 0.02; 
         // Subtle rotation on scroll
         camera.rotation.z = scrollY * 0.0001;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      if(mountRef.current && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    }
  }, [type, colorPrimary, scrollRef]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};

const WebsiteRenderer: React.FC<WebsiteRendererProps> = ({ data, onReset }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [websiteData, setWebsiteData] = useState<GeneratedWebsite>(() => {
    // Force Orb style if not already set
    if (data.hero.style3D !== 'orb') {
      return { ...data, hero: { ...data.hero, style3D: 'orb' } };
    }
    return data;
  });
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(0); 
  const lenisRef = useRef<any>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current.firstElementChild,
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;

    lenis.on('scroll', ({ scroll }: any) => {
        scrollRef.current = scroll;
    });

    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, [device]);

  useEffect(() => {
     setIsSaved(false);
  }, [websiteData]);

  const updateColor = (key: keyof GeneratedWebsite['colorPalette'], value: string) => {
      setWebsiteData(prev => ({ ...prev, colorPalette: { ...prev.colorPalette, [key]: value } }));
  };
  
  const updateHeroStyle = (style: 'orb' | 'particles' | 'grid' | 'waves') => {
      setWebsiteData(prev => ({ ...prev, hero: { ...prev.hero, style3D: style } }));
  };

  const handleSave = () => {
      setTimeout(() => setIsSaved(true), 500);
  };

  const handleLiveVisit = () => {
      setShowDeployModal(false);
      setIsLive(true);
      setIsEditing(false);
      setDevice('desktop');
  };

  const containerWidth = isLive ? 'w-full' : (device === 'mobile' ? 'max-w-[375px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-full');

  const styleVars = {
    '--primary': websiteData.colorPalette.primary,
    '--secondary': websiteData.colorPalette.secondary,
    '--bg': websiteData.colorPalette.background,
    '--text': websiteData.colorPalette.text,
    '--accent': websiteData.colorPalette.accent,
    '--font-head': websiteData.fontPairing.heading,
    '--font-body': websiteData.fontPairing.body,
  } as React.CSSProperties;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoSrc(URL.createObjectURL(file));
      setIsSaved(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 font-sans text-white overflow-hidden">
      
      {/* --- Toolbar (Hidden in Live Mode) --- */}
      {!isLive && (
        <header className="h-16 border-b border-white/10 bg-[#0d1117] flex items-center justify-between px-6 z-50 shrink-0 relative shadow-md">
            <div className="flex items-center gap-4">
                <button onClick={onReset} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                <Icons.ArrowLeft className="w-4 h-4"/> Back
                </button>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="flex flex-col">
                    <EditableText 
                    text={websiteData.header.companyName} 
                    isEditing={isEditing} 
                    onChange={(val) => setWebsiteData(prev => ({ ...prev, header: { ...prev.header, companyName: val } }))}
                    className="font-bold text-sm truncate w-32 md:w-auto text-slate-200" 
                    tag="h1" 
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isSaved ? 'bg-green-500' : 'bg-yellow-500'}`}></div> 
                            {isSaved ? 'Saved' : 'Unsaved changes'}
                        </span>
                        {!isSaved && (
                            <button onClick={handleSave} className="text-[10px] text-blue-400 hover:underline">Save</button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex bg-slate-800/50 p-1 rounded-lg border border-white/5">
                {['desktop', 'tablet', 'mobile'].map((d) => (
                    <button key={d} onClick={() => setDevice(d as any)} className={`p-2 rounded transition-all ${device === d ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                        {d === 'desktop' && <Monitor className="w-4 h-4"/>}
                        {d === 'tablet' && <Tablet className="w-4 h-4"/>}
                        {d === 'mobile' && <Smartphone className="w-4 h-4"/>}
                    </button>
                ))}
                </div>

                {isEditing && (
                    <button onClick={() => setShowThemePanel(!showThemePanel)} className={`p-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 border border-white/5 ${showThemePanel ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title="Theme Settings">
                        <Settings className="w-4 h-4" />
                    </button>
                )}

                <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-105 active:scale-95 border ${
                    isEditing 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                    : 'bg-white text-slate-900 border-transparent hover:bg-slate-200 shadow-md'
                }`}
                >
                {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                {isEditing ? 'Done' : 'Edit Site'}
                </button>
                
                <button 
                    onClick={() => setShowDeployModal(true)} 
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all flex items-center gap-2 border-t border-white/20"
                >
                <Cloud className="w-4 h-4" /> Deploy
                </button>
            </div>

            {/* Theme Panel */}
            <AnimatePresence>
                {isEditing && showThemePanel && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-16 right-6 w-64 bg-[#161b22] border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette className="w-3 h-3" /> Design System</h3>
                        <div className="space-y-3">
                            {['primary', 'secondary', 'background', 'text'].map(key => (
                            <div key={key} className="flex items-center justify-between group">
                                <label className="text-sm text-slate-300 capitalize group-hover:text-white transition-colors">{key}</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 font-mono hidden group-hover:block">{(websiteData.colorPalette as any)[key]}</span>
                                    <input type="color" value={(websiteData.colorPalette as any)[key]} onChange={(e) => updateColor(key as any, e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"/>
                                </div>
                            </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
      )}

      {/* --- Exit Live Mode Button --- */}
      {isLive && (
        <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsLive(false)}
            className="fixed bottom-6 right-6 z-[100] bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-black transition-all border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-2xl"
        >
            <ArrowLeft className="w-3 h-3" /> Exit Live Preview
        </motion.button>
      )}

      {/* --- Canvas --- */}
      <div className={`flex-1 bg-[#050505] relative overflow-hidden flex justify-center ${isLive ? 'py-0' : 'py-4 md:py-8'}`}>
         <div ref={scrollContainerRef} className={`bg-white shadow-2xl transition-all duration-500 relative ${containerWidth} w-full ${isLive ? 'h-full rounded-none ring-0' : (device !== 'desktop' ? 'rounded-xl ring-8 ring-slate-800 h-[85vh]' : 'h-full')} overflow-y-auto custom-scrollbar`} style={styleVars}>
            <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }} className="min-h-full font-sans relative">
               
               {isEditing && !isLive && (
                  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-purple-600/90 backdrop-blur text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-xl pointer-events-none animate-in fade-in slide-in-from-top-4 border border-purple-400/50 flex items-center gap-2">
                     <Edit3 className="w-3 h-3" />
                     Editing Mode Enabled
                  </div>
               )}

               {/* Header */}
               <nav className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--text)]/5 transition-all">
                  <div className="relative group flex items-center">
                    {logoSrc ? (
                        <div className="relative group/logo">
                            <img src={logoSrc} alt="Company Logo" className="h-10 w-auto object-contain max-w-[200px]" />
                            {isEditing && <button onClick={(e) => { e.stopPropagation(); setLogoSrc(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10 opacity-0 group-hover/logo:opacity-100" title="Remove Logo"><X className="w-3 h-3" /></button>}
                        </div>
                    ) : (
                        <EditableText 
                          text={websiteData.header.companyName} 
                          isEditing={isEditing} 
                          className="text-xl font-bold tracking-tighter cursor-pointer hover:opacity-80 transition-opacity" 
                          tag="div" 
                          onChange={(val) => setWebsiteData(prev => ({ ...prev, header: { ...prev.header, companyName: val } }))}
                        />
                    )}
                    
                    {isEditing && !logoSrc && <button onClick={() => logoInputRef.current?.click()} className="ml-2 text-slate-400 hover:text-[var(--primary)] transition-colors opacity-0 group-hover:opacity-100 p-1" title="Upload Logo"><Upload className="w-4 h-4" /></button>}
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>

                  <div className="hidden md:flex gap-6">
                     {websiteData.header.navLinks.map((link, i) => (
                        <EditableText 
                          key={i} 
                          text={link} 
                          isEditing={isEditing} 
                          className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-[var(--primary)] cursor-pointer transition-colors" 
                          tag="a" 
                          onChange={(val) => {
                             const newLinks = [...websiteData.header.navLinks];
                             newLinks[i] = val;
                             setWebsiteData(prev => ({ ...prev, header: { ...prev.header, navLinks: newLinks } }));
                          }}
                        />
                     ))}
                  </div>
                  <EditableText 
                    text={websiteData.header.ctaText} 
                    isEditing={isEditing} 
                    className="px-5 py-2 rounded-full text-sm font-bold bg-[var(--primary)] text-white hover:scale-105 hover:shadow-lg transition-all" 
                    tag="button" 
                    onChange={(val) => setWebsiteData(prev => ({ ...prev, header: { ...prev.header, ctaText: val } }))}
                  />
               </nav>

               {/* Hero */}
               <motion.header 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90vh] group/hero bg-black"
               >
                  {/* Background Layer with Explicit Z-Index */}
                  <div className="absolute inset-0 z-0">
                     <ThreeBackground type={websiteData.hero.style3D} colorPrimary={websiteData.colorPalette.primary} scrollRef={scrollRef} />
                  </div>
                  
                  {/* Gradient Overlay to blend 3D into content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[var(--bg)] z-10 pointer-events-none" />

                  {/* 3D Controls */}
                  {isEditing && (
                    <div className="absolute top-6 right-6 z-30 flex flex-col gap-2 items-end animate-in fade-in zoom-in duration-300">
                        <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-1.5 rounded-lg flex gap-1 shadow-2xl">
                             <div className="flex items-center px-2 border-r border-white/10 mr-1">
                                <Layers className="w-3 h-3 text-slate-400" />
                             </div>
                            {(['orb', 'particles', 'grid', 'waves'] as const).map((style) => (
                                <button
                                    key={style}
                                    onClick={(e) => { e.stopPropagation(); updateHeroStyle(style); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all capitalize ${
                                        websiteData.hero.style3D === style 
                                        ? 'bg-purple-600 text-white shadow-lg ring-1 ring-purple-400' 
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                  )}

                  <div className="relative z-20 max-w-5xl text-white">
                     <EditableText 
                        text={websiteData.hero.headline} 
                        isEditing={isEditing} 
                        tag="h1" 
                        className="text-5xl md:text-8xl font-bold mb-8 leading-tight drop-shadow-2xl font-[var(--font-head)]" 
                        onChange={(val) => setWebsiteData(prev => ({ ...prev, hero: { ...prev.hero, headline: val } }))}
                     />
                     <EditableText 
                        text={websiteData.hero.subheadline} 
                        isEditing={isEditing} 
                        tag="p" 
                        className="text-xl md:text-2xl opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed font-[var(--font-body)] text-shadow-sm" 
                        onChange={(val) => setWebsiteData(prev => ({ ...prev, hero: { ...prev.hero, subheadline: val } }))}
                     />
                     <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <EditableText 
                            text={websiteData.hero.ctaPrimary} 
                            isEditing={isEditing} 
                            tag="button" 
                            className="px-10 py-5 bg-[var(--primary)] text-white rounded-full font-bold text-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all cursor-pointer" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, hero: { ...prev.hero, ctaPrimary: val } }))}
                        />
                        <EditableText 
                            text={websiteData.hero.ctaSecondary} 
                            isEditing={isEditing} 
                            tag="button" 
                            className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-xl hover:bg-white/10 hover:scale-105 hover:border-white/50 transition-all cursor-pointer" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, hero: { ...prev.hero, ctaSecondary: val } }))}
                        />
                     </div>
                  </div>
               </motion.header>

               {/* Features */}
               <motion.section 
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="py-24 px-6 bg-[var(--bg)] relative z-20"
               >
                  <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-20">
                        <EditableText 
                            text={websiteData.features.title} 
                            isEditing={isEditing} 
                            tag="h2" 
                            className="text-4xl md:text-5xl font-bold mb-6 font-[var(--font-head)]" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, features: { ...prev.features, title: val } }))}
                        />
                        <EditableText 
                            text={websiteData.features.subtitle} 
                            isEditing={isEditing} 
                            tag="p" 
                            className="text-xl opacity-60 max-w-2xl mx-auto font-[var(--font-body)]" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, features: { ...prev.features, subtitle: val } }))}
                        />
                     </div>
                     <div className="grid md:grid-cols-3 gap-12">
                        {websiteData.features.items.map((item, i) => (
                           <div key={i} className="group hover:-translate-y-2 transition-transform duration-300">
                              <div className="mb-6 h-64 overflow-hidden rounded-2xl relative shadow-md group-hover:shadow-2xl transition-all">
                                 <EditableMedia 
                                    src="" 
                                    keyword={item.imageKeyword} 
                                    isEditing={isEditing} 
                                    className="w-full h-full" 
                                    type="image" 
                                    onChange={(val) => {
                                        const newItems = [...websiteData.features.items];
                                        newItems[i] = { ...newItems[i], imageKeyword: val };
                                        setWebsiteData(prev => ({ ...prev, features: { ...prev.features, items: newItems } }));
                                    }}
                                 />
                              </div>
                              <EditableText 
                                text={item.title} 
                                isEditing={isEditing} 
                                tag="h3" 
                                className="text-2xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors" 
                                onChange={(val) => {
                                    const newItems = [...websiteData.features.items];
                                    newItems[i] = { ...newItems[i], title: val };
                                    setWebsiteData(prev => ({ ...prev, features: { ...prev.features, items: newItems } }));
                                }}
                              />
                              <EditableText 
                                text={item.description} 
                                isEditing={isEditing} 
                                tag="p" 
                                className="opacity-70 leading-relaxed text-lg" 
                                onChange={(val) => {
                                    const newItems = [...websiteData.features.items];
                                    newItems[i] = { ...newItems[i], description: val };
                                    setWebsiteData(prev => ({ ...prev, features: { ...prev.features, items: newItems } }));
                                }}
                              />
                           </div>
                        ))}
                     </div>
                  </div>
               </motion.section>

               {/* Video Section */}
               {websiteData.videoSection && (
                  <motion.section 
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="py-24 px-6 bg-[var(--text)]/5 relative z-20"
                  >
                     <div className="max-w-6xl mx-auto text-center">
                        <EditableText 
                            text={websiteData.videoSection.title} 
                            isEditing={isEditing} 
                            tag="h2" 
                            className="text-4xl md:text-5xl font-bold mb-8 font-[var(--font-head)]" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, videoSection: { ...prev.videoSection!, title: val } }))}
                        />
                        <EditableText 
                            text={websiteData.videoSection.description} 
                            isEditing={isEditing} 
                            tag="p" 
                            className="text-xl opacity-70 mb-12 max-w-3xl mx-auto" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, videoSection: { ...prev.videoSection!, description: val } }))}
                        />
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black relative group ring-4 ring-white/10">
                           <EditableMedia 
                              type={websiteData.videoSection.videoType === 'youtube' ? 'youtube' : 'video'}
                              src={websiteData.videoSection.videoType === 'ambient' 
                                  ? (websiteData.videoSection.videoKeyword.startsWith('blob:') 
                                      ? websiteData.videoSection.videoKeyword 
                                      : `https://assets.mixkit.co/videos/preview/mixkit-abstract-video-4k-${websiteData.videoSection.videoKeyword}-large.mp4`)
                                  : ''}
                              keyword={websiteData.videoSection.videoKeyword}
                              isEditing={isEditing} 
                              className="w-full h-full"
                              onChange={(val) => setWebsiteData(prev => ({ ...prev, videoSection: { ...prev.videoSection!, videoKeyword: val } }))}
                           />
                        </div>
                     </div>
                  </motion.section>
               )}
               
               {/* Gallery */}
               {websiteData.gallery && (
                  <motion.section 
                     initial={{ opacity: 0, y: 100 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="py-24 px-6 relative z-20"
                  >
                     <div className="max-w-7xl mx-auto">
                        <EditableText 
                            text={websiteData.gallery.title} 
                            isEditing={isEditing} 
                            tag="h2" 
                            className="text-4xl md:text-5xl font-bold mb-16 text-center font-[var(--font-head)]" 
                            onChange={(val) => setWebsiteData(prev => ({ ...prev, gallery: { ...prev.gallery!, title: val } }))}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[800px] md:h-[600px]">
                           {websiteData.gallery.images.slice(0, 5).map((img, i) => (
                              <div key={i} className={`relative rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-700 ${i===0 ? 'col-span-2 row-span-2' : ''}`}>
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-700 z-10 pointer-events-none"/>
                                 <EditableMedia 
                                    src="" 
                                    keyword={img.keyword} 
                                    isEditing={isEditing} 
                                    className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                                    type="image" 
                                    onChange={(val) => {
                                        const newImages = [...websiteData.gallery!.images];
                                        newImages[i] = { ...newImages[i], keyword: val };
                                        setWebsiteData(prev => ({ ...prev, gallery: { ...prev.gallery!, images: newImages } }));
                                    }}
                                 />
                                 <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                     <EditableText 
                                        text={img.alt} 
                                        isEditing={isEditing} 
                                        tag="p" 
                                        className="text-white text-sm font-medium" 
                                        onChange={(val) => {
                                            const newImages = [...websiteData.gallery!.images];
                                            newImages[i] = { ...newImages[i], alt: val };
                                            setWebsiteData(prev => ({ ...prev, gallery: { ...prev.gallery!, images: newImages } }));
                                        }}
                                     />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.section>
               )}

               <motion.footer 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="py-16 px-6 border-t border-[var(--text)]/10 text-center opacity-60 text-sm bg-[var(--bg)] relative z-20"
               >
                  <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                     <Sparkles className="w-4 h-4" />
                  </div>
                  <EditableText 
                    text={websiteData.footer.copyright} 
                    isEditing={isEditing} 
                    onChange={(val) => setWebsiteData(prev => ({ ...prev, footer: { ...prev.footer, copyright: val } }))}
                  />
                  <div className="mt-4 text-xs opacity-50">Powered by DECo AI Engine</div>
               </motion.footer>

            </div>
         </div>
      </div>
      
      {/* Deployment Modal */}
      <AnimatePresence>
         {showDeployModal && <CloudDeployModal isOpen={showDeployModal} onClose={() => setShowDeployModal(false)} companyName={websiteData.header.companyName} onVisit={handleLiveVisit} />}
      </AnimatePresence>

    </div>
  );
};

export default WebsiteRenderer;