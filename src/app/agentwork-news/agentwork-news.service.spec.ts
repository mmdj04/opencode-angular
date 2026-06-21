import { TestBed } from '@angular/core/testing';
import { AgentworkNewsService } from './agentwork-news.service';

describe('AgentworkNewsService', () => {
  let service: AgentworkNewsService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentworkNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have tabs', () => {
    expect(service.tabs.length).toBe(2);
  });

  it('should have tabs with required fields', () => {
    service.tabs.forEach((tab) => {
      expect(tab.id).toBeTruthy();
      expect(tab.label).toBeTruthy();
    });
  });
});
