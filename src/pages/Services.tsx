
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  // Sample services data
  const services = [
    {
      id: 'ai-consulting',
      title: 'AI Strategy Consulting',
      description: 'Develop a comprehensive AI strategy tailored to your business needs and goals.',
      detailedDescription: 'Expert guidance on implementing AI solutions that drive real business value. From initial assessment to implementation roadmaps.',
      icon: '🧠'
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Automation',
      description: 'Streamline your business processes with intelligent automation solutions.',
      detailedDescription: 'Identify and automate repetitive tasks to improve efficiency, reduce errors, and free up your team for higher-value work.',
      icon: '⚙️'
    },
    {
      id: 'chatbot-development',
      title: 'Conversational AI',
      description: 'Create intelligent chatbots and voice assistants that enhance customer experience.',
      detailedDescription: 'Design and deploy AI-powered conversation systems that can handle customer inquiries, provide information, and execute tasks.',
      icon: '💬'
    },
    {
      id: 'data-analytics',
      title: 'AI-Powered Analytics',
      description: 'Extract meaningful insights from your data with advanced analytics solutions.',
      detailedDescription: 'Leverage machine learning algorithms to discover patterns, predict trends, and make data-driven decisions.',
      icon: '📊'
    },
    {
      id: 'custom-ai-solutions',
      title: 'Custom AI Solutions',
      description: 'Develop bespoke AI applications tailored to your specific business challenges.',
      detailedDescription: 'End-to-end development of specialized AI systems designed to solve your unique problems and create competitive advantage.',
      icon: '🛠️'
    },
    {
      id: 'ai-implementation',
      title: 'AI Implementation',
      description: 'Seamlessly integrate AI solutions into your existing systems and workflows.',
      detailedDescription: 'Technical expertise to ensure smooth deployment, adoption, and ongoing optimization of AI technologies in your organization.',
      icon: '🚀'
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">AI Services & Solutions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Strategic consulting and implementation services to help your business harness the power of artificial intelligence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link to={`/services/${service.id}`} key={service.id}>
            <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="text-4xl mb-3">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{service.detailedDescription}</p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-16 bg-muted p-8 rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Not sure which service you need?</h2>
          <p className="text-muted-foreground">Let's discuss your project goals and find the right solution together.</p>
        </div>
        <div className="flex justify-center">
          <Link to="/contact">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2">
              Schedule a Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
