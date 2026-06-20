import { Injectable } from '@angular/core';

export interface QuickLink {
  name: string;
  url: string;
  icon: string;
}

export interface NewsTab {
  id: string;
  label: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
  imageUrl: string;
}

@Injectable({ providedIn: 'root' })
export class MsnService {
  readonly quickLinks: QuickLink[] = [
    {
      name: 'Outlook',
      url: 'https://outlook.live.com',
      icon: 'M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h4v2H7V9zm6 0h4v2h-4V9zm-6 3h4v2H7v-2zm6 0h4v2h-4v-2z',
    },
    {
      name: 'Booking',
      url: 'https://www.booking.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'Walmart',
      url: 'https://www.walmart.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'eBay',
      url: 'https://www.ebay.com',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com',
      icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
      icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z',
    },
  ];

  readonly tabs: NewsTab[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'news', label: 'News' },
    { id: 'worldcup', label: 'World Cup' },
    { id: 'money', label: 'Money' },
    { id: 'sports', label: 'Sports' },
    { id: 'entertainment', label: 'Entertainment' },
  ];

  readonly articles: NewsArticle[] = [
    {
      id: '1',
      slug: 'analfabetismo-no-brasil-cai-para-4-9',
      title:
        'Analfabetismo no Brasil cai para 4,9% e atinge menor taxa da série histórica, diz IBGE',
      snippet:
        'Taxa de analfabetismo cai pela quinta edição consecutiva e atinge o menor índice desde o início da série, em 2004.',
      source: 'Folha de S.Paulo',
      time: '2h ago',
      category: 'discover',
      imageUrl: '',
    },
    {
      id: '2',
      slug: 'copa-do-mundo-2026-semifinais',
      title: 'Copa do Mundo 2026: Semifinal Matchups Set After Dramatic Quarterfinals',
      snippet:
        'The quarterfinals delivered stunning upsets and thrilling performances as four nations advance to the next round.',
      source: 'ESPN',
      time: '3h ago',
      category: 'worldcup',
      imageUrl: '',
    },
    {
      id: '3',
      slug: 'mercados-financeiros-alta-juros',
      title: 'Stock Markets Rally as Federal Reserve Signals Rate Stability',
      snippet:
        "Major indices reached new highs following the Federal Reserve's indication that interest rates will remain steady through 2026.",
      source: 'Bloomberg',
      time: '4h ago',
      category: 'money',
      imageUrl: '',
    },
    {
      id: '4',
      slug: 'champions-league-final',
      title: 'Champions League Final: Real Madrid vs Manchester City Preview',
      snippet:
        'The stage is set for an epic clash between European giants as both teams prepare for the biggest match of the season.',
      source: 'BBC Sport',
      time: '5h ago',
      category: 'sports',
      imageUrl: '',
    },
    {
      id: '5',
      slug: 'dieta-mediterranea-beneficios',
      title: 'New Study Reveals Surprising Benefits of Mediterranean Diet',
      snippet:
        'Researchers found that following a Mediterranean diet can reduce the risk of chronic diseases by up to 30 percent.',
      source: 'WebMD',
      time: '6h ago',
      category: 'discover',
      imageUrl: '',
    },
    {
      id: '6',
      slug: 'hollywood-blockbuster-recordes',
      title: 'Hollywood Blockbuster Breaks Opening Weekend Records',
      snippet:
        'The highly anticipated sequel earned over $500 million globally in its first three days, surpassing all expectations.',
      source: 'Variety',
      time: '7h ago',
      category: 'entertainment',
      imageUrl: '',
    },
    {
      id: '7',
      slug: 'cumbre-climatica-acordo',
      title: 'Climate Summit Reaches Historic Agreement on Carbon Emissions',
      snippet:
        'World leaders committed to reducing carbon emissions by 50% before 2030 in a landmark deal signed today.',
      source: 'Reuters',
      time: '8h ago',
      category: 'news',
      imageUrl: '',
    },
    {
      id: '8',
      slug: 'spex-mars-missao',
      title: 'SpaceX Successfully Launches Mars Mission Prototype',
      snippet:
        'The successful test flight brings humanity one step closer to establishing a permanent presence on the Red Planet.',
      source: 'Space.com',
      time: '9h ago',
      category: 'discover',
      imageUrl: '',
    },
    {
      id: '9',
      slug: 'olimpicos-novos-esportes',
      title: 'Olympic Committee Announces New Sports for 2028 Games',
      snippet:
        'Breaking, squash, and flag football will join the Olympic program as the committee seeks to attract younger audiences.',
      source: 'Olympics.com',
      time: '10h ago',
      category: 'sports',
      imageUrl: '',
    },
    {
      id: '10',
      slug: 'veiculos-eletricos-recordes',
      title: 'Electric Vehicle Sales Surpass Gas Cars for First Time',
      snippet:
        'A milestone moment for the automotive industry as electric vehicles outsold traditional combustion engine cars globally.',
      source: 'The Verge',
      time: '11h ago',
      category: 'money',
      imageUrl: '',
    },
    {
      id: '11',
      slug: 'nova-plataforma-streaming',
      title: 'New Streaming Platform Launches with Exclusive Content',
      snippet:
        'The new service offers original series and films from award-winning directors at a competitive monthly price.',
      source: 'Deadline',
      time: '12h ago',
      category: 'entertainment',
      imageUrl: '',
    },
    {
      id: '12',
      slug: 'nova-especie-oceano',
      title: 'Scientists Discover New Species in Deep Ocean Expedition',
      snippet:
        'Marine biologists found three previously unknown species living near hydrothermal vents at record depths.',
      source: 'National Geographic',
      time: '13h ago',
      category: 'discover',
      imageUrl: '',
    },
  ];

  getArticlesByCategory(category: string): NewsArticle[] {
    if (category === 'discover') {
      return this.articles;
    }

    return this.articles.filter((a) => a.category === category);
  }
}
