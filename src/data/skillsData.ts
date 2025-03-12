
export interface SkillCategory {
  title: string;
  icon: string;
  items: string[];
}

export interface Skill {
  name: string;
  category: 'ai' | 'automation' | 'data' | 'conversational';
  level: 'expert' | 'advanced' | 'intermediate';
}

export const skills: Skill[] = [
  // AI Skills
  { name: 'Custom GPT Model Training', category: 'ai', level: 'expert' },
  { name: 'Predictive Analytics', category: 'ai', level: 'expert' },
  { name: 'Synthetic Data Generation', category: 'ai', level: 'advanced' },
  { name: 'Machine Learning', category: 'ai', level: 'expert' },
  { name: 'Computer Vision', category: 'ai', level: 'advanced' },
  
  // Automation Skills
  { name: 'Process Analysis', category: 'automation', level: 'expert' },
  { name: 'Custom Workflow Development', category: 'automation', level: 'expert' },
  { name: 'Performance Monitoring', category: 'automation', level: 'advanced' },
  { name: 'Robotic Process Automation', category: 'automation', level: 'advanced' },
  { name: 'CI/CD Pipeline Integration', category: 'automation', level: 'intermediate' },
  
  // Data Skills
  { name: 'Business Intelligence Dashboards', category: 'data', level: 'expert' },
  { name: 'Predictive Modeling', category: 'data', level: 'expert' },
  { name: 'Data Visualization', category: 'data', level: 'expert' },
  { name: 'ETL Pipeline Development', category: 'data', level: 'advanced' },
  { name: 'Data Lake & Warehouse Architecture', category: 'data', level: 'advanced' },
  
  // Conversational AI Skills
  { name: 'Custom Chatbot Development', category: 'conversational', level: 'expert' },
  { name: 'AI Copilots', category: 'conversational', level: 'expert' },
  { name: 'LLM Optimization', category: 'conversational', level: 'expert' },
  { name: 'Voice UI/UX Design', category: 'conversational', level: 'advanced' },
  { name: 'Multi-modal Conversational Systems', category: 'conversational', level: 'advanced' },
];

export const skillsData: Record<string, SkillCategory> = {
  ai: {
    title: 'AI Engineering',
    icon: 'Brain',
    items: [
      'Custom GPT Model Training',
      'Predictive Analytics',
      'Synthetic Data Generation',
      'Machine Learning',
      'Computer Vision'
    ]
  },
  automation: {
    title: 'Workflow Automation',
    icon: 'Workflow',
    items: [
      'Process Analysis',
      'Custom Workflow Development',
      'Performance Monitoring',
      'Robotic Process Automation',
      'CI/CD Pipeline Integration'
    ]
  },
  data: {
    title: 'Data Analytics',
    icon: 'Database',
    items: [
      'Business Intelligence Dashboards',
      'Predictive Modeling',
      'Data Visualization',
      'ETL Pipeline Development',
      'Data Lake & Warehouse Architecture'
    ]
  },
  conversational: {
    title: 'Conversational AI',
    icon: 'MessageSquare',
    items: [
      'Custom Chatbot Development',
      'AI Copilots',
      'LLM Optimization',
      'Voice UI/UX Design',
      'Multi-modal Conversational Systems'
    ]
  }
};

export const getTechnologyBreakdown = () => {
  return {
    ai: skills.filter(skill => skill.category === 'ai'),
    automation: skills.filter(skill => skill.category === 'automation'),
    data: skills.filter(skill => skill.category === 'data'),
    conversational: skills.filter(skill => skill.category === 'conversational'),
  };
};
