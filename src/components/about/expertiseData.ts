
import { Book, Brain, Cpu, Database, LineChart, Network, Shield, Smartphone } from "lucide-react";
import { ExpertiseCardProps } from "./ExpertiseCard";

export const cardData: ExpertiseCardProps[] = [
  {
    title: "AI Strategy & Consultation",
    description: "Developing comprehensive AI adoption strategies tailored to business needs",
    icon: Brain,
    bulletPoints: [
      "Custom AI roadmap development",
      "ROI analysis and implementation planning",
      "Technology stack assessment",
      "Risk assessment and mitigation strategies"
    ],
    bulletPointIcon: Shield,
    learnMore: "Learn more about our strategic consulting approach",
    stats: {
      projectsCompleted: 50,
      successRate: 95,
      clientSatisfaction: 98
    }
  },
  {
    title: "Workflow Automation",
    description: "Streamlining business processes with intelligent automation",
    icon: Cpu,
    bulletPoints: [
      "Process analysis and optimization",
      "Custom automation solution development",
      "Integration with existing systems",
      "Performance monitoring and optimization"
    ],
    bulletPointIcon: Network,
    learnMore: "Discover our workflow automation solutions",
    stats: {
      processesAutomated: 200,
      efficiencyGain: 75,
      costReduction: 40
    }
  },
  {
    title: "Data Analytics & Insights",
    description: "Transforming raw data into actionable business intelligence",
    icon: LineChart,
    bulletPoints: [
      "Advanced data analytics",
      "Predictive modeling",
      "Business intelligence dashboards",
      "Custom reporting solutions"
    ],
    bulletPointIcon: Database,
    learnMore: "Explore our data analytics capabilities",
    stats: {
      dataPointsAnalyzed: "1M+",
      insightsGenerated: "500+",
      accuracyRate: 97
    }
  },
  {
    title: "Mobile & Web Solutions",
    description: "Building intelligent applications for modern businesses",
    icon: Smartphone,
    bulletPoints: [
      "AI-powered app development",
      "Progressive web applications",
      "Cross-platform solutions",
      "Smart UI/UX design"
    ],
    bulletPointIcon: Book,
    learnMore: "View our application development portfolio",
    stats: {
      appsDelivered: 75,
      userSatisfaction: 96,
      returnClients: 85
    }
  }
];

export const timelinePoints = [
  {
    year: 2024,
    title: "AI Automation Focus",
    description: "Specializing in enterprise AI solutions and automation"
  },
  {
    year: 2022,
    title: "Advanced Analytics",
    description: "Expanding into predictive analytics and machine learning"
  },
  {
    year: 2020,
    title: "Digital Transformation",
    description: "Leading digital transformation projects"
  },
  {
    year: 2018,
    title: "Tech Consulting",
    description: "Started technology consulting practice"
  }
];
