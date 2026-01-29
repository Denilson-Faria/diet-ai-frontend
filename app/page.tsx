"use client";
import { useState, useEffect } from 'react'
import { DietForm } from "./_components/diet-form"; 
import { DietGenerator } from './_components/diet-generator'; 
import { DietData } from "@/app/types/diet-data.type"
import { Loader2 } from 'lucide-react';

const CURRENT_DIET_KEY = 'current-diet-session';

export default function Home() {
  const [data, setData] = useState<DietData | null>(null)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem(CURRENT_DIET_KEY);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setData(parsed);
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
        localStorage.removeItem(CURRENT_DIET_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  function handleSubmit(userInfo: DietData) {
    setData(userInfo);
    localStorage.setItem(CURRENT_DIET_KEY, JSON.stringify(userInfo));
  }

  function handleNewPlan() {
    setData(null);
    localStorage.removeItem(CURRENT_DIET_KEY);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {!data ? (
        <DietForm onSubmit={handleSubmit} />
      ) : (
        <div className="relative">
          <button
            onClick={handleNewPlan}
            className="fixed top-4 left-4 z-50 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all text-xs font-bold text-gray-700 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300 flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Novo Plano
          </button>
          
          <DietGenerator data={data} />
        </div>
      )}
    </main>
  );
}