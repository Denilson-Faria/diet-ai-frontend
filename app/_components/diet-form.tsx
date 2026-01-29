"use client";

import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Scale,
    Ruler,
    Activity,
    Sparkles,
    Zap,
    ChevronRight,
    CheckCircle2,
    Info,
    Calendar,
    Target,
    Dumbbell,
    Save,
    RotateCcw
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';

const dietSchema = z.object({
    nome: z.string().min(2, "O nome é obrigatório"),
    idade: z.number().int().positive("Idade deve ser um número positivo").min(10, "Idade mínima: 10 anos").max(120, "Idade máxima: 120 anos"),
    altura_cm: z.number().positive("Altura deve ser um número positivo").min(100, "Altura mínima: 100cm").max(250, "Altura máxima: 250cm"),
    peso_kg: z.number().positive("Peso deve ser um número positivo").min(30, "Peso mínimo: 30kg").max(300, "Peso máximo: 300kg"),
    sexo: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
    nivel_atividade: z.enum(["sedentario", "2x semana", "3x semana", "intenso"], { message: "Selecione o nível de atividade" }),
    objetivo: z.enum(["perder_peso", "hipertrofia", "manter_peso"], { message: "Selecione o objetivo" }),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
    onSubmit: (data: DietSchemaFormData) => void;
}

const STORAGE_KEY = 'diet-form-draft';

export function DietForm({ onSubmit }: DietFormProps) {
    const [showRecoverModal, setShowRecoverModal] = useState(false);
    const [savedDraft, setSavedDraft] = useState<DietSchemaFormData | null>(null);
    const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());

    const form = useForm<DietSchemaFormData>({
        resolver: zodResolver(dietSchema),
        defaultValues: {
            nome: "",
            idade: undefined,
            altura_cm: undefined,
            peso_kg: undefined,
            sexo: undefined,
            nivel_atividade: undefined,
            objetivo: undefined,
        },
        mode: "onChange" 
    });

    
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const draft = JSON.parse(stored);
                setSavedDraft(draft);
                setShowRecoverModal(true);
            } catch (e) {
                console.error('Erro ao carregar rascunho:', e);
            }
        }
    }, []);

    
    useEffect(() => {
        const subscription = form.watch((value) => {
            
            const hasData = Object.values(value).some(v => v !== undefined && v !== "");
            if (hasData) {
                const timer = setTimeout(() => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
                }, 1000); 

                return () => clearTimeout(timer);
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            
            const newCompletedFields = new Set<string>();

            Object.keys(value).forEach((fieldName) => {
                const fieldValue = value[fieldName as keyof DietSchemaFormData];

                try {
                    
                    const fieldSchema = dietSchema.shape[fieldName as keyof typeof dietSchema.shape];
                    fieldSchema.parse(fieldValue);

                    
                    if (fieldValue !== undefined && fieldValue !== "") {
                        newCompletedFields.add(fieldName);
                    }
                } catch (e) {
                    
                }
            });

            setCompletedFields(newCompletedFields);
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    const recoverDraft = () => {
        if (savedDraft) {
            form.reset(savedDraft);
            setShowRecoverModal(false);
        }
    };

    const discardDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setSavedDraft(null);
        setShowRecoverModal(false);
    };

    const handleFormSubmit = (data: DietSchemaFormData) => {
        
        localStorage.removeItem(STORAGE_KEY);
        onSubmit(data);
    };

    
    const totalFields = 7;
    const progress = (completedFields.size / totalFields) * 100;

    
    const isFieldValid = (fieldName: string) => {
        return completedFields.has(fieldName);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-3 sm:p-4 md:p-8 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-green-100/40 rounded-full blur-3xl" />
            </div>

            {/* Modal de Recuperação de Rascunho */}
            <AnimatePresence>
                {showRecoverModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[32px] p-8 sm:p-10 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-gray-100 relative overflow-hidden"
                        >
                            {/* Detalhe decorativo sutil no fundo */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50" />

                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center mb-6 shadow-inner">
                                    <Save className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Rascunho Encontrado!</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Notamos que você já começou a preencher seu perfil. Deseja retomar de onde parou?
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={recoverDraft}
                                    className="group relative h-14 bg-[#111827] hover:bg-black text-white rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform duration-300" />
                                        Continuar Progresso
                                    </div>
                                    {/* Efeito de brilho no hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite]" />
                                </Button>

                                <Button
                                    onClick={discardDraft}
                                    variant="ghost"
                                    className="h-12 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all duration-200"
                                >
                                    Começar do Zero
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Adicione este CSS global ou no seu arquivo de estilos para o efeito de brilho */}
            <style jsx global>{`
  @keyframes shine {
    100% {
      transform: translateX(100%);
    }
  }
`}</style>


            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-4xl relative mx-auto"
            >
                <Card className="bg-white/80 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white/20 rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden w-full">

                    <div className="grid grid-cols-1 lg:grid-cols-12">

                        {/* Sidebar/Header Info - Animado */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="lg:col-span-4 bg-[#111827] p-6 sm:p-6 lg:p-8 text-white flex flex-col justify-between relative overflow-hidden rounded-tl-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-l-2xl md:rounded-l-[32px]"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="relative z-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full mb-6 sm:mb-8 border border-emerald-500/30"
                                >
                                    <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400" />
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-emerald-400">Dietron AI</span>
                                </motion.div>

                                <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight mb-4 sm:mb-5">
                                    Cuidado <br />
                                    <span className="text-emerald-400 italic">premium</span> <br />
                                    para sua melhor versão.
                                </h1>

                                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                                    {[
                                        { icon: CheckCircle2, text: "Análise metabólica precisa" },
                                        { icon: CheckCircle2, text: "Cardápio 100% exclusivo" },
                                        { icon: CheckCircle2, text: "Suporte baseado em dados" }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="flex items-center gap-3 sm:gap-4 group"
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-400 group-hover:text-white transition-colors">{item.text}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className="relative z-10 mt-6 sm:mt-8 lg:mt-0 pt-6 sm:pt-8 border-t border-white/10"
                            >
                                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
                                    Ao preencher, nossa IA processará mais de 50 variáveis para otimizar sua queima calórica.
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Main Form Area - Animado */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="lg:col-span-8 p-4 sm:p-5 md:p-6 lg:p-8"
                        >
                            {/* Progress Bar Compacta - Canto Superior */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mb-4 sm:mb-5"
                            >
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-2.5 sm:p-3 border border-emerald-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-700">
                                            Progresso
                                        </span>
                                        <span className="text-xs font-black text-emerald-600">
                                            {completedFields.size}/{totalFields}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 sm:space-y-7">

                                    {/* Section 1: Identidade */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3 sm:space-y-4"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1 h-5 sm:h-6 bg-emerald-500 rounded-full" />
                                            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Perfil Biométrico</h2>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                            {/* Nome - Full Width no Mobile */}
                                            <FormField
                                                control={form.control}
                                                name="nome"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                            <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                            Nome Completo
                                                            {isFieldValid('nome') && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                </motion.div>
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Como devemos te chamar?"
                                                                className={cn(
                                                                    "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all placeholder:text-gray-400 text-sm sm:text-base",
                                                                    isFieldValid('nome') && "border-emerald-300 bg-emerald-50/50"
                                                                )}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-medium" />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Idade e Sexo - Empilhados no Mobile */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="idade"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                                <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                                Idade
                                                                {isFieldValid('idade') && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                    </motion.div>
                                                                )}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        field.onChange(val === "" ? undefined : Number(val));
                                                                    }}
                                                                    name={field.name}
                                                                    onBlur={field.onBlur}
                                                                    ref={field.ref}
                                                                    {...(field.value !== undefined && { value: field.value })}
                                                                    placeholder="Ex: 28"
                                                                    className={cn(
                                                                        "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base",
                                                                        isFieldValid('idade') && "border-emerald-300 bg-emerald-50/50"
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-[10px] font-medium" />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="sexo"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                                Sexo
                                                                {isFieldValid('sexo') && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                    </motion.div>
                                                                )}
                                                            </FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className={cn(
                                                                        "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base",
                                                                        isFieldValid('sexo') && "border-emerald-300 bg-emerald-50/50"
                                                                    )}>
                                                                        <SelectValue placeholder="Selecione" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="rounded-xl border-gray-100">
                                                                    <SelectItem value="masculino">Masculino</SelectItem>
                                                                    <SelectItem value="feminino">Feminino</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage className="text-[10px] font-medium" />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Peso e Altura - Empilhados no Mobile Pequeno */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <FormField
                                                control={form.control}
                                                name="peso_kg"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                            <Scale className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                            Peso Atual
                                                            {isFieldValid('peso_kg') && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                </motion.div>
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        field.onChange(val === "" ? undefined : parseFloat(val));
                                                                    }}
                                                                    name={field.name}
                                                                    onBlur={field.onBlur}
                                                                    ref={field.ref}
                                                                    {...(field.value !== undefined && { value: field.value })}
                                                                    placeholder="00.0"
                                                                    className={cn(
                                                                        "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all pr-12 text-sm sm:text-base",
                                                                        isFieldValid('peso_kg') && "border-emerald-300 bg-emerald-50/50"
                                                                    )}
                                                                />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 group-focus-within:text-emerald-500">kg</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-medium" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="altura_cm"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                            <Ruler className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                            Altura
                                                            {isFieldValid('altura_cm') && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                </motion.div>
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative group">
                                                                <Input
                                                                    type="number"
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        field.onChange(val === "" ? undefined : parseFloat(val));
                                                                    }}
                                                                    name={field.name}
                                                                    onBlur={field.onBlur}
                                                                    ref={field.ref}
                                                                    {...(field.value !== undefined && { value: field.value })}
                                                                    placeholder="Ex: 175"
                                                                    className={cn(
                                                                        "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all pr-12 text-sm sm:text-base",
                                                                        isFieldValid('altura_cm') && "border-emerald-300 bg-emerald-50/50"
                                                                    )}
                                                                />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 group-focus-within:text-emerald-500">cm</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] font-medium" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Section 2: Lifestyle & Goals */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-3 sm:space-y-4"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1 h-5 sm:h-6 bg-emerald-500 rounded-full" />
                                            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Estilo de Vida</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <FormField
                                                control={form.control}
                                                name="nivel_atividade"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                            <Dumbbell className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                            Nível de Atividade
                                                            {isFieldValid('nivel_atividade') && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                </motion.div>
                                                            )}
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={cn(
                                                                    "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base",
                                                                    isFieldValid('nivel_atividade') && "border-emerald-300 bg-emerald-50/50"
                                                                )}>
                                                                    <SelectValue placeholder="Sua rotina" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl">
                                                                <SelectItem value="sedentario" className="py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-sm">Sedentário</span>
                                                                        <span className="text-[10px] text-gray-500">Pouco ou nenhum exercício</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="2x semana" className="py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-sm">Leve</span>
                                                                        <span className="text-[10px] text-gray-500">Exercícios 1-2x por semana</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="3x semana" className="py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-sm">Moderado</span>
                                                                        <span className="text-[10px] text-gray-500">Exercícios 3-4x por semana</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="intenso" className="py-3">
                                                                    <div className="flex flex-col">
                                                                        <span className="font-semibold text-sm">Intenso</span>
                                                                        <span className="text-[10px] text-gray-500">Atleta ou 5+ treinos semanais</span>
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-[10px] font-medium" />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="objetivo"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                                            <Target className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-600" />
                                                            Objetivo Principal
                                                            {isFieldValid('objetivo') && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                </motion.div>
                                                            )}
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className={cn(
                                                                    "bg-gray-50 border-gray-100 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 h-11 sm:h-12 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base",
                                                                    isFieldValid('objetivo') && "border-emerald-300 bg-emerald-50/50"
                                                                )}>
                                                                    <SelectValue placeholder="Sua meta" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="rounded-xl">
                                                                <SelectItem value="perder_peso" className="py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">⚖️</div>
                                                                        <span className="font-semibold text-sm">Queima de Gordura</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="hipertrofia" className="py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">💪</div>
                                                                        <span className="font-semibold text-sm">Ganho Muscular</span>
                                                                    </div>
                                                                </SelectItem>
                                                                <SelectItem value="manter_peso" className="py-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">🎯</div>
                                                                        <span className="font-semibold text-sm">Manutenção & Saúde</span>
                                                                    </div>
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage className="text-[10px] font-medium" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Submit Area */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="pt-3 sm:pt-4"
                                    >
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-green-400 rounded-2xl sm:rounded-[24px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                                            <Button
                                                type="submit"
                                                disabled={progress < 100}
                                                className="relative w-full h-12 sm:h-14 text-base sm:text-lg font-extrabold bg-[#111827] hover:bg-black text-white rounded-xl sm:rounded-[20px] shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="relative z-10 text-sm sm:text-base">
                                                    {progress === 100 ? 'Gerar Meu Plano Personalizado' : `Complete os campos (${completedFields.size}/${totalFields})`}
                                                </span>
                                                {progress === 100 && (
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                                )}
                                                {progress === 100 && (
                                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
                                                )}
                                            </Button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-5">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-500 fill-emerald-500" />
                                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">Processamento Instantâneo</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-500" />
                                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">100% Privado</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                </form>
                            </Form>
                        </motion.div>
                    </div>
                </Card>

                {/* Bottom Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-6 sm:mt-8 flex justify-center"
                >
                    <div className="bg-white/50 backdrop-blur-sm border border-gray-100 px-4 sm:px-6 py-3 rounded-full flex items-center gap-3 sm:gap-4 shadow-sm">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-medium text-gray-600">
                            Junte-se a <span className="font-bold text-gray-900">+12.000 usuários</span> otimizando sua saúde hoje.
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            <style jsx global>{`
                @keyframes shine {
                    100% {
                        left: 125%;
                    }
                }
                .animate-shine {
                    animation: shine 0.8s;
                }
            `}</style>
        </div>
    );
}