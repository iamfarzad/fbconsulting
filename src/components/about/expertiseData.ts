
import { Brain, Workflow, LineChart, Smartphone, ArrowRight, Check, Target, Zap } from "lucide-react";
import { ExpertiseCardProps } from "./ExpertiseCard";
import React from "react";

export const expertiseData: ExpertiseCardProps[] = [
  {
    title: "AI Strategy & Consultation",
    description: "Helping businesses create clear, actionable plans for AI adoption",
    icon: <Brain className="w-5 h-5 text-[#fe5a1d]" />,
    bulletPoints: [
      "Create clear plans for AI adoption",
      "Analyze ROI and map out implementation",
      "Assess your tech stack and plan for change"
    ]
  },
  {
    title: "Workflow Automation",
    description: "Streamlining operations and eliminating manual processes",
    icon: <Workflow className="w-5 h-5 text-[#fe5a1d]" />,
    bulletPoints: [
      "Identify and automate manual processes",
      "Integrate systems for smoother operations",
      "Improve quality and free up your team's time"
    ]
  },
  {
    title: "Data Analytics & Insights",
    description: "Transforming raw data into actionable business intelligence",
    icon: <LineChart className="w-5 h-5 text-[#fe5a1d]" />,
    bulletPoints: [
      "Turn raw data into actionable intelligence",
      "Set up real-time dashboards and reporting",
      "Provide clear trends and insights for better decisions"
    ]
  },
  {
    title: "Mobile & Web Solutions",
    description: "Building intelligent applications for modern businesses",
    icon: <Smartphone className="w-5 h-5 text-[#fe5a1d]" />,
    bulletPoints: [
      "Build smart applications that work across platforms",
      "Design interfaces that drive user engagement",
      "Deliver solutions that meet your business needs"
    ]
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
