
import { Testimonial } from '@/types/blog';

// Use the existing Testimonial interface from types/blog.ts
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechInnovate',
    role: 'CTO',
    content: "The AI automation solutions provided have revolutionized our customer service. Response times dropped by 65% and customer satisfaction scores are at an all-time high. The implementation was smooth and the ongoing support has been exceptional.",
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'FinanceFlow',
    role: 'Operations Director',
    content: "What previously took our team days to complete now happens in minutes. Our operations are running 10x faster with far fewer errors. The AI workflow automation has completely transformed how we process financial data and reports.",
    rating: 5
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    company: 'RetailPro',
    role: 'Marketing Manager',
    content: "The AI-powered marketing insights have been a game changer. We've increased our conversion rates by 40% by targeting the right customers with the right offers at the right time. The data analytics capabilities are truly impressive.",
    rating: 4
  },
  {
    id: '4',
    name: 'David Patel',
    company: 'GrowthBrand',
    role: 'Head of Marketing',
    content: "The conversational AI chatbot developed for our lead generation has transformed our marketing approach. We're now capturing 3x more qualified leads at a 50% lower cost per acquisition. Highly recommended for any marketing team.",
    rating: 5
  },
  {
    id: '5',
    name: 'Emma Larson',
    company: 'HealthTech Solutions',
    role: 'CEO',
    content: "The AI consultation completely changed our approach to patient management. The custom solution designed has reduced administrative time by 70% and allowed our staff to focus on patient care instead of paperwork.",
    rating: 5
  }
];

// Function to get testimonials
export const getTestimonials = () => testimonials;

// Function to get a single testimonial by ID
export const getTestimonialById = (id: string): Testimonial | undefined => {
  return testimonials.find(testimonial => testimonial.id === id);
};
