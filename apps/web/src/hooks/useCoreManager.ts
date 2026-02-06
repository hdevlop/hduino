'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  detectAdapter,
  type CoreInfo,
  type BoardInfo,
  type CoreStatus,
} from '@hduino/platform';

interface CoreManagerState {
  isLoading: boolean;
  isInstalling: boolean;
  installedCores: CoreInfo[];
  installedBoards: BoardInfo[];
  bundledCores: string[];
  error: string | null;
  cliAvailable: boolean;
  cliVersion: string | null;
}

export function useCoreManager() {
  const [state, setState] = useState<CoreManagerState>({
    isLoading: true,
    isInstalling: false,
    installedCores: [],
    installedBoards: [],
    bundledCores: [],
    error: null,
    cliAvailable: false,
    cliVersion: null,
  });

  const adapter = detectAdapter();
  const isDesktop = adapter.getPlatform() === 'tauri';

  // Load initial data
  const refresh = useCallback(async () => {
    if (!isDesktop) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Core management is only available in the desktop app',
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [cliAvailable, cliVersion, cores, boards, bundled] = await Promise.all([
        adapter.checkArduinoCli(),
        adapter.getArduinoCliVersion(),
        adapter.listInstalledCores(),
        adapter.listInstalledBoards(),
        adapter.getBundledCores(),
      ]);

      setState({
        isLoading: false,
        isInstalling: false,
        installedCores: cores,
        installedBoards: boards,
        bundledCores: bundled,
        error: null,
        cliAvailable,
        cliVersion,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load core information',
      }));
    }
  }, [adapter, isDesktop]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Check if a specific core is installed
  const checkCoreStatus = useCallback(async (boardFqbn: string): Promise<CoreStatus> => {
    if (!isDesktop) {
      return { coreId: '', installed: false, bundled: false };
    }
    return adapter.checkCoreStatus(boardFqbn);
  }, [adapter, isDesktop]);

  // Install a core
  const installCore = useCallback(async (coreId: string): Promise<boolean> => {
    if (!isDesktop) {
      setState(prev => ({
        ...prev,
        error: 'Core installation is only available in the desktop app',
      }));
      return false;
    }

    setState(prev => ({ ...prev, isInstalling: true, error: null }));

    try {
      await adapter.installCore(coreId);
      // Refresh the list after installation
      await refresh();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInstalling: false,
        error: error instanceof Error ? error.message : 'Failed to install core',
      }));
      return false;
    }
  }, [adapter, isDesktop, refresh]);

  // Search for cores
  const searchCores = useCallback(async (query: string): Promise<CoreInfo[]> => {
    if (!isDesktop) return [];
    return adapter.searchCores(query);
  }, [adapter, isDesktop]);

  // Check if a core is bundled (works offline)
  const isBundled = useCallback((coreId: string): boolean => {
    return state.bundledCores.includes(coreId);
  }, [state.bundledCores]);

  // Check if a core is installed
  const isInstalled = useCallback((coreId: string): boolean => {
    return state.installedCores.some(c => c.id === coreId);
  }, [state.installedCores]);

  return {
    ...state,
    isDesktop,
    refresh,
    checkCoreStatus,
    installCore,
    searchCores,
    isBundled,
    isInstalled,
  };
}
