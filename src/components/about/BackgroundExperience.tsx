
import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { useInView, useScroll, motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Lightbulb, 
  Users, 
  Brain, 
  Rocket,
  BookMarked,
  Building
} from 'lucide-react';
import ExpertiseCard from './timeline/ExpertiseCard';
import ScrollProgress from './timeline/ScrollProgress';

const BackgroundExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const expertiseData = [
    {
      title: "Self-Taught AI Expert & Startup Founder",
      description: "I built my expertise in AI-driven automation, workflow optimization, and business scalability through hands-on experience.",
      icon: Brain,
      points: [
        "Practical Execution – I don't just advise; I build, test, and implement AI-driven automation.",
        "Proven Startup Success – I've scaled AI-powered platforms that reduced costs and improved efficiency.",
        "Business & Technical Expertise – Deep understanding of AI implementation beyond just coding—I focus on business impact."
      ],
      gradientFrom: "from-primary/40",
      gradientTo: "to-primary/10",
      iconBgClass: "bg-primary/10",
      iconTextClass: "text-primary"
    },
    {
      title: "Expertise",
      description: "Bridging AI Technology & Business Strategy",
      icon: BookMarked,
      points: [
        "AI Workflow Automation – Using AI to optimize business operations and eliminate inefficiencies.",
        "Machine Learning & Process Optimization – Implementing predictive analytics for smarter decision-making.",
        "AI Chatbots & Virtual Assistants – Automating customer support and internal processes.",
        "Cloud-Based AI Solutions – Deploying scalable AI models for startups and enterprises.",
        "Business Intelligence & AI Strategy – Helping companies use AI for long-term competitive advantage."
      ],
      gradientFrom: "from-blue-500/40",
      gradientTo: "to-blue-500/10",
      iconBgClass: "bg-blue-500/10",
      iconTextClass: "text-blue-500"
    },
    {
      title: "Business Philosophy",
      description: "AI Should Solve Real Business Problems—Not Just Be a Trend",
      icon: Lightbulb,
      points: [
        "Pragmatic AI Adoption – AI should save time, reduce costs, and boost efficiency from day one.",
        "Custom-Tailored Solutions – No generic advice—every recommendation is based on your business needs, data, and goals.",
        "Long-Term Transformation – AI isn't just about automation; it's about building a smarter, more agile business."
      ],
      gradientFrom: "from-orange-500/40",
      gradientTo: "to-orange-500/10",
      iconBgClass: "bg-orange-500/10",
      iconTextClass: "text-orange-500"
    },
    {
      title: "Personal Touch",
      description: "AI Consulting Without the Jargon—Just Results",
      icon: Users,
      points: [
        "Hands-On Approach – I work closely with businesses to implement AI solutions that fit their existing operations.",
        "Jargon-Free Communication – No unnecessary complexity—just clear, actionable AI automation strategies.",
        "Training & Support – I ensure teams understand and leverage AI effectively without needing a technical background."
      ],
      gradientFrom: "from-purple-500/40",
      gradientTo: "to-purple-500/10",
      iconBgClass: "bg-purple-500/10",
      iconTextClass: "text-purple-500"
    }
  ];

  return (
    <section ref={containerRef} className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <ScrollProgress />
      
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"
        style={{
          y: scrollYProgress,
          opacity: scrollYProgress
        }}
      />
      
      <div className="container mx-auto max-w-5xl relative">
        <AnimatedText 
          text="My Background" 
          tag="h2" 
          className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {expertiseData.map((data, index) => (
            <ExpertiseCard
              key={index}
              {...data}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
