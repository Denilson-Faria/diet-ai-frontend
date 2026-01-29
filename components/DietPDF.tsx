import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // === PÁGINA ===
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },

  // === CAPA ===
  coverPage: {
    padding: 0,
    backgroundColor: '#111827',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContent: {
    alignItems: 'center',
    gap: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 900,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#34d399',
    textAlign: 'center',
    marginBottom: 40,
  },
  coverInfo: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    gap: 12,
  },
  coverInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(52, 211, 153, 0.2)',
    paddingBottom: 8,
    marginBottom: 8,
  },
  coverInfoLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1,
  },
  coverInfoValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 700,
  },

  // === HEADER DO DIA ===
  diaHeader: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 20,
  },
  diaTitulo: {
    fontSize: 24,
    fontWeight: 900,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  diaNumero: {
    fontSize: 12,
    color: '#34d399',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1,
  },

  // === MACROS ===
  macroContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  macroBox: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#F9FAFB',
    border: '2px solid #10b981',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 8,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 900,
    color: '#111827',
  },
  macroUnit: {
    fontSize: 8,
    color: '#6B7280',
  },

  // === REFEIÇÕES ===
  refeicaoContainer: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
    padding: 12,
  },
  refeicaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '2px solid #10b981',
  },
  refeicaoIcone: {
    width: 6,
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  refeicaoNome: {
    fontSize: 12,
    fontWeight: 900,
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refeicaoHorario: {
    fontSize: 9,
    color: '#10b981',
    fontWeight: 700,
  },
  alimentosList: {
    gap: 6,
  },
  alimentoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  alimentoBullet: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: 900,
    marginTop: 1,
  },
  alimentoTexto: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.5,
    flex: 1,
  },

  // === DICAS ===
  dicasContainer: {
    backgroundColor: '#ECFDF5',
    border: '2px solid #10b981',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  dicasTitulo: {
    fontSize: 11,
    fontWeight: 900,
    color: '#047857',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dicaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  dicaBullet: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: 900,
  },
  dicaTexto: {
    fontSize: 9,
    color: '#065F46',
    lineHeight: 1.4,
    flex: 1,
  },

  // === SEPARADOR DE DIA ===
  diaSeparador: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },

  // === FOOTER ===
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: '1px solid #E5E7EB',
  },
  footerText: {
    fontSize: 7,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontSize: 7,
    color: '#9CA3AF',
  },
});

// Logo SVG Component
const Logo = ({ size = 100 }) => (
  <Svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
    <Rect width="100" height="100" rx="20" fill="#111827" />
    <Circle cx="50" cy="50" r="32" fill="#10b981" opacity="0.2" />
    <Circle cx="50" cy="50" r="24" fill="none" stroke="#34d399" strokeWidth="3" />
    <Path
      d="M42 35 L42 50 M38 35 L38 45 M46 35 L46 45"
      stroke="#34d399"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path d="M58 35 L58 65" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M56 35 L60 35" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="50" cy="55" r="4" fill="#10b981" />
  </Svg>
);

interface DietPDFProps {
  nome: string;
  idade: number;
  objetivo: string;
  nivelAtividade: string;
  peso: number;
  altura: number;
  dias: DiaDieta[];
}

interface DiaDieta {
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

interface Refeicao {
  horario: string;
  nome: string;
  alimentos: string[];
}

export const DietPDF: React.FC<DietPDFProps> = ({
  nome,
  idade,
  objetivo,
  nivelAtividade,
  peso,
  altura,
  dias,
}) => {
  const formatObjetivo = (obj: string) => obj.replace(/_/g, ' ').toUpperCase();
  const formatNivelAtividade = (nivel: string) =>
    nivel.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Agrupar dias em páginas (3 dias por página)
  const diasPorPagina = 3;
  const paginas: DiaDieta[][] = [];
  
  for (let i = 0; i < dias.length; i += diasPorPagina) {
    paginas.push(dias.slice(i, i + diasPorPagina));
  }

  return (
    <Document>
      {/* === CAPA === */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <View style={styles.logoContainer}>
            <Logo size={120} />
          </View>

          <Text style={styles.coverTitle}>Plano Alimentar Premium</Text>
          <Text style={styles.coverSubtitle}>Personalizado por IA</Text>

          <View style={styles.coverInfo}>
            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Nome</Text>
              <Text style={styles.coverInfoValue}>{nome}</Text>
            </View>

            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Idade</Text>
              <Text style={styles.coverInfoValue}>{idade} anos</Text>
            </View>

            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Objetivo</Text>
              <Text style={styles.coverInfoValue}>{formatObjetivo(objetivo)}</Text>
            </View>

            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Nível de Atividade</Text>
              <Text style={styles.coverInfoValue}>{formatNivelAtividade(nivelAtividade)}</Text>
            </View>

            <View style={styles.coverInfoRow}>
              <Text style={styles.coverInfoLabel}>Peso / Altura</Text>
              <Text style={styles.coverInfoValue}>
                {peso}kg / {altura}cm
              </Text>
            </View>
          </View>

          <View style={{ position: 'absolute', bottom: 40 }}>
            <Text style={{ fontSize: 8, color: '#6B7280', textAlign: 'center' }}>
              Gerado em {new Date().toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </Page>

      {/* === PÁGINAS COM DIAS (3 dias por página) === */}
      {paginas.map((diasPagina, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {diasPagina.map((dia, diaIndexNaPagina) => (
            <View key={dia.numero}>
              {/* Header do Dia */}
              <View style={styles.diaHeader}>
                <Text style={styles.diaTitulo}>{dia.nome}</Text>
                <Text style={styles.diaNumero}>Dia {dia.numero}</Text>
              </View>

              {/* Macros */}
              {dia.macros && (
                <View style={styles.macroContainer}>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Calorias</Text>
                    <Text style={styles.macroValue}>{dia.macros.calorias}</Text>
                    <Text style={styles.macroUnit}>kcal</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Proteínas</Text>
                    <Text style={styles.macroValue}>{dia.macros.proteinas}</Text>
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Carboidratos</Text>
                    <Text style={styles.macroValue}>{dia.macros.carboidratos}</Text>
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Gorduras</Text>
                    <Text style={styles.macroValue}>{dia.macros.gorduras}</Text>
                    <Text style={styles.macroUnit}>g</Text>
                  </View>
                </View>
              )}

              {/* Refeições */}
              {dia.refeicoes.map((refeicao, idx) => (
                <View key={idx} style={styles.refeicaoContainer}>
                  <View style={styles.refeicaoHeader}>
                    <View style={styles.refeicaoIcone} />
                    <Text style={styles.refeicaoNome}>{refeicao.nome}</Text>
                    {refeicao.horario && (
                      <Text style={styles.refeicaoHorario}>• {refeicao.horario}</Text>
                    )}
                  </View>
                  <View style={styles.alimentosList}>
                    {refeicao.alimentos.map((alimento, i) => (
                      <View key={i} style={styles.alimentoItem}>
                        <Text style={styles.alimentoBullet}>✓</Text>
                        <Text style={styles.alimentoTexto}>{alimento}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {/* Dicas */}
              {dia.dicas && dia.dicas.length > 0 && (
                <View style={styles.dicasContainer}>
                  <Text style={styles.dicasTitulo}>💡 Dicas do Dia</Text>
                  {dia.dicas.map((dica, i) => (
                    <View key={i} style={styles.dicaItem}>
                      <Text style={styles.dicaBullet}>•</Text>
                      <Text style={styles.dicaTexto}>{dica}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Separador entre dias (exceto o último da página) */}
              {diaIndexNaPagina < diasPagina.length - 1 && (
                <View style={styles.diaSeparador} />
              )}
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Plano exclusivo para {nome} • Objetivo: {formatObjetivo(objetivo)}
            </Text>
            <Text style={styles.pageNumber}>Página {pageIndex + 2}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};