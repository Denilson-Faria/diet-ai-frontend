export interface DietData {
  nome: string;
  idade: number;
  altura_cm: number;
  peso_kg: number;
  sexo: "masculino" | "feminino";
  nivel_atividade: "sedentario" | "2x semana" | "3x semana" | "intenso";
  objetivo: "perder_peso" | "hipertrofia" | "manter_peso";
}