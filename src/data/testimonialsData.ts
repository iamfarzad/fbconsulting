
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  projectType: string;
  result: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'TechInnovate',
    content: 'Working with this team completely transformed our customer service. Their AI automation solution reduced response times by 65% and increased customer satisfaction scores by 40%. The ROI we've seen has been incredible.',
    projectType: 'Customer Service Automation',
    result: 'Reduced response times by 65%',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Director of Operations',
    company: 'FinanceFlow',
    content: 'We approached them to help streamline our financial document processing. The custom AI solution they built now handles the work of what used to take a team of 5 people, with higher accuracy and 10x faster processing. A game-changer for our operations.',
    projectType: 'Document Processing Automation',
    result: 'Operations running 10x faster with fewer errors',
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    role: 'VP of E-commerce',
    company: 'RetailPro',
    content: 'Their AI-powered recommendation engine completely revolutionized our online shopping experience. We've seen conversion rates increase by 40% and average order value up by 25%. The insights from their system have been invaluable.',
    projectType: 'E-commerce Personalization',
    result: 'Conversion rates increased by 40%',
  },
  {
    id: '4',
    name: 'David Patel',
    role: 'Head of Marketing',
    company: 'GrowthBrand',
    content: 'The conversational AI chatbot they developed for our lead generation has transformed our marketing approach. We're now capturing 3x more qualified leads at a 50% lower cost per acquisition. Highly recommended for any marketing team.',
    projectType: 'Marketing Chatbot',
    result: '3x more qualified leads at 50% lower cost',
  },
  {
    id: '5',
    name: 'Emma Larson',
    role: 'CEO',
    company: 'HealthTech Solutions',
    content: 'Their AI consultation completely changed our approach to patient management. The custom solution they designed has reduced administrative time by 70% and allowed our staff to focus on patient care instead of paperwork.',
    projectType: 'Healthcare Process Optimization',
    result: 'Reduced administrative time by 70%',
  }
];
