
import React from 'react';
import AnimatedText from '@/components/AnimatedText';

const BackgroundExperience = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <AnimatedText text="My Background" tag="h2" className="text-3xl font-bold mb-8 text-center" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{
          animationDelay: '200ms',
          animationFillMode: 'forwards'
        }}>
            <h3 className="text-xl font-semibold mb-3">Self-Taught AI Expert & Startup Founder</h3>
            <p className="mb-3">
              I built my expertise in AI-driven automation, workflow optimization, and business scalability through hands-on experience—developing, scaling, and automating my own startups. Unlike traditional consultants who rely on theoretical frameworks, I've spent years designing, implementing, and refining AI systems that solve real-world business challenges.
            </p>
            <div className="mb-4">
              <p className="font-medium mb-2">What makes me different?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Practical Execution – I don't just advise; I build, test, and implement AI-driven automation.</li>
                <li>Proven Startup Success – I've scaled AI-powered platforms that reduced costs and improved efficiency.</li>
                <li>Business & Technical Expertise – Deep understanding of AI implementation beyond just coding—I focus on business impact.</li>
              </ul>
            </div>
            <p className="italic">
              If you want AI solutions that work in practice, not just on paper, let's talk.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{
          animationDelay: '400ms',
          animationFillMode: 'forwards'
        }}>
            <h3 className="text-xl font-semibold mb-3">Expertise</h3>
            <p className="mb-3 font-medium">
              Bridging AI Technology & Business Strategy
            </p>
            <p className="mb-4">
              My expertise comes from a deep understanding of AI automation, data-driven decision-making, and workflow optimization, combined with years of hands-on implementation.
            </p>
            <div className="mb-4">
              <p className="font-medium mb-2">Key Areas of Expertise:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI Workflow Automation – Using AI to optimize business operations and eliminate inefficiencies.</li>
                <li>Machine Learning & Process Optimization – Implementing predictive analytics for smarter decision-making.</li>
                <li>AI Chatbots & Virtual Assistants – Automating customer support and internal processes.</li>
                <li>Cloud-Based AI Solutions – Deploying scalable AI models for startups and enterprises.</li>
                <li>Business Intelligence & AI Strategy – Helping companies use AI for long-term competitive advantage.</li>
              </ul>
            </div>
            <p>
              I stay ahead of AI advancements by actively engaging in the latest LLM (Large Language Model) research, AI automation tools, and business applications of artificial intelligence.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{
          animationDelay: '600ms',
          animationFillMode: 'forwards'
        }}>
            <h3 className="text-xl font-semibold mb-3">Business Philosophy</h3>
            <p className="mb-3 font-medium">
              AI Should Solve Real Business Problems—Not Just Be a Trend
            </p>
            <p className="mb-4">
              I believe AI should be practical, accessible, and results-driven—not just a buzzword. My approach is built on clear, ROI-focused automation strategies that deliver measurable impact.
            </p>
            <div className="mb-4">
              <ul className="list-disc pl-5 space-y-1">
                <li>Pragmatic AI Adoption – AI should save time, reduce costs, and boost efficiency from day one.</li>
                <li>Custom-Tailored Solutions – No generic advice—every recommendation is based on your business needs, data, and goals.</li>
                <li>Long-Term Transformation – AI isn't just about automation; it's about building a smarter, more agile business.</li>
              </ul>
            </div>
            <p>
              Every AI strategy I build is backed by real-world data and designed to drive immediate business value while setting the foundation for long-term AI-driven success.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl opacity-0 animate-fade-in-up" style={{
          animationDelay: '800ms',
          animationFillMode: 'forwards'
        }}>
            <h3 className="text-xl font-semibold mb-3">Personal Touch</h3>
            <p className="mb-3 font-medium">
              AI Consulting Without the Jargon—Just Results
            </p>
            <p className="mb-4">
              I'm not just a consultant—I'm a partner in your business growth. My clients choose me because I take the time to understand their challenges, simplify AI implementation, and make automation work for their unique needs.
            </p>
            <div className="mb-4">
              <ul className="list-disc pl-5 space-y-1">
                <li>Hands-On Approach – I work closely with businesses to implement AI solutions that fit their existing operations.</li>
                <li>Jargon-Free Communication – No unnecessary complexity—just clear, actionable AI automation strategies.</li>
                <li>Training & Support – I ensure teams understand and leverage AI effectively without needing a technical background.</li>
              </ul>
            </div>
            <p>
              AI doesn't have to be overwhelming or complicated. My goal is to make AI automation simple, effective, and tailored to your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackgroundExperience;
