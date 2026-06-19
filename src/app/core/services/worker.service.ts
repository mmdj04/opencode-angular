import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const COMPUTE_WORKER = new InjectionToken<Worker>('ComputeWorker');

@Injectable({ providedIn: 'root' })
export class WorkerService {
  private worker: Worker | null = null;

  get isSupported(): boolean {
    return typeof Worker !== 'undefined';
  }

  private getWorker(): Worker {
    if (!this.worker && this.isSupported) {
      this.worker = new Worker(new URL('../workers/compute.worker.ts', import.meta.url), {
        type: 'module',
      });
    }

    if (!this.worker) {
      throw new Error('Web Workers are not supported in this environment');
    }

    return this.worker;
  }

  compute<T>(data: T): Observable<T> {
    return new Observable((observer) => {
      const worker = this.getWorker();

      const handler = ({ data }: MessageEvent<T>) => {
        observer.next(data);
        observer.complete();
      };

      const errorHandler = (error: ErrorEvent) => {
        observer.error(error);
      };

      worker.addEventListener('message', handler, { once: true });
      worker.addEventListener('error', errorHandler, { once: true });
      worker.postMessage(data);

      return () => {
        worker.removeEventListener('message', handler);
        worker.removeEventListener('error', errorHandler);
      };
    });
  }

  terminate(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
