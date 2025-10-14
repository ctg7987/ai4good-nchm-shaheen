import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  telemetryOptIn: boolean;
  dataSaver: boolean;
  setTelemetryOptIn: (optIn: boolean) => void;
  setDataSaver: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      telemetryOptIn: false,
      dataSaver: true,
      setTelemetryOptIn: (optIn) => set({ telemetryOptIn: optIn }),
      setDataSaver: (enabled) => set({ dataSaver: enabled }),
    }),
    {
      name: 'ncmh-settings',
    }
  )
);
