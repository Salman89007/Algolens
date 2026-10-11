import { useState, useEffect, useCallback } from 'react';
import { wasmEngine } from '@/lib/wasm-engine';
import type { EngineStatus } from '@/lib/wasm-engine';
import type { Trace } from '@/types/trace';

export function useWasmEngine() {
  const [status, setStatus] = useState<EngineStatus>(wasmEngine.getStatus());
  const [error, setError] = useState<string | null>(wasmEngine.getErrorMessage());
  const [availableAlgorithms, setAvailableAlgorithms] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    wasmEngine
      .init()
      .then(async () => {
        if (!mounted) return;
        setStatus('ready');
        try {
          const list = await wasmEngine.listAlgorithms();
          if (mounted) setAvailableAlgorithms(list);
        } catch {
          // ignore
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setStatus('error');
        setError(err?.message || 'Failed to initialize engine');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const executeAlgorithm = useCallback(
    async (algoId: string, input: number[] | string): Promise<Trace> => {
      return wasmEngine.runAlgorithm(algoId, input);
    },
    []
  );

  return {
    status,
    isReady: status === 'ready',
    error,
    availableAlgorithms,
    executeAlgorithm,
  };
}
