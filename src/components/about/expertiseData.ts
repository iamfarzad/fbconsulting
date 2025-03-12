
import type { ExpertiseCardProps } from "./ExpertiseCard";

// We'll use string identifiers instead of JSX in .ts files
export const expertiseData: ExpertiseCardProps[] = [
  {
    title: "AI Strategy & Consultation",
    description: "Helping businesses create clear, actionable plans for AI adoption",
    icon: "Brain",
    bulletPoints: [
      "Create clear plans for AI adoption",
      "Analyze ROI and map out implementation",
      "Assess your tech stack and plan for change"
    ]
  },
  {
    title: "Workflow Automation",
    description: "Streamlining operations and eliminating manual processes",
    icon: "Workflow",
    bulletPoints: [
      "Identify and automate manual processes",
      "Integrate systems for smoother operations",
      "Improve quality and free up your team's time"
    ]
  },
  {
    title: "Data Analytics & Insights",
    description: "Transforming raw data into actionable business intelligence",
    icon: "LineChart",
    bulletPoints: [
      "Turn raw data into actionable intelligence",
      "Set up real-time dashboards and reporting",
      "Provide clear trends and insights for better decisions"
    ]
  },
  {
    title: "Mobile & Web Solutions",
    description: "Building intelligent applications for modern businesses",
    icon: "Smartphone",
    bulletPoints: [
      "Build smart applications that work across platforms",
      "Design interfaces that drive user engagement",
      "Deliver solutions that meet your business needs"
    ]
  }
];

// Preserve the original timeline data
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
