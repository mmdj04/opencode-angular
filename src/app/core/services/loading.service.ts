import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly loading = signal(false);
  private pendingRequests = 0;

  show(): void {
    this.pendingRequests++;
    this.loading.set(true);
  }

  hide(): void {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.pendingRequests = 0;
      this.loading.set(false);
    }
  }
}
