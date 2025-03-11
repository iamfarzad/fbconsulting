
import React, { useRef, useEffect, useState } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Code, 
  Lightbulb, 
  Users, 
  Brain, 
  Rocket,
  BookMarked,
  Building,
  Calendar
} from 'lucide-react';
import ScrollProgress from './ScrollProgress';
import ExpertiseCard from './ExpertiseCard';

const BackgroundExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Background pattern animation based on scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]);
  const patternRotation = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const patternScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top, height } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.min(
          Math.max((windowHeight - top) / (height + windowHeight), 0),
          1
        );
        setScrollPosition(scrollPercentage);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const cardData = [
    {
      title: "Self-Taught AI Expert & Startup Founder",
      icon: <Brain className="w-6 h-6" />,
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
      bulletPointIcon: <Rocket className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />,
      contactLink: {
        text: "Schedule a Strategy Session",
        url: "/contact"
      }
    },
    {
      title: "Expertise",
      subtitle: "Bridging AI Technology & Business Strategy",
      icon: <BookMarked className="w-6 h-6" />,
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
      bulletPointIcon: <Code className="w-4 h-4 text-blue-500 mr-2 mt-1 shrink-0" />,
      contactLink: {
        text: "Discuss Your AI Needs",
        url: "/contact"
      }
    },
    {
      title: "Business Philosophy",
      subtitle: "AI Should Solve Real Business Problems—Not Just Be a Trend",
      icon: <Lightbulb className="w-6 h-6" />,
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
      bulletPointIcon: <Building className="w-4 h-4 text-orange-500 mr-2 mt-1 shrink-0" />,
      contactLink: {
        text: "Book a Free Consultation",
        url: "/contact"
      }
    },
    {
      title: "Personal Touch",
      subtitle: "AI Consulting Without the Jargon—Just Results",
      icon: <Users className="w-6 h-6" />,
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
      bulletPointIcon: <BookOpen className="w-4 h-4 text-purple-500 mr-2 mt-1 shrink-0" />,
      contactLink: {
        text: "Get in Touch",
        url: "/contact"
      }
    }
  ];
  
  // Timeline points for expertise progression
  const timelinePoints = [
    { year: 2016, label: "Started AI Journey" },
    { year: 2018, label: "First AI Startup" },
    { year: 2020, label: "Expanded Consulting" },
    { year: 2022, label: "Advanced LLM Work" },
    { year: 2023, label: "Present" },
  ];
  
  return (
    <section ref={containerRef} className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Scroll progress indicator */}
      <ScrollProgress targetRef={containerRef} />
      
      {/* Animated background pattern that reacts to scroll */}
      <motion.div 
        style={{ 
          opacity: patternOpacity,
          rotate: patternRotation,
          scale: patternScale
        }}
        className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"
      />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <AnimatedText 
          text="My Background" 
          tag="h2" 
          className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground" 
        />
        
        {/* Timeline (visible on larger screens) */}
        <div className="hidden lg:block mb-12 relative">
          <div className="absolute left-0 right-0 h-1 bg-muted top-5"></div>
          <div className="flex justify-between relative">
            {timelinePoints.map((point, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: index * 0.1 + 0.2 }}
                >
                  {point.year}
                </motion.div>
                <motion.p 
                  className="mt-2 text-xs font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  {point.label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Expertise cards with staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cardData.map((card, index) => (
            <ExpertiseCard 
              key={index}
              index={index}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              iconBgClass={card.iconBgClass}
              iconColor={card.iconColor}
              accentColor={card.accentColor}
              description={card.description}
              bulletPoints={card.bulletPoints}
              additionalDetails={card.additionalDetails}
              bulletPointIcon={card.bulletPointIcon}
              contactLink={card.contactLink}
            />
          ))}
        </div>
        
        {/* Call to action with calendar booking */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 border border-primary/20 bg-background/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3">Ready to transform your business with AI?</h3>
            <p className="mb-4">Book a free 30-minute consultation to discuss how AI automation can help your specific business needs.</p>
            <motion.a 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="mr-2 w-5 h-5" />
              Schedule Now
            </motion.a>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
