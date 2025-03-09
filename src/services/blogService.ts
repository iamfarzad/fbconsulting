
import { BlogPost } from '../types/blog';

// In a real implementation, this would fetch from an API
export const getBlogPost = (slug: string): BlogPost => {
  // This is a dummy function that would normally fetch data from an API
  return {
    title: 'How AI Automation Saved a Manufacturing Company $1.2M Annually',
    date: 'May 15, 2023',
    readTime: '8 min read',
    category: 'Case Study',
    author: 'John Doe',
    authorTitle: 'AI Automation Consultant',
    authorAvatar: '/placeholder.svg',
    content: `
      <p class="mb-4">
        In the competitive landscape of modern manufacturing, efficiency is king. This case study explores how a mid-sized manufacturing company facing rising costs and increasing competition transformed their operations through strategic AI implementation.
      </p>
      
      <h2 class="text-2xl font-bold mb-3 mt-8">The Challenge</h2>
      
      <p class="mb-4">
        The client, a manufacturer with 200+ employees producing precision components, was struggling with:
      </p>
      
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Quality control processes that relied heavily on manual inspection</li>
        <li class="mb-2">Production inefficiencies leading to approximately 12% waste</li>
        <li class="mb-2">Maintenance issues causing unplanned downtime</li>
        <li class="mb-2">Rising labor costs and difficulty hiring skilled inspectors</li>
      </ul>
      
      <p class="mb-4">
        These challenges were costing the company an estimated $1.8M annually in waste, rework, and lost production time.
      </p>
      
      <h2 class="text-2xl font-bold mb-3 mt-8">The Solution</h2>
      
      <p class="mb-4">
        We implemented a comprehensive AI automation solution with three key components:
      </p>
      
      <h3 class="text-xl font-semibold mb-2 mt-6">1. Computer Vision Quality Control System</h3>
      
      <p class="mb-4">
        We developed a custom computer vision system using deep learning models trained on thousands of product images. The system could:
      </p>
      
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Detect defects with 99.7% accuracy (higher than human inspectors)</li>
        <li class="mb-2">Process inspections 5x faster than manual methods</li>
        <li class="mb-2">Operate 24/7 without fatigue</li>
        <li class="mb-2">Automatically categorize and document defects</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-2 mt-6">2. Predictive Maintenance AI</h3>
      
      <p class="mb-4">
        We implemented sensors and machine learning algorithms to monitor equipment health:
      </p>
      
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Early detection of potential equipment failures</li>
        <li class="mb-2">Predictive maintenance scheduling to minimize downtime</li>
        <li class="mb-2">Real-time monitoring of machine performance</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-2 mt-6">3. Production Optimization System</h3>
      
      <p class="mb-4">
        We created an AI system to optimize production parameters in real-time:
      </p>
      
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Continuous analysis of production variables</li>
        <li class="mb-2">Automatic adjustments to reduce waste</li>
        <li class="mb-2">Integration with inventory and order management</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-3 mt-8">The Results</h2>
      
      <p class="mb-4">After 12 months of implementation:</p>
      
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2"><strong>67% reduction in quality-related defects</strong>, resulting in $450K annual savings</li>
        <li class="mb-2"><strong>89% reduction in unplanned downtime</strong>, saving approximately $320K annually</li>
        <li class="mb-2"><strong>Waste reduction from 12% to 3.5%</strong>, saving $380K in materials annually</li>
        <li class="mb-2"><strong>Labor efficiency increase of 22%</strong>, allowing for reallocation of staff to higher-value tasks</li>
        <li class="mb-2"><strong>Total annual savings: $1.2M</strong> with an implementation cost that paid for itself in 7 months</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-3 mt-8">Implementation Process</h2>
      
      <p class="mb-4">
        The project was executed in phases over 6 months:
      </p>
      
      <ol class="list-decimal pl-6 mb-6">
        <li class="mb-2"><strong>Assessment & Planning (2 weeks)</strong>: Thorough analysis of current processes and pain points</li>
        <li class="mb-2"><strong>Data Collection (1 month)</strong>: Gathering product images and sensor data for model training</li>
        <li class="mb-2"><strong>Model Development (2 months)</strong>: Creating and training the AI models for each system</li>
        <li class="mb-2"><strong>Pilot Implementation (1 month)</strong>: Testing on a single production line</li>
        <li class="mb-2"><strong>Full Deployment (1.5 months)</strong>: Rolling out to all production lines with staff training</li>
        <li class="mb-2"><strong>Optimization (ongoing)</strong>: Continuous refinement of the systems</li>
      </ol>
      
      <h2 class="text-2xl font-bold mb-3 mt-8">Conclusion</h2>
      
      <p class="mb-4">
        This case study demonstrates how targeted AI automation can transform manufacturing operations, delivering substantial ROI while improving product quality and operational efficiency. The key to success was not just implementing technology, but designing systems that integrated seamlessly with existing workflows and provided clear, actionable insights to the human operators overseeing production.
      </p>
    `,
    relatedPosts: [
      {
        id: '2',
        title: 'The Future of Customer Service: AI Chatbots That Actually Work',
        slug: 'future-of-customer-service-ai-chatbots',
      },
      {
        id: '5',
        title: 'AI Workflow Automation: Real-World Success Stories',
        slug: 'ai-workflow-automation-success-stories',
      },
    ]
  };
};
