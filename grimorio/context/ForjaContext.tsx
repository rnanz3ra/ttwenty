"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AttributeState {
  for: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export interface CharacterState {
  name: string;
  race: any;
  class: any;
  attributes: AttributeState;
  origin: any;
  devotion: any;
  skills: string[];
  level: number;
}

interface ForjaContextType {
  character: CharacterState;
  updateCharacter: (updates: Partial<CharacterState>) => void;
  calculateStats: () => { pv: number; pm: number; defense: number };
}

const ForjaContext = createContext<ForjaContextType | undefined>(undefined);

export function ForjaProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<CharacterState>({
    name: "Herói Sem Nome",
    race: null,
    class: null,
    attributes: { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 },
    origin: null,
    devotion: null,
    skills: [],
    level: 1,
  });

  const updateCharacter = (updates: Partial<CharacterState>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const calculateStats = () => {
    // Total attributes include base + race bonus
    const getAttr = (key: keyof AttributeState) => {
      const base = character.attributes[key] || 0;
      const bonus = character.race?.bonus?.[key] || 0;
      return base + bonus;
    };

    const conMod = getAttr("con");
    const dexMod = getAttr("des");
    const intMod = getAttr("int");
    const sabMod = getAttr("sab");
    const carMod = getAttr("car");
    
    let pv = 0;
    let pm = 0;
    let defense = 10 + dexMod;

    if (character.class) {
      // T20 Initial PV: Class Base + CON mod
      pv = (character.class.pv?.base || 0) + conMod;
      
      // Initial PM: Class Base PM + Main Attribute (if caster)
      // Most classes have a fixed PM, but casters add their attribute
      // Let's check for specific classes in data/classes.json
      pm = character.class.pm || 0;
      
      const className = character.class.key;
      if (className === "arcanista" || className === "mago") pm += intMod;
      else if (className === "bardo" || className === "feiticeiro") pm += carMod;
      else if (className === "clerigo" || className === "druida") pm += sabMod;
    }

    // Race specific modifications (manual overrides for complex traits)
    if (character.race?.key === "anao") pv += 3; // Example: Hardness
    if (character.race?.key === "minotauro") defense += 1; // Example: Natural Armor

    return { pv, pm, defense };
  };

  return (
    <ForjaContext.Provider value={{ character, updateCharacter, calculateStats }}>
      {children}
    </ForjaContext.Provider>
  );
}

export function useForja() {
  const context = useContext(ForjaContext);
  if (!context) {
    throw new Error("useForja must be used within a ForjaProvider");
  }
  return context;
}
