
import React, { useRef } from 'react';
import AnimatedText from '@/components/AnimatedText';
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/dot-pattern';
import { Calendar, ArrowRight, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { useToast } from '@/hooks/use-toast';

const AboutHero = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const { toast } = useToast();
  
  const handleBookConsultation = () => {
    navigate('/contact');
  };
  
  const handleCopyProfession = () => {
    navigator.clipboard.writeText('AI Automation Consultant & Strategist');
    toast({
      description: "Copied to clipboard!",
      duration: 2000
    });
  };
  
  const handleDownloadResume = () => {
    // This would be connected to an actual resume download
    toast({
      description: "Resume download feature coming soon!",
      duration: 2000
    });
  };
  
  return (
    <section ref={containerRef} className="py-20 px-4 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Dynamic background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <DotPattern width={16} height={16} cx={8} cy={8} cr={1.5} className="opacity-25" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/50 to-background"
          style={{ y }}
        />
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            className="flex-1"
            style={{ opacity }}
          >
            <AnimatedText 
              text="About Me" 
              tag="h1" 
              className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80" 
              animation="text-reveal"
            />
            <AnimatedText 
              text="Helping Businesses Cut Costs, Automate Workflows & Scale with AI" 
              tag="h2" 
              delay={200} 
              className="text-xl text-primary mb-8" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="mb-4 text-foreground/80 leading-relaxed">
                I specialize in 
                <motion.span 
                  className="text-primary font-medium mx-1 inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  AI automation
                </motion.span>, 
                <motion.span 
                  className="text-blue-500 font-medium mx-1 inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  workflow optimization
                </motion.span>, and 
                <motion.span 
                  className="text-orange-500 font-medium mx-1 inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  intelligent process design
                </motion.span>
                —helping businesses reduce manual work, increase efficiency, and drive revenue growth with AI-powered solutions.
              </div>
              <p className="mb-6 text-foreground/80 leading-relaxed">
                My approach combines deep technical expertise with business acumen, ensuring that AI solutions deliver measurable ROI and solve real business problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:gap-3 bg-gradient-to-r from-primary to-primary/90 group relative overflow-hidden"
                  onClick={handleBookConsultation}
                >
                  <Calendar size={20} />
                  <span className="relative z-10">Book a Free Consultation</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-4 group-hover:ml-0" />
                  <motion.div 
                    className="absolute inset-0 bg-primary/20" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-6 text-lg border-foreground/20 group hover:border-primary/30"
                  onClick={handleDownloadResume}
                >
                  <FileText size={18} className="mr-2 group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-primary transition-colors">Download Resume</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ scale }}
          >
            <div className="relative group">
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-xl opacity-70"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              />
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-500">
                <img 
                  alt="AI Automation Consultant" 
                  src="/lovable-uploads/5acb6ca9-27a4-40f0-b32d-65655787eaaa.jpg" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-medium">AI Automation Consultant & Strategist</p>
                    <button 
                      onClick={handleCopyProfession}
                      className="text-white/70 hover:text-white"
                      aria-label="Copy profession to clipboard"
                    >
                      <FileText size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <motion.a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white flex items-center gap-1 text-xs"
                      whileHover={{ scale: 1.05 }}
                    >
                      <ExternalLink size={12} /> LinkedIn
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Word reveal section */}
      <div className="w-full mt-24">
        <TextRevealByWord 
          text="Transforming businesses through intelligent automation and AI-driven solutions that deliver real results." 
          className="h-[40vh] min-h-[300px]"
        />
      </div>
    </section>
  );
};

export default AboutHero;
