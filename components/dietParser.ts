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

  // Dividir por "Dia X" (com ou sem ## ou **Dia**)
  const diaRegex = /(?:^|\n)(?:##\s*)?(?:\*\*)?Dia\s*(\d+)(?:\*\*)?[:\s]*/gi;
  const parts = markdown.split(diaRegex);

  // parts[0] = conteúdo antes do primeiro dia
  // parts[1] = número do dia 1, parts[2] = conteúdo do dia 1
  // parts[3] = número do dia 2, parts[4] = conteúdo do dia 2, etc.

  for (let i = 1; i < parts.length; i += 2) {
    const diaNumero = parseInt(parts[i]);
    const diaConteudo = parts[i + 1] || '';

    if (!diaConteudo.trim()) continue;

    const refeicoes = extractRefeicoes(diaConteudo);
    const macros = extractMacros(diaConteudo);
    const dicas = extractDicas(diaConteudo);

    const nomeDias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const nomeDia = nomeDias[diaNumero % 7] || `Dia ${diaNumero}`;

    dias.push({
      numero: diaNumero,
      nome: nomeDia,
      refeicoes,
      macros,
      dicas: dicas.length > 0 ? dicas : undefined,
    });
  }

  // Se não encontrou dias com "Dia X", tenta formato alternativo
  if (dias.length === 0) {
    return parseDietAlternative(markdown);
  }

  return { dias };
}

function extractRefeicoes(diaTexto: string): Refeicao[] {
  const refeicoes: Refeicao[] = [];

  // Regex para capturar refeições com ✓ ou checkmark
  // Exemplos: "✓ Café da Manhã:", "✓ Almoço:", "✓ Jantar:", "✓ Lanche:"
  const refeicaoRegex = /[✓✔☑]\s*([^:]+):\s*([^\n✓✔☑]+(?:\n(?![✓✔☑])[^\n]+)*)/gi;

  let match;
  while ((match = refeicaoRegex.exec(diaTexto)) !== null) {
    const nomeCompleto = match[1].trim();
    const conteudo = match[2].trim();

    // Extrair horário do nome (ex: "Café da Manhã (7h)" ou "Almoço (12h)")
    const horarioMatch = nomeCompleto.match(/\((\d{1,2}h\d{0,2}|\d{1,2}:\d{2})\)/);
    const horario = horarioMatch ? horarioMatch[1] : '';
    const nomeLimpo = nomeCompleto.replace(/\(.*?\)/g, '').trim();

    // O conteúdo é o texto direto (sem bullets)
    // Exemplo: "Omelete de 3 ovos com espinafre e tomate, 1 fatia de pão integral."
    const alimentos: string[] = [];
    
    // Dividir por vírgula ou ponto e vírgula, ou quebras de linha
    const itens = conteudo
      .split(/[,;]|\n/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    alimentos.push(...itens);

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
  const dicasMatch = diaTexto.match(/(?:dicas?|observaç[õo]es?)[:\s]*((?:[\-\*•✓].*\n?)+)/gi);

  if (dicasMatch) {
    for (const match of dicasMatch) {
      const linhas = match.split('\n');
      for (const linha of linhas) {
        const trimmed = linha.trim();
        if (trimmed.match(/^[\-\*•✓]/)) {
          const dica = trimmed.replace(/^[\-\*•✓]\s*/, '').trim();
          if (dica) {
            dicas.push(dica);
          }
        }
      }
    }
  }

  return dicas;
}

// Parser alternativo para formatos diferentes
function parseDietAlternative(markdown: string): ParsedDietData {
  const dias: DiaDieta[] = [];

  // Tentar detectar dias por dia da semana
  const nomeDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const diaRegex = new RegExp(
    `(?:^|\\n)(?:##\\s*)?(?:\\*\\*)?(${nomeDias.join('|')})[\\-\\s]*(?:feira)?(?:\\*\\*)?[:\\s]*`,
    'gi'
  );

  const parts = markdown.split(diaRegex);

  for (let i = 1; i < parts.length; i += 2) {
    const nomeDia = parts[i].trim();
    const diaConteudo = parts[i + 1] || '';

    if (!diaConteudo.trim()) continue;

    const refeicoes = extractRefeicoes(diaConteudo);
    if (refeicoes.length === 0) continue;

    dias.push({
      numero: Math.floor(i / 2) + 1,
      nome: nomeDia,
      refeicoes,
      macros: extractMacros(diaConteudo),
      dicas: extractDicas(diaConteudo),
    });
  }

  return { dias };
}

// Função auxiliar para calcular macros estimados se não estiverem no texto
export function estimateMacros(refeicoes: Refeicao[]): DiaDieta['macros'] {
  // Estimativa baseada no número de alimentos
  const totalAlimentos = refeicoes.reduce((acc, r) => acc + r.alimentos.length, 0);

  return {
    calorias: Math.round(totalAlimentos * 250), // ~250 kcal por alimento
    proteinas: Math.round(totalAlimentos * 20), // ~20g por alimento
    carboidratos: Math.round(totalAlimentos * 30), // ~30g por alimento
    gorduras: Math.round(totalAlimentos * 8), // ~8g por alimento
  };
}