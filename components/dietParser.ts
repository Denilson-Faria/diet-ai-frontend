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

  // Regex para detectar dias (Segunda, Terça, etc. ou Dia 1, Dia 2, etc.)
  const diaRegex = new RegExp(
  "##\\s*(Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|Dia\\s*\\d+)[:\\-]?\\s*(.*?)(?=##\\s*(?:Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|Dia\\s*\\d+)|$)",
  "gis"
);


  const nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  let diaMatch;
  let diaNumero = 1;

  while ((diaMatch = diaRegex.exec(markdown)) !== null) {
    const diaTexto = diaMatch[0];
    const nomeDia = diaMatch[1].trim();
    
    // Normalizar nome do dia
    let nomeFormatado = nomeDia;
    if (nomeDia.toLowerCase().includes('dia')) {
      const num = parseInt(nomeDia.match(/\d+/)?.[0] || '1');
      nomeFormatado = nomeDias[num % 7] || `Dia ${num}`;
    }

    // Extrair refeições
    const refeicoes = extractRefeicoes(diaTexto);

    // Extrair macros (se disponível)
    const macros = extractMacros(diaTexto);

    // Extrair dicas
    const dicas = extractDicas(diaTexto);

    dias.push({
      numero: diaNumero++,
      nome: nomeFormatado,
      refeicoes,
      macros,
      dicas: dicas.length > 0 ? dicas : undefined,
    });
  }

  // Se não encontrou nenhum dia com ## (formato variado), tenta outro formato
  if (dias.length === 0) {
    return parseDietFallback(markdown);
  }

  return { dias };
}

function extractRefeicoes(diaTexto: string): Refeicao[] {
  const refeicoes: Refeicao[] = [];

  // Regex para capturar refeições (### Café da Manhã, **Café da Manhã**, etc.)
const refeicaoRegex: RegExp =
  /(?:###\s*|\*\*)((?:Café da Manhã|Café da manhã|Lanche da Manhã|Lanche da manhã|Almoço|Lanche da Tarde|Lanche da tarde|Jantar|Ceia|Pré-treino|Pós-treino|Desjejum)(?:\s*\(.*?\))?)\*?\*?[:\-]?\s*([\s\S]*?)(?=(?:###|\*\*|##|$))/gi;

  let refeicaoMatch;

  while ((refeicaoMatch = refeicaoRegex.exec(diaTexto)) !== null) {
    const nomeRefeicao = refeicaoMatch[1].trim();
    const conteudo = refeicaoMatch[2];

    // Extrair horário (se disponível)
    const horarioMatch = nomeRefeicao.match(/\((\d{1,2}:\d{2}|\d{1,2}h\d{2}?)\)/);
    const horario = horarioMatch ? horarioMatch[1] : '';

    // Limpar nome da refeição
    const nomeLimpo = nomeRefeicao.replace(/\(.*?\)/g, '').trim();

    // Extrair alimentos (linhas com - ou *)
    const alimentos: string[] = [];
    const linhas = conteudo.split('\n');
    
    for (const linha of linhas) {
      const trimmed = linha.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        const alimento = trimmed.replace(/^[\-\*•]\s*/, '').trim();
        if (alimento && !alimento.toLowerCase().includes('total:')) {
          alimentos.push(alimento);
        }
      }
    }

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

function extractMacros(diaTexto: string): DiaDieta['macros'] | undefined {
  const macros = {
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
  };

  // Tentar extrair valores de macros
  const caloriasMatch = diaTexto.match(/(?:calorias?|kcal)[:\s]*(\d+)/i);
  const proteinasMatch = diaTexto.match(/proteínas?[:\s]*(\d+)\s*g/i);
  const carboidratosMatch = diaTexto.match(/carboidratos?[:\s]*(\d+)\s*g/i);
  const gordurasMatch = diaTexto.match(/gorduras?[:\s]*(\d+)\s*g/i);

  if (caloriasMatch) macros.calorias = parseInt(caloriasMatch[1]);
  if (proteinasMatch) macros.proteinas = parseInt(proteinasMatch[1]);
  if (carboidratosMatch) macros.carboidratos = parseInt(carboidratosMatch[1]);
  if (gordurasMatch) macros.gorduras = parseInt(gordurasMatch[1]);

  // Se encontrou pelo menos calorias, retorna
  if (macros.calorias > 0) {
    return macros;
  }

  return undefined;
}

function extractDicas(diaTexto: string): string[] {
  const dicas: string[] = [];

  // Procurar por seções de dicas
  const dicasMatch = diaTexto.match(/(?:dicas?|observaç[õo]es?)[:\s]*((?:[\-\*•].*\n?)+)/gi);

  if (dicasMatch) {
    for (const match of dicasMatch) {
      const linhas = match.split('\n');
      for (const linha of linhas) {
        const trimmed = linha.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          const dica = trimmed.replace(/^[\-\*•]\s*/, '').trim();
          if (dica) {
            dicas.push(dica);
          }
        }
      }
    }
  }

  return dicas;
}

// Fallback: parser mais simples caso o formato seja diferente
function parseDietFallback(markdown: string): ParsedDietData {
  const dias: DiaDieta[] = [];
  
  // Dividir por dias de forma mais genérica
  const secoes = markdown.split(/(?=Dia\s*\d+|Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo)/gi);

  const nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  secoes.forEach((secao, index) => {
    if (secao.trim().length < 50) return; // Ignora seções muito pequenas

    const refeicoes = extractRefeicoes(secao);
    if (refeicoes.length === 0) return;

    dias.push({
      numero: index + 1,
      nome: nomeDias[index % 7] || `Dia ${index + 1}`,
      refeicoes,
      macros: extractMacros(secao),
      dicas: extractDicas(secao),
    });
  });

  return { dias };
}

// Função auxiliar para calcular macros estimados se não estiverem no texto
export function estimateMacros(refeicoes: Refeicao[]): DiaDieta['macros'] {
  // Estimativa muito simplificada baseada no número de alimentos
  const totalAlimentos = refeicoes.reduce((acc, r) => acc + r.alimentos.length, 0);
  
  return {
    calorias: Math.round(totalAlimentos * 250), // ~250 kcal por alimento
    proteinas: Math.round(totalAlimentos * 20), // ~20g por alimento
    carboidratos: Math.round(totalAlimentos * 30), // ~30g por alimento
    gorduras: Math.round(totalAlimentos * 8), // ~8g por alimento
  };
}