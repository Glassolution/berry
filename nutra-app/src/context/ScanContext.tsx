import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ScanResultData {
  imageUri?: string;
  name?: string;
  foodName?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
  sodium?: number;
  saturatedFat?: number;
  quantityLabel?: string;
  brand?: string;
  source?: string;
  isFood?: boolean | 'true' | 'false';
}

interface ScanContextType {
  pendingScan: ScanResultData | null;
  setPendingScan: (scan: ScanResultData | null) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider = ({ children }: { children: ReactNode }) => {
  const [pendingScan, setPendingScan] = useState<ScanResultData | null>(null);

  return (
    <ScanContext.Provider value={{ pendingScan, setPendingScan }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};
