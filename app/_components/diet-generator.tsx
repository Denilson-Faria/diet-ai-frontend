"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "../types/diet-data.type";
import { useReactToPrint } from 'react-to-print';
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Activity,
  Target,
  Download,
  Share2,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  ShieldCheck,
  History,
  Trash2,
  X
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

// Tipo para planos salvos
interface SavedPlan {
  id: string;
  data: DietData;
  output: string;
  timestamp: number;
  objetivo: string;
}

export function DietGenerator({ data }: { data: DietData }) {
  const [output, setOutput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const controllerRef = useRef<AbortController | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Carregar planos salvos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('diet-plans')
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored))
      } catch (e) {
        console.error('Erro ao carregar planos:', e)
      }
    }
  }, [])

  // Salvar plano no localStorage
  const savePlan = (planOutput: string) => {
    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      data,
      output: planOutput,
      timestamp: Date.now(),
      objetivo: data.objetivo
    }

    const updated = [newPlan, ...savedPlans].slice(0, 10) // Mantém apenas os 10 últimos
    setSavedPlans(updated)
    localStorage.setItem('diet-plans', JSON.stringify(updated))
  }

  // Carregar plano anterior
  const loadPlan = (plan: SavedPlan) => {
    setOutput(plan.output)
    setShowHistory(false)
  }

  // Deletar plano
  const deletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id)
    setSavedPlans(updated)
    localStorage.setItem('diet-plans', JSON.stringify(updated))
  }

  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller

    setOutput("")
    setIsStreaming(true);

    try {
      const response = await fetch("http://localhost:3333/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: data.nome,
          idade: data.idade,
          altura_cm: data.altura_cm,
          peso_kg: data.peso_kg,
          sexo: data.sexo,
          nivel_atividade: data.nivel_atividade,
          objetivo: data.objetivo
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder("utf-8")
      let fullOutput = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break;

        const chunk = decoder.decode(value)
        fullOutput += chunk
        setOutput(fullOutput)
      }

      // Salva o plano completo
      if (fullOutput) {
        savePlan(fullOutput)
      }

    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null
    }
  }

  async function handleGenerate() {
    if (isStreaming) {
      controllerRef.current?.abort()
      setIsStreaming(false)
      return
    }

    await startStreaming();
  }

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Dieta_${data.nome.replace(/\s+/g, '_')}_Premium`,
    onBeforePrint: async () => {
      setIsExporting(true);
    },
    onAfterPrint: async () => {
      setIsExporting(false);
    },
  });

  const handleShare = async () => {
    const shareData = {
      title: `Minha Dieta Premium - ${data.nome}`,
      text: `Confira o plano alimentar personalizado que a IA gerou para meu objetivo de ${data.objetivo.replace('_', ' ')}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="p-6 md:p-10 space-y-6 animate-pulse">
      {/* Título skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>

      {/* Seções skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-emerald-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-24 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Formatar data
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-3 sm:p-4 md:p-12 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ecfdf5] rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#f0fdf4] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl relative space-y-4 md:space-y-8">
        
        {/* Card do Perfil - Melhorado para Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-sm border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-4 bg-[#111827] p-8 md:p-10 text-white relative flex flex-col justify-center rounded-l-3xl md:rounded-l-[40px] m-2">
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black mb-2">Olá, {data.nome}!</h2>
                  <p className="text-[#34d399] text-xs md:text-sm font-medium flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                    Perfil verificado pela IA
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-8 p-4 md:p-6 lg:p-8 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Bio Data
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-900">{data.idade} anos • {data.sexo}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Activity className="w-3 h-3" /> Metabolismo
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-900 capitalize">
                      {data.nivel_atividade.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> Foco Principal
                    </span>
                    <p className="text-xs md:text-sm font-bold text-gray-900 capitalize">
                      {data.objetivo.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Botão de Histórico */}
        {savedPlans.length > 0 && !output && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="w-full md:w-auto rounded-xl border-gray-200 hover:border-[#10b981] hover:text-[#059669] transition-all gap-2 h-11 px-5"
            >
              <History className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Meus Planos Anteriores ({savedPlans.length})
              </span>
            </Button>
          </motion.div>
        )}

        {/* Modal de Histórico */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-gray-900">Planos Anteriores</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(false)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {savedPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-all cursor-pointer"
                      onClick={() => loadPlan(plan)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                              {plan.objetivo.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatDate(plan.timestamp)}</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {plan.data.nome} • {plan.data.idade} anos
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            deletePlan(plan.id)
                          }}
                          className="rounded-lg hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Principal - Melhorado para Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg border border-gray-100 rounded-2xl md:rounded-[32px] overflow-hidden min-h-[400px]">
            
            {/* Estado Inicial */}
            {!output && !isStreaming && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
              >
                <motion.div
                  className="relative mb-6 md:mb-8"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 bg-[#111827] rounded-3xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#34d399]" />
                  </div>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 md:mb-4">
                  Seu plano está pronto
                </h3>
                <Button
                  onClick={handleGenerate}
                  className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-extrabold bg-[#111827] hover:bg-black text-white rounded-2xl md:rounded-[20px] flex items-center gap-3 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#34d399]" />
                  <span className="hidden sm:inline">Gerar Minha Dieta Premium</span>
                  <span className="sm:hidden">Gerar Dieta</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </motion.div>
            )}

            {/* Loading Skeleton */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="p-4 md:p-8 border-b border-gray-100 bg-[#f9fafb] text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#10b981] animate-spin" />
                    <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                      Esculpindo sua nova rotina...
                    </h3>
                  </div>
                  <Button 
                    onClick={handleGenerate} 
                    variant="ghost" 
                    className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2"
                  >
                    Cancelar
                  </Button>
                </div>
                <LoadingSkeleton />
              </motion.div>
            )}

            {/* Conteúdo Gerado */}
            {output && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full"
              >
                {/* Header com botões - Mobile Otimizado */}
                <div className="p-4 md:p-6 lg:p-8 border-b border-gray-100 bg-[#f9fafb] flex flex-col gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#111827] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#34d399]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-black text-gray-900 truncate">
                        Seu Plano Exclusivo
                      </h3>
                      <p className="text-[10px] md:text-xs font-bold text-[#059669] uppercase tracking-widest truncate">
                        Otimizado para {data.objetivo.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePrint()}
                      disabled={isExporting}
                      className="flex-1 sm:flex-none rounded-xl border-gray-200 hover:border-[#10b981] hover:text-[#059669] transition-all gap-2 h-10 md:h-11 px-4 md:px-5"
                    >
                      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {isExporting ? 'Gerando...' : 'PDF'}
                      </span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="flex-1 sm:flex-none rounded-xl border-gray-200 hover:border-[#10b981] hover:text-[#059669] transition-all gap-2 h-10 md:h-11 px-4 md:px-5"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Área de conteúdo - Mobile Otimizada */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 md:p-6 lg:p-10 bg-white" 
                  ref={contentRef}
                >
                  <div className="prose prose-emerald max-w-none prose-sm md:prose-base">
                    <ReactMarkdown
                      components={{
                        h1: ({ ...props }) => (
                          <h1 
                            style={{ 
                              color: '#111827', 
                              borderBottom: '4px solid #10b981', 
                              paddingBottom: '0.75rem',
                              marginBottom: '1.5rem',
                              fontWeight: 900,
                              fontSize: 'clamp(1.5rem, 5vw, 2.25rem)'
                            }} 
                            {...props} 
                          />
                        ),
                        h2: ({ ...props }) => (
                          <h2 
                            style={{ 
                              color: '#111827', 
                              marginTop: 'clamp(2rem, 5vw, 3rem)',
                              marginBottom: '1rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              fontWeight: 800,
                              fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
                              flexWrap: 'wrap'
                            }} 
                            {...props}
                          >
                            <span style={{ 
                              width: '6px',
                              height: '24px',
                              backgroundColor: '#10b981',
                              borderRadius: '9999px',
                              display: 'inline-block',
                              flexShrink: 0
                            }}></span>
                            {props.children}
                          </h2>
                        ),
                        h3: ({ ...props }) => (
                          <h3 
                            style={{ 
                              color: '#047857',
                              fontWeight: 700,
                              marginTop: '1.5rem',
                              marginBottom: '0.75rem',
                              fontSize: 'clamp(1rem, 3vw, 1.25rem)'
                            }} 
                            {...props} 
                          />
                        ),
                        ul: ({ ...props }) => (
                          <ul 
                            style={{ 
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                              gap: 'clamp(0.75rem, 2vw, 1rem)',
                              listStyle: 'none',
                              padding: 0,
                              margin: '1rem 0'
                            }} 
                            {...props} 
                          />
                        ),
                        li: ({ ...props }) => (
                          <li 
                            style={{ 
                              backgroundColor: '#f9fafb',
                              border: '1px solid #f3f4f6',
                              padding: 'clamp(0.75rem, 2vw, 1rem)',
                              borderRadius: '0.75rem',
                              display: 'flex',
                              alignItems: 'start',
                              gap: '0.5rem',
                              color: '#374151',
                              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                            }} 
                            {...props}
                          >
                            <span style={{ 
                              color: '#10b981',
                              fontWeight: 900,
                              flexShrink: 0
                            }}>✓</span>
                            <span style={{ flex: 1 }}>{props.children}</span>
                          </li>
                        ),
                        strong: ({ ...props }) => (
                          <strong 
                            style={{ 
                              color: '#111827',
                              fontWeight: 800
                            }} 
                            {...props} 
                          />
                        ),
                        blockquote: ({ ...props }) => (
                          <blockquote 
                            style={{ 
                              border: 'none',
                              backgroundColor: '#111827',
                              color: '#34d399',
                              borderRadius: '1rem',
                              padding: 'clamp(1rem, 3vw, 2rem)',
                              margin: '1.5rem 0',
                              fontStyle: 'italic',
                              fontWeight: 500,
                              fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                            }} 
                            {...props}
                          >
                            {props.children}
                          </blockquote>
                        ),
                      }}
                    >
                      {output}
                    </ReactMarkdown>
                  </div>
                </motion.div>

                {/* Footer */}
                {!isStreaming && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 md:p-8 border-t border-gray-100 bg-[#f9fafb] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6"
                  >
                    <div className="flex items-center gap-3 text-gray-400 text-center md:text-left">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      <span className="text-xs font-medium italic">
                        Plano exclusivo baseado em sua bio-composição.
                      </span>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      variant="ghost"
                      className="h-10 md:h-12 px-4 md:px-6 rounded-xl hover:bg-[#ecfdf5] text-[#047857] font-bold gap-2 group transition-all w-full md:w-auto"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      <span className="text-xs md:text-sm">Recalcular Plano</span>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}