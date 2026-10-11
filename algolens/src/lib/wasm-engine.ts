import type { Trace } from '@/types/trace';

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'error';

interface EmscriptenModule {
  ccall: (
    ident: string,
    returnType: string,
    argTypes: string[],
    args: any[]
  ) => any;
  cwrap: (
    ident: string,
    returnType: string,
    argTypes: string[]
  ) => (...args: any[]) => any;
}

declare global {
  interface Window {
    createAlgoEngine?: (opts?: any) => Promise<EmscriptenModule>;
  }
}

class WasmEngineService {
  private module: EmscriptenModule | null = null;
  private loadPromise: Promise<EmscriptenModule> | null = null;
  private status: EngineStatus = 'idle';
  private errorMessage: string | null = null;

  public getStatus(): EngineStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public isReady(): boolean {
    return this.status === 'ready' && this.module !== null;
  }

  private async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already injected
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript && window.createAlgoEngine) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load engine script from ${src}`));
      document.head.appendChild(script);
    });
  }

  public async init(): Promise<EmscriptenModule> {
    if (this.module) {
      return this.module;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.status = 'loading';
    this.loadPromise = (async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const scriptUrl = `${cleanBase}wasm/engine.js`;

        if (!window.createAlgoEngine) {
          await this.loadScript(scriptUrl);
        }

        if (typeof window.createAlgoEngine !== 'function') {
          throw new Error('createAlgoEngine function is not defined after script load');
        }

        const wasmModule = await window.createAlgoEngine({
          locateFile: (file: string) => {
            return `${cleanBase}wasm/${file}`;
          },
        });

        this.module = wasmModule;
        this.status = 'ready';
        this.errorMessage = null;
        return wasmModule;
      } catch (err: any) {
        this.status = 'error';
        this.errorMessage = err?.message || 'Failed to initialize WebAssembly engine';
        console.error('[AlgoLens WASM Engine Error]:', err);
        throw err;
      }
    })();

    return this.loadPromise;
  }

  public async runAlgorithm(algoId: string, input: number[] | string): Promise<Trace> {
    const mod = await this.init();
    const inputJson = typeof input === 'string' ? input : JSON.stringify(input);

    try {
      const resultJson = mod.ccall(
        'run_algorithm',
        'string',
        ['string', 'string'],
        [algoId, inputJson]
      );

      const parsed: Trace = JSON.parse(resultJson);
      return parsed;
    } catch (err: any) {
      console.error(`[AlgoLens WASM] Error executing ${algoId}:`, err);
      throw new Error(`Failed to run algorithm ${algoId}: ${err?.message || err}`);
    }
  }

  public async listAlgorithms(): Promise<string[]> {
    const mod = await this.init();
    try {
      const resultJson = mod.ccall('list_algorithms', 'string', [], []);
      return JSON.parse(resultJson);
    } catch (err: any) {
      console.error('[AlgoLens WASM] Error listing algorithms:', err);
      return ['bubble-sort', 'merge-sort', 'quick-sort'];
    }
  }
}

export const wasmEngine = new WasmEngineService();
