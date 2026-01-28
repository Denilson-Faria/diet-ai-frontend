"use client";
import { useState } from 'react'
import { DietForm } from "./_components/diet-form"; 
import { DietGenerator } from './_components/diet-generator'; 
import { DietData } from "@/app/types/diet-data.type"

export default function Home() {
  // Inicializamos como null explicitamente
  const [data, setData] = useState<DietData | null>(null)

  function handleSubmit(userInfo: DietData) {
    setData(userInfo)
  }

  return (
    <main>
      {!data ? (
        <DietForm onSubmit={handleSubmit} />
      ) : (
        <DietGenerator data={data} />
      )}
    </main>
  );
}
