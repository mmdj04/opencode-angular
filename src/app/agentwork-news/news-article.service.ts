import { Injectable } from '@angular/core';

export interface ArticleAuthor {
  name: string;
  avatar: string;
}

export interface ArticleParagraph {
  text: string;
  isSubtitle?: boolean;
}

export interface NewsArticleDetail {
  slug: string;
  title: string;
  subtitle: string;
  source: string;
  sourceUrl: string;
  date: string;
  readTime: string;
  category: string;
  categoryLabel: string;
  author: ArticleAuthor;
  imageUrl: string;
  paragraphs: ArticleParagraph[];
  tags: string[];
}

export interface RelatedArticle {
  id: string;
  title: string;
  snippet: string;
  source: string;
  time: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class NewsArticleService {
  private readonly articles: NewsArticleDetail[] = [
    {
      slug: 'analfabetismo-no-brasil-cai-para-4-9',
      title:
        'Analfabetismo no Brasil cai para 4,9% e atinge menor taxa da série histórica, diz IBGE',
      subtitle:
        'Taxa de analfabetismo cai pela quinta edição consecutiva e atinge o menor índice desde o início da série, em 2004.',
      source: 'Folha de S.Paulo',
      sourceUrl: 'https://www.folha.uol.com.br',
      date: '19 de jun. de 2026',
      readTime: '3 min de leitura',
      category: 'brasil',
      categoryLabel: 'Brasil',
      author: {
        name: 'Folha de S.Paulo',
        avatar: '',
      },
      imageUrl: '',
      paragraphs: [
        {
          text: 'O Brasil atingiu a menor taxa de analfabetismo da série histórica do IBGE. Segundo os dados divulgados nesta quarta-feira (19) pelo Instituto Brasileiro de Geografia e Estatística, a taxa de analfabetismo caiu para 4,9% da população com 15 anos ou mais, o que representa uma queda de 0,7 ponto percentual em relação à edição anterior da Pesquisa Nacional por Amostra de Domicílios Contínua (Pnad Contínua).',
        },
        {
          text: 'Em números absolutos, o Brasil registrou aproximadamente 7,9 milhões de analfabetos, contra 9,2 milhões na pesquisa anterior. É a quinta edição consecutiva em que a taxa de analfabetismo apresenta queda, consolidando uma tendência de melhoria no indicador educacional do país.',
          isSubtitle: true,
        },
        {
          text: 'A queda do analfabetismo reflete o esforço de políticas públicas de educação e alfabetização implementadas nos últimos anos. Segundo o IBGE, a redução foi mais expressiva entre pessoas de 25 a 39 anos, faixa etária que apresentou a maior evolução no período.',
        },
        {
          text: 'Apesar do avanço, o Brasil ainda enfrenta desafios significativos. A taxa de analfabetismo entre pessoas pretas e pardas continua sendo quase o dobro da registrada entre brancos. Além disso, as regiões Norte e Nordeste ainda apresentam as maiores taxas de analfabetismo do país.',
          isSubtitle: true,
        },
        {
          text: 'A pesquisa também apontou que o tempo médio de estudo da população brasileira aumentou para 9,6 anos, o maior índice já registrado. Entre os jovens de 18 a 24 anos, a escolaridade média atingiu 11,3 anos, valor próximo ao esperado para a conclusão do ensino médio.',
        },
        {
          text: 'O secretário de Educação Básica do Ministério da Educação, Carlos Duarte, celebrou os resultados. "Esses dados confirmam que o investimento em educação básica está dando resultado. Nosso objetivo agora é acelerar ainda mais esse processo para que ninguém fique para trás", declarou.',
        },
        {
          text: 'Especialistas, porém, alertam que a redução do analfabetismo funcional — quando a pessoa não consegue usar a leitura e a escrita no dia a dia — ainda é um desafio. De acordo com o IBGE, cerca de 29 milhões de brasileiros são considerados analfabetos funcionais, ou seja, possuem menos de quatro anos de estudo.',
        },
      ],
      tags: ['Educação', 'IBGE', 'Analfabetismo', 'Brasil', 'Pnad Contínua'],
    },
    {
      slug: 'copa-do-mundo-2026-semifinais',
      title: 'Copa do Mundo 2026: Semifinais definidas após quartas de finais eletrizantes',
      subtitle:
        'Quatro seleções se classificam para a semifinal da Copa do Mundo 2026 nos Estados Unidos, México e Canadá.',
      source: 'ESPN Brasil',
      sourceUrl: 'https://www.espn.com.br',
      date: '19 de jun. de 2026',
      readTime: '4 min de leitura',
      category: 'esportes',
      categoryLabel: 'Esportes',
      author: {
        name: 'ESPN Brasil',
        avatar: '',
      },
      imageUrl: '',
      paragraphs: [
        {
          text: 'A Copa do Mundo 2026, sediada conjuntamente por Estados Unidos, México e Canadá, entra na reta final com semifinais eletrizantes prometidas. As quartas de finais entregaram tudo o que o torneio prometia, com goleadas, viradas históricas e eliminações surpreendentes.',
        },
        {
          text: 'O Brasil confirmou sua campanha sólida ao derrotar a França por 3 a 1 em partida disputada no MetLife Stadium, em Nova Jersey. Vinícius Júnior abriu o placar aos 12 minutos do primeiro tempo, e Rodrygo ampliou aos 34. França descontou com Mbappé no início do segundo tempo, mas Endrick fechou o placar nos acréscimos.',
          isSubtitle: true,
        },
        {
          text: 'Na outra semifinal do lado brasileiro, a Argentina superou a Inglaterra por 2 a 0, com gols de Julián Álvarez e Enzo Fernández. A equipe de Lionel Scaloni mostrou solidez defensiva e eficácia no ataque, mantendo a busca pelo bicampeonato consecutivo.',
        },
      ],
      tags: ['Copa do Mundo', 'Futebol', 'Semifinal', '2026'],
    },
    {
      slug: 'mercados-financeiros-alta-juros',
      title: 'Mercados financeiros reagem positivamente à estabilidade nas taxas de juros',
      subtitle:
        'Ibovespa atinge nova máxima histórica e dólar cai abaixo de R$ 5,20 após sinalizações do Banco Central.',
      source: 'Bloomberg Línea',
      sourceUrl: 'https://www.bloomberglinea.com.br',
      date: '19 de jun. de 2026',
      readTime: '3 min de leitura',
      category: 'economia',
      categoryLabel: 'Economia',
      author: {
        name: 'Bloomberg Línea',
        avatar: '',
      },
      imageUrl: '',
      paragraphs: [
        {
          text: 'Os mercados financeiros brasileiros registraram alta significativa nesta quarta-feira, após o Banco Central sinalizar manutenção da taxa Selic no patamar atual. O Ibovespa atingiu nova máxima histórica, fechando acima de 145 mil pontos, enquanto o dólar recuou para R$ 5,18.',
        },
        {
          text: 'A decisão do Copom de manter a taxa de juros em 10,75% a.a. foi recebida com otimismo pelos investidores, que enxergam na estabilidade um sinal de confiança na economia brasileira. Segundo analistas, a postura do banco central reforça o cenário de crescimento econômico moderado com inflação sob controle.',
          isSubtitle: true,
        },
      ],
      tags: ['Economia', 'Bolsa', 'Dólar', 'Juros', 'Banco Central'],
    },
  ];

  private readonly relatedArticles: RelatedArticle[] = [
    {
      id: 'r1',
      title: 'IBGE: Tempo médio de estudo atinge recorde no Brasil',
      snippet: 'População brasileira estuda em média 9,6 anos, maior índice da história.',
      source: 'G1',
      time: '5h atrás',
      category: 'brasil',
    },
    {
      id: 'r2',
      title: 'Educação infantil: Brasil amplia vagas em creches públicas',
      snippet: 'Governo federal anuncia investimento de R$ 8 bilhões em infraestrutura escolar.',
      source: 'UOL',
      time: '6h atrás',
      category: 'brasil',
    },
    {
      id: 'r3',
      title: 'Alfabetização digital: novos programas visam reduzir exclusão',
      snippet:
        'Iniciativa pública e privada busca levar internet e capacitação a comunidades rurais.',
      source: 'Estadão',
      time: '8h atrás',
      category: 'tecnologia',
    },
    {
      id: 'r4',
      title: 'Semifinais da Copa 2026: onde assistir e horários',
      snippet: 'Confira a programação completa das semifinais do Mundial.',
      source: 'ge',
      time: '2h atrás',
      category: 'esportes',
    },
    {
      id: 'r5',
      title: 'Mercado de trabalho: taxa de informalidade cai no 1º trimestre',
      snippet: 'Formalização atinge maior nível em 10 anos segundo dados do IBGE.',
      source: 'Exame',
      time: '7h atrás',
      category: 'economia',
    },
    {
      id: 'r6',
      title: 'Saúde mental: SUS amplia atendimento psicológico em UBS',
      snippet: 'Novas equipes serão lotadas em unidades básicas de saúde de todo o país.',
      source: 'CNN Brasil',
      time: '9h atrás',
      category: 'saude',
    },
  ];

  getArticle(slug: string): NewsArticleDetail | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  getAllSlugs(): string[] {
    return this.articles.map((a) => a.slug);
  }

  getRelatedArticles(): RelatedArticle[] {
    return this.relatedArticles;
  }

  getMoreFromSource(): RelatedArticle[] {
    return this.relatedArticles.filter((a) => a.category === 'brasil' || a.category === 'economia');
  }
}
