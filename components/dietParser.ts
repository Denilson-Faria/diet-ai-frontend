// Função para extrair dados estruturados do markdown gerado pela IA
export interface ParsedDietData {
  dias: DiaDieta[];
}

export interface DiaDieta {
  numero: number;
  nome: string;
  refeicoes: Refeicao[];
  macros?: {
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
  dicas?: string[];
}

export interface Refeicao {
  horario: string;
  nome: string;
  alimentos: string[];
}

export function parseDietMarkdown(markdown: string): ParsedDietData {
  const dias: DiaDieta[] = [];
  
  // Dividir por "Dia X"
  const diaRegex = /Dia\s+(\d+)/gi;
  const parts = markdown.split(diaRegex);
  
  // parts[0] = conteúdo antes do primeiro dia (título)
  // parts[1] = número do dia 1, parts[2] = conteúdo do dia 1
  // parts[3] = número do dia 2, parts[4] = conteúdo do dia 2, etc.
  
  for (let i = 1; i < parts.length; i += 2) {
    const diaNumero = parseInt(parts[i]);
    const diaConteudo = parts[i + 1] || '';
    
    if (!diaConteudo.trim()) continue;
    
    const refeicoes = extractRefeicoes(diaConteudo);
    
    if (refeicoes.length === 0) continue;
    
    const nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const nomeDia = nomeDias[diaNumero % 7] || `Dia ${diaNumero}`;
    
    dias.push({
      numero: diaNumero,
      nome: nomeDia,
      refeicoes,
    });
  }
  
  return { dias };
}

function extractRefeicoes(diaTexto: string): Refeicao[] {
  const refeicoes: Refeicao[] = [];
  
  // Regex para capturar: * ✓Café da Manhã: texto
  // Captura tudo após o ✓ até encontrar outro * ✓ ou fim do texto
  const refeicaoRegex = /\*\s*✓([^:]+):\s*([^\n*]+)/gi;
  
  let match;
  while ((match = refeicaoRegex.exec(diaTexto)) !== null) {
    const nomeCompleto = match[1].trim();
    const conteudo = match[2].trim();
    
    // Extrair horário (se existir)
    const horarioMatch = nomeCompleto.match(/\((\d{1,2}h\d{0,2}|\d{1,2}:\d{2})\)/);
    const horario = horarioMatch ? horarioMatch[1] : '';
    const nomeLimpo = nomeCompleto.replace(/\(.*?\)/g, '').trim();
    
    // Dividir alimentos por vírgula ou "e"
    const alimentos = conteudo
      .split(/,|\se\s/)
      .map(item => item.trim())
      .filter(item => item.length > 0 && item !== '.');
    
    if (alimentos.length > 0) {
      refeicoes.push({
        horario,
        nome: nomeLimpo,
        alimentos,
      });
    }
  }
  
  return refeicoes;
}

// Função auxiliar para calcular macros estimados
export function estimateMacros(refeicoes: Refeicao[]): DiaDieta['macros'] {
  const totalAlimentos = refeicoes.reduce((acc, r) => acc + r.alimentos.length, 0);
  
  return {
    calorias: Math.round(totalAlimentos * 200), // ~200 kcal por alimento
    proteinas: Math.round(totalAlimentos * 18), // ~18g por alimento
    carboidratos: Math.round(totalAlimentos * 25), // ~25g por alimento
    gorduras: Math.round(totalAlimentos * 7), // ~7g por alimento
  };
}