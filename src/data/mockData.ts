import type {
  ChatMessage,
  ConversationHistoryGroup,
  DataSourceDef,
  ResultRow,
} from '@/types';

export const suggestionCards = [
  { title: "Évolution de la mortalité cardiovasculaire en France", icon: 'HeartPulse' },
  { title: "Compare l'espérance de vie en Europe", icon: 'Activity' },
  { title: "Top 5 des pays producteurs de blé", icon: 'Wheat' },
  { title: "Évolution de la production de lait depuis 2000", icon: 'Milk' },
  { title: "Tendances sur les dix dernières années", icon: 'LineChart' },
  { title: "Quels pays ont les valeurs les plus élevées ?", icon: 'Award' },
];

function genId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createMessage(
  role: 'user' | 'assistant',
  content: string,
): ChatMessage {
  return {
    id: genId(),
    role,
    content,
    error: null,
    loading: false,
  };
}

export function createLoadingMessage(): ChatMessage {
  return {
    id: genId(),
    role: 'assistant',
    content: '',
    loading: true,
    loadingStep: 0,
    error: null,
  };
}

const loadingSteps = [
  "Analyse de la question…",
  "Génération de la requête…",
  "Exécution…",
];
export { loadingSteps };

const followUpMap: Record<string, string[]> = {
  cardio: [
    "Compare avec les autres pays européens",
    "Quelle est la tendance chez les femmes ?",
    "Affiche les données par tranche d'âge",
  ],
  life: [
    "Quels pays ont la meilleure espérance de vie ?",
    "Compare homme vs femme",
    "Évolution depuis 2000",
  ],
  wheat: [
    "Compare avec la production de maïs",
    "Quels sont les rendements par hectare ?",
    "Évolution depuis 2010",
  ],
  milk: [
    "Compare avec la production de fromage",
    "Quels sont les plus grands exportateurs ?",
    "Tendance par région",
  ],
  trend: [
    "Affiche un graphique comparatif",
    "Quels indicateurs sont corrélés ?",
    "Zoom sur 2020-2023",
  ],
  top: [
    "Affiche le classement complet",
    "Compare avec l'année précédente",
    "Quels sont les facteurs explicatifs ?",
  ],
  default: [
    "Affiche un graphique",
    "Filtre par année",
    "Quelles sont les tendances ?",
  ],
};

function getFollowUps(key: string): string[] {
  return followUpMap[key] || followUpMap.default;
}

const outOfScopeKeywords = [
  'météo', 'recette', 'cuisine', 'film', 'musique', 'blague', 'sport',
  'jeu', 'voyage', 'restaurant', 'shopping', 'code', 'programmation',
  'python', 'javascript', 'histoire de france', 'poème', 'rédige',
  'traduis', 'email',
];

export function generateAssistantResponse(question: string): ChatMessage {
  const lower = question.toLowerCase();

  // Out of scope
  if (outOfScopeKeywords.some((kw) => lower.includes(kw))) {
    return {
      id: genId(),
      role: 'assistant',
      content: '',
      error: 'out_of_scope',
      loading: false,
      loadingStep: 3,
    };
  }

  if (lower.includes('cardiovasculaire') || lower.includes('cardio')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici l'évolution de la mortalité cardiovasculaire en France (2014–2023).",
      explanation: "Les données de la table `oms_sante_europe` montrent une baisse régulière du taux de mortalité cardiovasculaire, avec une légère remontée en 2020. La France reste parmi les pays européens les mieux classés.",
      sql: `SELECT\n  annee,\n  taux_mortalite_cardio,\n  nombre_deces\nFROM oms_sante_europe\nWHERE pays = 'France'\n  AND annee BETWEEN 2014 AND 2023\nORDER BY annee ASC;`,
      columns: ['annee', 'taux_mortalite_cardio', 'nombre_deces'],
      results: [
        { annee: 2014, taux_mortalite_cardio: 142.3, nombre_deces: 142500 },
        { annee: 2015, taux_mortalite_cardio: 138.7, nombre_deces: 139800 },
        { annee: 2016, taux_mortalite_cardio: 135.2, nombre_deces: 136200 },
        { annee: 2017, taux_mortalite_cardio: 132.5, nombre_deces: 133400 },
        { annee: 2018, taux_mortalite_cardio: 129.8, nombre_deces: 130900 },
        { annee: 2019, taux_mortalite_cardio: 126.4, nombre_deces: 127500 },
        { annee: 2020, taux_mortalite_cardio: 131.2, nombre_deces: 132800 },
        { annee: 2021, taux_mortalite_cardio: 127.6, nombre_deces: 128700 },
        { annee: 2022, taux_mortalite_cardio: 124.9, nombre_deces: 125900 },
        { annee: 2023, taux_mortalite_cardio: 122.1, nombre_deces: 123200 },
      ],
      chartType: 'line',
      error: null, executionTime: 0.42, loading: false,
      followUps: getFollowUps('cardio'),
    };
  }

  if (lower.includes('espérance') || lower.includes('esperance') || lower.includes('vie')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici une comparaison de l'espérance de vie dans plusieurs pays européens (2023).",
      explanation: "L'espérance de vie à la naissance varie de 77,8 ans en Bulgarie à 83,8 ans en Espagne. La France se situe dans le haut du classement avec 82,5 ans.",
      sql: `SELECT\n  pays,\n  esperance_vie_h,\n  esperance_vie_f,\n  esperance_vie_moy\nFROM oms_sante_europe\nWHERE annee = 2023\n  AND pays IN ('France','Espagne','Italie','Allemagne','Pologne','Bulgarie','Suède','Portugal')\nORDER BY esperance_vie_moy DESC;`,
      columns: ['pays', 'esperance_vie_h', 'esperance_vie_f', 'esperance_vie_moy'],
      results: [
        { pays: 'Espagne', esperance_vie_h: 81.0, esperance_vie_f: 86.6, esperance_vie_moy: 83.8 },
        { pays: 'Italie', esperance_vie_h: 80.5, esperance_vie_f: 85.1, esperance_vie_moy: 82.8 },
        { pays: 'France', esperance_vie_h: 79.8, esperance_vie_f: 85.3, esperance_vie_moy: 82.5 },
        { pays: 'Suède', esperance_vie_h: 80.8, esperance_vie_f: 84.0, esperance_vie_moy: 82.4 },
        { pays: 'Allemagne', esperance_vie_h: 78.7, esperance_vie_f: 83.4, esperance_vie_moy: 81.0 },
        { pays: 'Portugal', esperance_vie_h: 78.0, esperance_vie_f: 83.6, esperance_vie_moy: 80.8 },
        { pays: 'Pologne', esperance_vie_h: 74.1, esperance_vie_f: 81.7, esperance_vie_moy: 77.9 },
        { pays: 'Bulgarie', esperance_vie_h: 74.2, esperance_vie_f: 81.4, esperance_vie_moy: 77.8 },
      ],
      chartType: 'bar',
      error: null, executionTime: 0.35, loading: false,
      followUps: getFollowUps('life'),
    };
  }

  if (lower.includes('blé') || lower.includes('ble') || lower.includes('froment')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici les 5 plus grands pays producteurs de blé (2023).",
      explanation: "La France domine la production de blé en Europe avec 35,5 millions de tonnes, suivie de l'Allemagne et de la Pologne. Ces données proviennent de la table `faostat_production`.",
      sql: `SELECT\n  pays,\n  production_tonnes,\n  rendement_ha,\n  superficie_ha\nFROM faostat_production\nWHERE produit = 'Blé'\n  AND annee = 2023\nORDER BY production_tonnes DESC\nLIMIT 5;`,
      columns: ['pays', 'production_tonnes', 'rendement_ha', 'superficie_ha'],
      results: [
        { pays: 'France', production_tonnes: 35500, rendement_ha: 7.2, superficie_ha: 4930 },
        { pays: 'Allemagne', production_tonnes: 21800, rendement_ha: 6.9, superficie_ha: 3160 },
        { pays: 'Pologne', production_tonnes: 13200, rendement_ha: 4.8, superficie_ha: 2750 },
        { pays: 'Royaume-Uni', production_tonnes: 14100, rendement_ha: 7.0, superficie_ha: 2010 },
        { pays: 'Italie', production_tonnes: 7800, rendement_ha: 5.5, superficie_ha: 1420 },
      ],
      chartType: 'bar',
      error: null, executionTime: 0.38, loading: false,
      followUps: getFollowUps('wheat'),
    };
  }

  if (lower.includes('lait')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici l'évolution de la production de lait en Europe depuis 2000.",
      explanation: "La production laitière européenne a connu une croissance régulière de 2000 à 2023, passant de 149 à 162 millions de tonnes. On note une stagnation depuis 2020 liée aux quotas et à la transition écologique.",
      sql: `SELECT\n  annee,\n  pays,\n  production_lait_tonnes\nFROM faostat_production\nWHERE produit = 'Lait de vache'\n  AND pays IN ('France','Allemagne','Pays-Bas','Pologne','Irlande')\n  AND annee IN (2000, 2005, 2010, 2015, 2020, 2023)\nORDER BY annee ASC, pays ASC;`,
      columns: ['annee', 'pays', 'production_lait_tonnes'],
      results: [
        { annee: 2000, pays: 'France', production_lait_tonnes: 24700 },
        { annee: 2005, pays: 'France', production_lait_tonnes: 23900 },
        { annee: 2010, pays: 'France', production_lait_tonnes: 24100 },
        { annee: 2015, pays: 'France', production_lait_tonnes: 25600 },
        { annee: 2020, pays: 'France', production_lait_tonnes: 25300 },
        { annee: 2023, pays: 'France', production_lait_tonnes: 26100 },
        { annee: 2000, pays: 'Allemagne', production_lait_tonnes: 28300 },
        { annee: 2010, pays: 'Allemagne', production_lait_tonnes: 29600 },
        { annee: 2020, pays: 'Allemagne', production_lait_tonnes: 33100 },
        { annee: 2023, pays: 'Allemagne', production_lait_tonnes: 32800 },
      ],
      chartType: 'line',
      error: null, executionTime: 0.51, loading: false,
      followUps: getFollowUps('milk'),
    };
  }

  if (lower.includes('tendance') || lower.includes('dix') || lower.includes('10')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici les tendances des principaux indicateurs de santé en Europe (2014–2023).",
      explanation: "Cette requête agrupe les indicateurs par année. On observe une amélioration globale de l'espérance de vie et une baisse de la mortalité cardiovasculaire, avec un épisode de recul en 2020.",
      sql: `SELECT\n  annee,\n  AVG(esperance_vie) AS esperance_moyenne,\n  AVG(taux_mortalite_cardio) AS mortalite_cardio,\n  AVG(depenses_sante_pct) AS depenses_sante\nFROM oms_sante_europe\nWHERE annee BETWEEN 2014 AND 2023\nGROUP BY annee\nORDER BY annee ASC;`,
      columns: ['annee', 'esperance_moyenne', 'mortalite_cardio', 'depenses_sante'],
      results: [
        { annee: 2014, esperance_moyenne: 80.5, mortalite_cardio: 135.2, depenses_sante: 8.6 },
        { annee: 2015, esperance_moyenne: 80.8, mortalite_cardio: 131.7, depenses_sante: 8.8 },
        { annee: 2016, esperance_moyenne: 81.0, mortalite_cardio: 128.4, depenses_sante: 9.0 },
        { annee: 2017, esperance_moyenne: 81.2, mortalite_cardio: 125.8, depenses_sante: 9.1 },
        { annee: 2018, esperance_moyenne: 81.4, mortalite_cardio: 123.1, depenses_sante: 9.3 },
        { annee: 2019, esperance_moyenne: 81.6, mortalite_cardio: 120.5, depenses_sante: 9.5 },
        { annee: 2020, esperance_moyenne: 80.9, mortalite_cardio: 124.8, depenses_sante: 10.2 },
        { annee: 2021, esperance_moyenne: 81.3, mortalite_cardio: 121.3, depenses_sante: 10.5 },
        { annee: 2022, esperance_moyenne: 81.7, mortalite_cardio: 118.6, depenses_sante: 10.3 },
        { annee: 2023, esperance_moyenne: 81.9, mortalite_cardio: 116.2, depenses_sante: 10.4 },
      ],
      chartType: 'line',
      error: null, executionTime: 0.55, loading: false,
      followUps: getFollowUps('trend'),
    };
  }

  if (lower.includes('plus élevé') || lower.includes('eleve') || lower.includes('valeur')) {
    return {
      id: genId(), role: 'assistant',
      content: "Voici les pays européens avec les valeurs les plus élevées pour les dépenses de santé (2023).",
      explanation: "L'Allemagne arrive en tête avec 12,8 % du PIB consacrés aux dépenses de santé, suivie de la France et de la Suède. La moyenne européenne s'établit à 10,4 %.",
      sql: `SELECT\n  pays,\n  depenses_sante_pct,\n  esperance_vie,\n  medecins_pour_100k\nFROM oms_sante_europe\nWHERE annee = 2023\nORDER BY depenses_sante_pct DESC\nLIMIT 8;`,
      columns: ['pays', 'depenses_sante_pct', 'esperance_vie', 'medecins_pour_100k'],
      results: [
        { pays: 'Allemagne', depenses_sante_pct: 12.8, esperance_vie: 81.0, medecins_pour_100k: 448 },
        { pays: 'France', depenses_sante_pct: 12.4, esperance_vie: 82.5, medecins_pour_100k: 326 },
        { pays: 'Suède', depenses_sante_pct: 11.1, esperance_vie: 82.4, medecins_pour_100k: 410 },
        { pays: 'Pays-Bas', depenses_sante_pct: 10.9, esperance_vie: 82.1, medecins_pour_100k: 358 },
        { pays: 'Danemark', depenses_sante_pct: 10.5, esperance_vie: 81.6, medecins_pour_100k: 395 },
        { pays: 'Belgique', depenses_sante_pct: 10.4, esperance_vie: 81.8, medecins_pour_100k: 312 },
        { pays: 'Autriche', depenses_sante_pct: 10.3, esperance_vie: 81.7, medecins_pour_100k: 524 },
        { pays: 'Italie', depenses_sante_pct: 9.5, esperance_vie: 82.8, medecins_pour_100k: 408 },
      ],
      chartType: 'bar',
      error: null, executionTime: 0.33, loading: false,
      followUps: getFollowUps('top'),
    };
  }

  // Default response
  return {
    id: genId(), role: 'assistant',
    content: `Voici une analyse pour votre question : « ${question} »`,
    explanation: "J'ai interprété votre requête et généré une requête SQL pour extraire les données pertinentes. Les résultats ci-dessous sont issus de données fictives réalistes.",
    sql: `SELECT\n  pays,\n  annee,\n  indicateur,\n  valeur\nFROM oms_sante_europe\nWHERE indicateur = ' mortalité '\nORDER BY annee DESC\nLIMIT 10;`,
    columns: ['pays', 'annee', 'indicateur', 'valeur'],
    results: [
      { pays: 'France', annee: 2023, indicateur: 'Espérance de vie', valeur: 82.5 },
      { pays: 'Allemagne', annee: 2023, indicateur: 'Espérance de vie', valeur: 81.0 },
      { pays: 'Espagne', annee: 2023, indicateur: 'Espérance de vie', valeur: 83.8 },
      { pays: 'Italie', annee: 2023, indicateur: 'Espérance de vie', valeur: 82.8 },
      { pays: 'Pologne', annee: 2023, indicateur: 'Espérance de vie', valeur: 77.9 },
    ],
    chartType: 'bar',
    error: null, executionTime: 0.29, loading: false,
    followUps: getFollowUps('default'),
  };
}

export const mockDataSources: DataSourceDef[] = [
  {
    id: 'ds1',
    name: 'PostgreSQL — OMS Santé Europe',
    type: 'relational',
    status: 'connected',
    icon: 'database',
    tables: [
      {
        name: 'oms_sante_europe',
        rowCount: 4200,
        columns: [
          { name: 'pays', type: 'VARCHAR(100)', nullable: false },
          { name: 'annee', type: 'INTEGER', nullable: false },
          { name: 'esperance_vie_h', type: 'DECIMAL(4,1)', nullable: true },
          { name: 'esperance_vie_f', type: 'DECIMAL(4,1)', nullable: true },
          { name: 'taux_mortalite_cardio', type: 'DECIMAL(6,1)', nullable: true },
          { name: 'depenses_sante_pct', type: 'DECIMAL(4,1)', nullable: true },
          { name: 'medecins_pour_100k', type: 'INTEGER', nullable: true },
        ],
      },
    ],
  },
  {
    id: 'ds2',
    name: 'CSV — faostat_production.csv',
    type: 'csv',
    status: 'connected',
    icon: 'file-text',
    tables: [
      {
        name: 'faostat_production',
        rowCount: 12500,
        columns: [
          { name: 'pays', type: 'VARCHAR(100)', nullable: false },
          { name: 'annee', type: 'INTEGER', nullable: false },
          { name: 'produit', type: 'VARCHAR(50)', nullable: false },
          { name: 'production_tonnes', type: 'BIGINT', nullable: true },
          { name: 'rendement_ha', type: 'DECIMAL(6,2)', nullable: true },
          { name: 'superficie_ha', type: 'INTEGER', nullable: true },
        ],
      },
    ],
  },
  {
    id: 'ds3',
    name: 'JSON — faostat_trade.json',
    type: 'json',
    status: 'connected',
    icon: 'braces',
    tables: [
      {
        name: 'faostat_trade',
        rowCount: 8600,
        columns: [
          { name: 'pays', type: 'STRING', nullable: false },
          { name: 'annee', type: 'INTEGER', nullable: false },
          { name: 'produit', type: 'STRING', nullable: false },
          { name: 'export_tonnes', type: 'BIGINT', nullable: true },
          { name: 'import_tonnes', type: 'BIGINT', nullable: true },
          { name: 'valeur_usd', type: 'BIGINT', nullable: true },
        ],
      },
    ],
  },
];

export const mockConversationHistory: ConversationHistoryGroup[] = [
  {
    group: "Aujourd'hui",
    conversations: [
      { id: 'c1', title: "Mortalité cardiovasculaire en France", pinned: true },
      { id: 'c2', title: "Espérance de vie en Europe" },
    ],
  },
  {
    group: 'Hier',
    conversations: [
      { id: 'c3', title: "Top 5 producteurs de blé" },
      { id: 'c4', title: "Évolution production de lait", pinned: true },
    ],
  },
  {
    group: '7 derniers jours',
    conversations: [
      { id: 'c5', title: "Tendances santé Europe 2014-2023" },
      { id: 'c6', title: "Dépenses de santé par pays" },
      { id: 'c7', title: "Comparaison indicateurs agricoles" },
    ],
  },
];

export const mockUserProfile = {
  name: 'Marie Dubois',
  email: 'marie.dubois@u-bourgogne.fr',
  role: 'Étudiante Master 2 IA',
  university: 'Université de Bourgogne Europe',
};
