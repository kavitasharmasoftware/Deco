import React, { useState, useEffect, useRef } from 'react';
import { Wand2, ArrowRight, Loader2, Sparkles, Zap, Globe, Layout, Lock, Menu, X, CheckCircle, PlayCircle, Star, Shield } from 'lucide-react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { SplineSceneBasic } from './SplineShowcase';

interface InputWizardProps {
  onGenerate: (name: string, description: string) => void;
  isLoading: boolean;
}

// --- Typing Animation Component ---
const Typewriter = ({ text }: { text: string[] }) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const i = loopNum % text.length;
    const fullText = text[i];

    const handleType = () => {
      setCurrentText(isDeleting ? fullText.substring(0, currentText.length - 1) : fullText.substring(0, currentText.length + 1));

      if (isDeleting) {
        setTypingSpeed(40);
      } else {
        setTypingSpeed(100);
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typingSpeed, text]);

  return (
    <span className="inline-block min-w-[1ch] text-left">
      {currentText}
      <span className="animate-pulse ml-1 inline-block w-1 h-8 md:h-16 bg-purple-500 align-middle"></span>
    </span>
  );
};

// --- Interactive Orb Component ---
const InteractiveOrb = ({ size = "w-24 h-24", color = "bg-purple-500", top, left, delay, opacity=0.3 }: any) => {
    const [clicked, setClicked] = useState(false);
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 1 }}
            className={`absolute ${top} ${left} z-0 hidden md:block`}
        >
            <motion.div
                className={`${size} rounded-full ${color} backdrop-blur-md border border-white/5 cursor-pointer flex items-center justify-center transition-colors duration-500`}
                style={{ backgroundColor: clicked ? 'rgba(139, 92, 246, 0.6)' : undefined }} // purple-500 equivalent with opacity
                onClick={() => setClicked(!clicked)}
                animate={{
                    scale: clicked ? 1.5 : 1,
                    boxShadow: clicked ? `0 0 80px ${color}` : "0 0 0px transparent",
                    filter: clicked ? "brightness(1.5)" : "brightness(1)"
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                 <div className={`w-full h-full rounded-full ${color} opacity-20 blur-xl`} />
            </motion.div>
        </motion.div>
    );
};

// --- 3D Background ---
const WizardBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mountRef.current.appendChild(renderer.domElement);

    const particlesGeo = new THREE.BufferGeometry();
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count*3; i++) pos[i] = (Math.random() - 0.5) * 60;
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.04, color: 0x8b5cf6, transparent: true, opacity: 0.5 });
    const starField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(starField);

    let frameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      starField.rotation.y += 0.0005;
      starField.rotation.x += 0.0002;
      // Parallax
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      if(mountRef.current) mountRef.current.innerHTML = '';
      renderer.dispose();
    }
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 bg-slate-950" />;
}

// --- Auth Modal ---
const AuthModal = ({ isOpen, onClose, mode }: { isOpen: boolean; onClose: () => void; mode: 'login' | 'signup' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-8 shadow-2xl z-10"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        <h2 className="text-2xl font-bold mb-2 text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-slate-400 mb-6 text-sm">Enter your credentials to access your workspace.</p>
        
        <div className="space-y-4">
           <div>
             <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Email</label>
             <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="you@example.com" />
           </div>
           <div>
             <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Password</label>
             <input type="password" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="••••••••" />
           </div>
           <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-all">
             {mode === 'login' ? 'Sign In' : 'Sign Up'}
           </button>
           
           <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
           </div>

           <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 hover:bg-slate-200">
             <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
             Google
           </button>
        </div>
      </motion.div>
    </div>
  );
}

const InputWizard: React.FC<InputWizardProps> = ({ onGenerate, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2 && description.trim()) {
      onGenerate(name, description);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-white bg-slate-950 relative overflow-x-hidden">
      <WizardBackground />
      
      {/* Decorative Interactive Orbs */}
      <InteractiveOrb top="top-[20%]" left="left-[15%]" color="bg-blue-600" delay={0.5} opacity={0.2} />
      <InteractiveOrb top="top-[55%]" left="left-[80%]" color="bg-purple-600" delay={0.8} opacity={0.3} size="w-32 h-32" />
      <InteractiveOrb top="top-[80%]" left="left-[10%]" color="bg-pink-600" delay={1.1} opacity={0.2} size="w-20 h-20" />

      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DECo</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#footer" className="hover:text-white transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button onClick={() => setAuthMode('login')} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</button>
             <button onClick={() => setAuthMode('signup')} className="text-sm font-bold bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">Sign up</button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4 md:hidden shadow-xl animate-slide-in-top">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Features</a>
              <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Showcase</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Pricing</a>
              <button onClick={() => {setAuthMode('login'); setMobileMenuOpen(false)}} className="text-left text-slate-300">Log in</button>
              <button onClick={() => {setAuthMode('signup'); setMobileMenuOpen(false)}} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-center">Sign up</button>
           </div>
        )}
      </nav>

      {/* --- Hero / Main Content --- */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-32 pb-20 min-h-screen">
         <div className="max-w-5xl w-full flex flex-col items-center text-center">
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.6 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-medium uppercase tracking-wider mb-8"
            >
              <Zap className="w-3 h-3" />
              <span>AI-Powered Website Builder V2.0</span>
            </motion.div>

            <div className="min-h-[120px] md:min-h-[160px] flex items-center justify-center mb-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl md:text-8xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-2xl text-center"
                >
                  {step === 1 ? (
                    <Typewriter text={["Craft your digital identity.", "Craft your dreams.", "Craft your future."]} />
                  ) : "Define your vision."}
                </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
            >
               {step === 1 
                 ? "Instant, professional websites generated from a single prompt. No coding required."
                 : "Tell us about your business goals, target audience, and aesthetic preferences."}
            </motion.p>

            {/* Input Box */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               transition={{ duration: 0.5, delay: 0.3 }}
               className={`relative w-full max-w-2xl group transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex shadow-2xl">
                 <div className="flex-1 flex flex-col justify-center px-4">
                    {step === 1 ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="What's your business name?"
                          className="bg-transparent border-none outline-none text-2xl md:text-3xl font-bold text-white placeholder-slate-600 h-16 w-full"
                          autoFocus
                        />
                    ) : (
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="e.g. A luxury travel agency focusing on polar expeditions..."
                          className="bg-transparent border-none outline-none text-xl font-medium text-white placeholder-slate-600 h-24 w-full resize-none pt-4"
                          autoFocus
                        />
                    )}
                 </div>
                 <button 
                    onClick={handleNext}
                    disabled={isLoading || (step === 1 && !name) || (step === 2 && !description)}
                    className="self-end mb-1 mr-1 w-14 h-14 bg-white hover:bg-slate-200 text-slate-900 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                 >
                    {isLoading ? <Loader2 className="animate-spin w-6 h-6"/> : <ArrowRight className="w-6 h-6" />}
                 </button>
              </div>
            </motion.div>

            {/* Progress Dots */}
            <div className="mt-8 flex gap-3">
               <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'w-12 bg-purple-500' : 'w-2 bg-slate-800'}`} />
               <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'w-12 bg-purple-500' : 'w-2 bg-slate-800'}`} />
               <div className="w-2 h-1.5 rounded-full bg-slate-800" />
            </div>
         </div>
      </main>

      {/* --- Features / Spline Section --- */}
      <section id="features" className="py-12 px-6 relative z-10">
         <div className="max-w-6xl mx-auto">
             <SplineSceneBasic />
         </div>
      </section>

      {/* --- Showcase Section --- */}
      <section id="showcase" className="py-24 relative z-10 border-t border-white/5 bg-slate-900/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Made with DECo</h2>
              <p className="text-slate-400">Explore what others are building with AI.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Neon Architecture", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", desc: "Minimalist portfolio" },
                 { title: "Eco Zenith", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800", desc: "Sustainable brand" },
                 { title: "Cyber Cafe", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800", desc: "Modern eatery" },
               ].map((item, i) => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
                     <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 flex flex-col justify-end p-6">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="text-sm text-slate-300">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- Pricing Section --- */}
      <section id="pricing" className="py-24 relative z-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
              <p className="text-slate-400">Start for free, upgrade when you're ready.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {[
                 { name: "Starter", price: "$0", features: ["1 Project", "Basic AI Generation", "Community Support"] },
                 { name: "Pro", price: "$19", features: ["Unlimited Projects", "Premium AI Models", "Custom Domain", "Export Code"], active: true },
                 { name: "Business", price: "$49", features: ["Team Collaboration", "API Access", "Priority Support", "White Label"] },
               ].map((plan, i) => (
                  <div key={i} className={`rounded-2xl p-8 border ${plan.active ? 'bg-purple-900/20 border-purple-500 relative' : 'bg-slate-900 border-slate-800'}`}>
                     {plan.active && <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>}
                     <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                     <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                     <ul className="space-y-4 mb-8">
                        {plan.features.map((f, j) => (
                           <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                             <CheckCircle className="w-4 h-4 text-purple-400" /> {f}
                           </li>
                        ))}
                     </ul>
                     <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.active ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                        Choose {plan.name}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer id="footer" className="relative z-10 py-16 border-t border-white/5 bg-slate-950">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm text-slate-400">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4 text-white">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-lg">DECo</span>
               </div>
               <p className="max-w-xs mb-6">Empowering creators to build stunning web experiences with the power of artificial intelligence.</p>
               <div className="flex gap-4">
                  {/* Social Icons Placeholder */}
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors"><Globe className="w-4 h-4"/></div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 cursor-pointer transition-colors"><Layout className="w-4 h-4"/></div>
               </div>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Product</h4>
               <ul className="space-y-3">
                  <li><a href="#" className="hover:text-purple-400">Features</a></li>
                  <li><a href="#" className="hover:text-purple-400">Templates</a></li>
                  <li><a href="#" className="hover:text-purple-400">Integrations</a></li>
                  <li><a href="#" className="hover:text-purple-400">Changelog</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Company</h4>
               <ul className="space-y-3">
                  <li><a href="#" className="hover:text-purple-400">About</a></li>
                  <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                  <li><a href="#" className="hover:text-purple-400">Careers</a></li>
                  <li><a href="#" className="hover:text-purple-400">Contact</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
            &copy; 2024 DECo AI. All rights reserved.
         </div>
      </footer>

      {/* Auth Modals */}
      <AnimatePresence>
        {authMode && <AuthModal isOpen={true} onClose={() => setAuthMode(null)} mode={authMode} />}
      </AnimatePresence>

    </div>
  );
};

export default InputWizard;