import React, { useState } from 'react';
import InputWizard from './components/InputWizard';
import WebsiteRenderer from './components/WebsiteRenderer';
import { generateWebsiteContent } from './services/geminiService';
import { GeneratedWebsite } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [websiteData, setWebsiteData] = useState<GeneratedWebsite | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (name: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateWebsiteContent(name, description);
      setWebsiteData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate website. Please try again with a simpler description or ensure your API key is configured.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWebsiteData(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 relative z-10" />
        </div>
        <h2 className="mt-8 text-2xl font-serif">Designing your masterpiece...</h2>
        <p className="mt-2 text-slate-400">Selecting typography, generating copy, and polishing pixels.</p>
      </div>
    );
  }

  if (websiteData) {
    return <WebsiteRenderer data={websiteData} onReset={handleReset} />;
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold ml-2">✕</button>
        </div>
      )}
      <InputWizard onGenerate={handleGenerate} isLoading={loading} />
    </>
  );
};

export default App;