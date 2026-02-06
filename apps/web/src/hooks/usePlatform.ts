'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  detectAdapter,
  type DeviceAdapter,
  type PlatformCapabilities,
  type SerialPort,
} from '@hduino/platform';

let cachedAdapter: DeviceAdapter | null = null;

function getAdapter(): DeviceAdapter {
  if (!cachedAdapter) {
    cachedAdapter = detectAdapter();
  }
  return cachedAdapter;
}

export function usePlatform() {
  const [adapter, setAdapter] = useState<DeviceAdapter | null>(null);
  const [capabilities, setCapabilities] = useState<PlatformCapabilities | null>(null);

  useEffect(() => {
    const detected = getAdapter();
    setAdapter(detected);
    setCapabilities(detected.getCapabilities());
  }, []);

  const exportProject = useCallback(async (name: string, content: string) => {
    if (!adapter) return;
    await adapter.exportProject(name, content);
  }, [adapter]);

  const importProject = useCallback(async () => {
    if (!adapter) return null;
    return adapter.importProject();
  }, [adapter]);

  const listPorts = useCallback(async (): Promise<SerialPort[]> => {
    if (!adapter) return [];
    return adapter.listPorts();
  }, [adapter]);

  return {
    adapter,
    capabilities,
    platform: adapter?.getPlatform() ?? 'web',
    isReady: adapter !== null,
    // Actions
    exportProject,
    importProject,
    listPorts,
  };
}
