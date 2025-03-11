
import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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

const BackgroundExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  return (
    <section ref={containerRef} className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-5xl relative">
        <AnimatedText 
          text="My Background" 
          tag="h2" 
          className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 - Self-Taught AI Expert */}
          <Card className={cn(
            "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
            "hover:border-primary/20 hover:-translate-y-1",
            isInView ? "animate-fade-in-up" : "opacity-0"
          )} 
          style={{ animationDelay: '200ms' }}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary/40 to-primary/10"></div>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-2 rounded-full bg-primary/10 text-primary">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                    Self-Taught AI Expert & Startup Founder
                  </h3>
                  <div className="h-1 w-16 bg-primary/20 rounded-full mb-3 group-hover:w-32 transition-all duration-500"></div>
                </div>
              </div>
              <p className="mb-3 group-hover:text-foreground/90 transition-colors">
                I built my expertise in AI-driven automation, workflow optimization, and business scalability through hands-on experience—developing, scaling, and automating my own startups. Unlike traditional consultants who rely on theoretical frameworks, I've spent years designing, implementing, and refining AI systems that solve real-world business challenges.
              </p>
              <div className="mb-4">
                <p className="font-medium mb-2 text-foreground/90">What makes me different?</p>
                <ul className="space-y-2">
                  {[
                    "Practical Execution – I don't just advise; I build, test, and implement AI-driven automation.",
                    "Proven Startup Success – I've scaled AI-powered platforms that reduced costs and improved efficiency.",
                    "Business & Technical Expertise – Deep understanding of AI implementation beyond just coding—I focus on business impact."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300 ease-in-out" style={{ transitionDelay: `${index * 50}ms` }}>
                      <Rocket className="w-4 h-4 text-primary mr-2 mt-1 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="italic text-muted-foreground border-l-2 border-primary/30 pl-3 group-hover:border-primary transition-colors duration-300">
                If you want AI solutions that work in practice, not just on paper, let's talk.
              </p>
            </CardContent>
          </Card>
          
          {/* Card 2 - Expertise */}
          <Card className={cn(
            "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
            "hover:border-primary/20 hover:-translate-y-1",
            isInView ? "animate-fade-in-up" : "opacity-0"
          )}
          style={{ animationDelay: '400ms' }}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500/40 to-blue-500/10"></div>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-2 rounded-full bg-blue-500/10 text-blue-500">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-500 transition-colors duration-300">
                    Expertise
                  </h3>
                  <div className="h-1 w-16 bg-blue-500/20 rounded-full mb-3 group-hover:w-32 transition-all duration-500"></div>
                </div>
              </div>
              <p className="mb-3 font-medium group-hover:text-foreground/90 transition-colors">
                Bridging AI Technology & Business Strategy
              </p>
              <p className="mb-4">
                My expertise comes from a deep understanding of AI automation, data-driven decision-making, and workflow optimization, combined with years of hands-on implementation.
              </p>
              <div className="mb-4">
                <p className="font-medium mb-2 text-foreground/90">Key Areas of Expertise:</p>
                <ul className="space-y-2">
                  {[
                    "AI Workflow Automation – Using AI to optimize business operations and eliminate inefficiencies.",
                    "Machine Learning & Process Optimization – Implementing predictive analytics for smarter decision-making.",
                    "AI Chatbots & Virtual Assistants – Automating customer support and internal processes.",
                    "Cloud-Based AI Solutions – Deploying scalable AI models for startups and enterprises.",
                    "Business Intelligence & AI Strategy – Helping companies use AI for long-term competitive advantage."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300 ease-in-out" style={{ transitionDelay: `${index * 50}ms` }}>
                      <Code className="w-4 h-4 text-blue-500 mr-2 mt-1 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                I stay ahead of AI advancements by actively engaging in the latest LLM (Large Language Model) research, AI automation tools, and business applications of artificial intelligence.
              </p>
            </CardContent>
          </Card>
          
          {/* Card 3 - Business Philosophy */}
          <Card className={cn(
            "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
            "hover:border-primary/20 hover:-translate-y-1",
            isInView ? "animate-fade-in-up" : "opacity-0"
          )}
          style={{ animationDelay: '600ms' }}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500/40 to-orange-500/10"></div>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-2 rounded-full bg-orange-500/10 text-orange-500">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-orange-500 transition-colors duration-300">
                    Business Philosophy
                  </h3>
                  <div className="h-1 w-16 bg-orange-500/20 rounded-full mb-3 group-hover:w-32 transition-all duration-500"></div>
                </div>
              </div>
              <p className="mb-3 font-medium group-hover:text-foreground/90 transition-colors">
                AI Should Solve Real Business Problems—Not Just Be a Trend
              </p>
              <p className="mb-4">
                I believe AI should be practical, accessible, and results-driven—not just a buzzword. My approach is built on clear, ROI-focused automation strategies that deliver measurable impact.
              </p>
              <div className="mb-4">
                <ul className="space-y-2">
                  {[
                    "Pragmatic AI Adoption – AI should save time, reduce costs, and boost efficiency from day one.",
                    "Custom-Tailored Solutions – No generic advice—every recommendation is based on your business needs, data, and goals.",
                    "Long-Term Transformation – AI isn't just about automation; it's about building a smarter, more agile business."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300 ease-in-out" style={{ transitionDelay: `${index * 50}ms` }}>
                      <Building className="w-4 h-4 text-orange-500 mr-2 mt-1 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Every AI strategy I build is backed by real-world data and designed to drive immediate business value while setting the foundation for long-term AI-driven success.
              </p>
            </CardContent>
          </Card>
          
          {/* Card 4 - Personal Touch */}
          <Card className={cn(
            "group hover:shadow-lg transition-all duration-500 border border-border/60 backdrop-blur-sm bg-background/80 overflow-hidden",
            "hover:border-primary/20 hover:-translate-y-1",
            isInView ? "animate-fade-in-up" : "opacity-0"
          )}
          style={{ animationDelay: '800ms' }}
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-500/40 to-purple-500/10"></div>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="mr-4 p-2 rounded-full bg-purple-500/10 text-purple-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-purple-500 transition-colors duration-300">
                    Personal Touch
                  </h3>
                  <div className="h-1 w-16 bg-purple-500/20 rounded-full mb-3 group-hover:w-32 transition-all duration-500"></div>
                </div>
              </div>
              <p className="mb-3 font-medium group-hover:text-foreground/90 transition-colors">
                AI Consulting Without the Jargon—Just Results
              </p>
              <p className="mb-4">
                I'm not just a consultant—I'm a partner in your business growth. My clients choose me because I take the time to understand their challenges, simplify AI implementation, and make automation work for their unique needs.
              </p>
              <div className="mb-4">
                <ul className="space-y-2">
                  {[
                    "Hands-On Approach – I work closely with businesses to implement AI solutions that fit their existing operations.",
                    "Jargon-Free Communication – No unnecessary complexity—just clear, actionable AI automation strategies.",
                    "Training & Support – I ensure teams understand and leverage AI effectively without needing a technical background."
                  ].map((item, index) => (
                    <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300 ease-in-out" style={{ transitionDelay: `${index * 50}ms` }}>
                      <BookOpen className="w-4 h-4 text-purple-500 mr-2 mt-1 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                AI doesn't have to be overwhelming or complicated. My goal is to make AI automation simple, effective, and tailored to your business.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
