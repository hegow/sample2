export interface ProjectOneData {
  whyUs: {
    duration: string;
    style: string; // 'speed', 'calm', 'other'
    advantages: string; // 3-5 items
    visualFactors: string; // Factor creating the advantage
    painPoints: string;
    visualSymbols: string;
    coreMessage: string;
    cta: string;
    visualImagery: string;
  };
  whatWeDo: {
    duration: string;
    structure: string; // 'linear', 'categorical', 'other'
    coreMessage: string;
    environment: string;
    servicesList: string;
    workflow: string;
    equipment: string;
    finalOutput: string;
    cta: string;
    visualImagery: string;
  };
  exclusive: {
    duration: string;
    mood: string; // 'pioneer', 'powerful', 'mysterious', 'other'
    allowComparisons: boolean;
    uniqueCapabilities: string;
    secretSauce: string;
    comparisonScenario: string;
    abstractImagery: string;
    technicalTerms: string;
    coreMessage: string;
    cta: string;
    visualImagery: string;
  };
}

export interface ChallengeRow {
  id: string;
  name: string;
  problem: string;
  urgency: string;
  visualProblem: string;
  bridgeSentence: string;
  bridgeVisual: string;
  rejectedIdeas: string;
  strategy: string;
  execution: string;
  result: string;
  slogan: string;
  cta: string;
}

export interface IconRow {
  id: string;
  title: string;
  contextText: string;
  elements: string;
  actionType: string; // 'loop', 'once'
  link: string;
}

export interface ClientData {
  projectOne: ProjectOneData;
  projectTwo: ChallengeRow[];
  projectThree: IconRow[];
}

export type Tab = 'dashboard' | 'project1' | 'project2' | 'project3';