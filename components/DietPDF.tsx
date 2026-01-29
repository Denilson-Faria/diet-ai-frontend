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
  Font,
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

  // === HEADER ===
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: '3px solid #10b981',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniLogo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: '#111827',
  },
  headerDay: {
    fontSize: 10,
    color: '#10b981',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1,
  },

  // === SEÇÕES ===
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: '#111827',
    marginBottom: 8,
    paddingLeft: 12,
    borderLeft: '4px solid #10b981',
  },
  
  // === REFEIÇÕES ===
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealCard: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    padding: 10,
    width: '48%',
    marginBottom: 6,
  },
  mealTime: {
    fontSize: 9,
    fontWeight: 700,
    color: '#10b981',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  mealItem: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 2,
    lineHeight: 1.4,
  },

  // === MACROS ===
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 7,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 900,
    color: '#34d399',
  },
  macroUnit: {
    fontSize: 7,
    color: '#34d399',
  },

  // === DICAS ===
  tipsBox: {
    backgroundColor: '#ECFDF5',
    border: '2px solid #10b981',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#047857',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 8,
    color: '#065F46',
    lineHeight: 1.5,
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

      {/* === PÁGINAS DOS DIAS === */}
      {dias.map((dia, index) => (
        <Page key={dia.numero} size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.miniLogo}>
                <Logo size={40} />
              </View>
              <View>
                <Text style={styles.headerTitle}>{dia.nome}</Text>
                <Text style={styles.headerDay}>Dia {dia.numero}</Text>
              </View>
            </View>
          </View>

          {/* Macros (se disponível) */}
          {dia.macros && (
            <View style={styles.macroRow}>
              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Calorias</Text>
                <Text style={styles.macroValue}>{dia.macros.calorias}</Text>
                <Text style={styles.macroUnit}>kcal</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Proteínas</Text>
                <Text style={styles.macroValue}>{dia.macros.proteinas}</Text>
                <Text style={styles.macroUnit}>g</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Carboidratos</Text>
                <Text style={styles.macroValue}>{dia.macros.carboidratos}</Text>
                <Text style={styles.macroUnit}>g</Text>
              </View>
              <View style={styles.macroCard}>
                <Text style={styles.macroLabel}>Gorduras</Text>
                <Text style={styles.macroValue}>{dia.macros.gorduras}</Text>
                <Text style={styles.macroUnit}>g</Text>
              </View>
            </View>
          )}

          {/* Refeições */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Refeições do Dia</Text>
            <View style={styles.mealGrid}>
              {dia.refeicoes.map((refeicao, idx) => (
                <View key={idx} style={styles.mealCard}>
                  <Text style={styles.mealTime}>
                    {refeicao.horario} • {refeicao.nome}
                  </Text>
                  {refeicao.alimentos.map((alimento, i) => (
                    <Text key={i} style={styles.mealItem}>
                      • {alimento}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Dicas (se disponível) */}
          {dia.dicas && dia.dicas.length > 0 && (
            <View style={styles.tipsBox}>
              <Text style={styles.tipTitle}>💡 Dicas do Dia</Text>
              {dia.dicas.map((dica, i) => (
                <Text key={i} style={styles.tipText}>
                  • {dica}
                </Text>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Plano exclusivo para {nome} • Objetivo: {formatObjetivo(objetivo)}
            </Text>
            <Text style={styles.pageNumber}>Página {index + 2}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};