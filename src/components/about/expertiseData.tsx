
import React from 'react';
import { Brain, BookMarked, Lightbulb, Users, Code, Rocket, Building, BookOpen } from 'lucide-react';

export const cardData = [
  {
    title: "Self-Taught AI Expert & Startup Founder",
    icon: <Brain size={24} />,
    iconBgClass: "bg-primary/10",
    iconColor: "text-primary",
    accentColor: "primary",
    description: "I built my expertise in AI-driven automation, workflow optimization, and business scalability through hands-on experience—developing, scaling, and automating my own startups.",
    bulletPoints: [
      "Practical Execution – I don't just advise; I build, test, and implement AI-driven automation.",
      "Proven Startup Success – I've scaled AI-powered platforms that reduced costs and improved efficiency.",
      "Business & Technical Expertise – Deep understanding of AI implementation beyond just coding—I focus on business impact."
    ],
    additionalDetails: "Unlike traditional consultants who rely on theoretical frameworks, I've spent years designing, implementing, and refining AI systems that solve real-world business challenges. This hands-on approach allows me to understand both the technical and business aspects of AI implementation.",
    bulletPointIcon: <Rocket size={16} />,
    contactLink: {
      text: "Schedule a Strategy Session",
      url: "/contact"
    }
  },
  {
    title: "Expertise",
    subtitle: "Bridging AI Technology & Business Strategy",
    icon: <BookMarked size={24} />,
    iconBgClass: "bg-blue-500/10",
    iconColor: "text-blue-500",
    accentColor: "blue-500",
    description: "My expertise comes from a deep understanding of AI automation, data-driven decision-making, and workflow optimization, combined with years of hands-on implementation.",
    bulletPoints: [
      "AI Workflow Automation – Using AI to optimize business operations and eliminate inefficiencies.",
      "Machine Learning & Process Optimization – Implementing predictive analytics for smarter decision-making.",
      "AI Chatbots & Virtual Assistants – Automating customer support and internal processes.",
      "Cloud-Based AI Solutions – Deploying scalable AI models for startups and enterprises.",
      "Business Intelligence & AI Strategy – Helping companies use AI for long-term competitive advantage."
    ],
    additionalDetails: "I stay ahead of AI advancements by actively engaging in the latest LLM (Large Language Model) research, AI automation tools, and business applications of artificial intelligence. My approach combines cutting-edge technology with pragmatic business strategy to deliver measurable results.",
    bulletPointIcon: <Code size={16} />,
    contactLink: {
      text: "Discuss Your AI Needs",
      url: "/contact"
    }
  },
  {
    title: "Business Philosophy",
    subtitle: "AI Should Solve Real Business Problems—Not Just Be a Trend",
    icon: <Lightbulb size={24} />,
    iconBgClass: "bg-orange-500/10",
    iconColor: "text-orange-500",
    accentColor: "orange-500",
    description: "I believe AI should be practical, accessible, and results-driven—not just a buzzword. My approach is built on clear, ROI-focused automation strategies that deliver measurable impact.",
    bulletPoints: [
      "Pragmatic AI Adoption – AI should save time, reduce costs, and boost efficiency from day one.",
      "Custom-Tailored Solutions – No generic advice—every recommendation is based on your business needs, data, and goals.",
      "Long-Term Transformation – AI isn't just about automation; it's about building a smarter, more agile business."
    ],
    additionalDetails: "Every AI strategy I build is backed by real-world data and designed to drive immediate business value while setting the foundation for long-term AI-driven success. I focus on solutions that can be implemented quickly and scaled effectively as your business grows.",
    bulletPointIcon: <Building size={16} />,
    contactLink: {
      text: "Book a Free Consultation",
      url: "/contact"
    }
  },
  {
    title: "Personal Touch",
    subtitle: "AI Consulting Without the Jargon—Just Results",
    icon: <Users size={24} />,
    iconBgClass: "bg-purple-500/10",
    iconColor: "text-purple-500",
    accentColor: "purple-500",
    description: "I'm not just a consultant—I'm a partner in your business growth. My clients choose me because I take the time to understand their challenges, simplify AI implementation, and make automation work for their unique needs.",
    bulletPoints: [
      "Hands-On Approach – I work closely with businesses to implement AI solutions that fit their existing operations.",
      "Jargon-Free Communication – No unnecessary complexity—just clear, actionable AI automation strategies.",
      "Training & Support – I ensure teams understand and leverage AI effectively without needing a technical background."
    ],
    additionalDetails: "AI doesn't have to be overwhelming or complicated. My goal is to make AI automation simple, effective, and tailored to your business. I provide ongoing support to ensure your team can fully leverage the AI solutions we implement together.",
    bulletPointIcon: <BookOpen size={16} />,
    contactLink: {
      text: "Get in Touch",
      url: "/contact"
    }
  }
];

export const timelinePoints = [
  { year: 2016, label: "Started AI Journey" },
  { year: 2018, label: "First AI Startup" },
  { year: 2020, label: "Expanded Consulting" },
  { year: 2022, label: "Advanced LLM Work" },
  { year: 2023, label: "Present" },
];
