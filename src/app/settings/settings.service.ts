import { Injectable, signal } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly agentName = signal('');
  readonly apiKey = signal('');

  constructor() {
    this.load();
  }

  save(): void {
    localStorage.setItem('agentwork_agent_name', this.agentName());
    localStorage.setItem('agentwork_api_key', this.apiKey());
    toast.success('Settings saved successfully');
  }

  private load(): void {
    this.agentName.set(localStorage.getItem('agentwork_agent_name') ?? '');
    this.apiKey.set(localStorage.getItem('agentwork_api_key') ?? '');
  }
}
