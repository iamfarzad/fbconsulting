
import React from "react";
import { Timeline } from "@/components/ui/timeline";

const journeyData = [
  {
    title: "2024",
    content: (
      <div>
        <h4 className="text-foreground text-base md:text-lg font-semibold mb-2">Talk to Eve (AI Mental Wellness & Burnout Prevention)</h4>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-3">
          Built an AI-driven mental wellness platform to assess and prevent burnout.
        </p>
        <ul className="list-disc pl-5 text-muted-foreground text-xs md:text-sm space-y-1 mb-8">
          <li>Developed a mind-map-based psychological insights engine for visualizing emotions and mental states.</li>
          <li>Integrated AI-based surveys, sentiment tracking, and predictive analytics to improve workplace well-being.</li>
          <li>Uses ChromaDB, Redis, PostgreSQL, and NetworkX for hybrid storage and graph-based AI insights.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <h4 className="text-foreground text-base md:text-lg font-semibold mb-2">ZingZang Lab (AI-Powered Music Creation)</h4>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-3">
          Developed an AI-driven platform for music production and collaboration.
        </p>
        <ul className="list-disc pl-5 text-muted-foreground text-xs md:text-sm space-y-1 mb-8">
          <li>Integrated AI-assisted vocal coaching, music mixing, and mastering tools.</li>
          <li>Enabled social media integration for musicians to share music effortlessly.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div>
        <h4 className="text-foreground text-base md:text-lg font-semibold mb-2">SWAG AI (Lightweight Factory Automation Tool)</h4>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-3">
          AI-driven automation assistant for industrial workflows.
        </p>
        <ul className="list-disc pl-5 text-muted-foreground text-xs md:text-sm space-y-1 mb-8">
          <li>Used predictive analytics to optimize factory and warehouse operations.</li>
          <li>Focused on streamlining production processes for manufacturing businesses.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2021",
    content: (
      <div>
        <h4 className="text-foreground text-base md:text-lg font-semibold mb-2">iWriter.ai (AI-Powered Copywriting for SMEs)</h4>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-3">
          Built an AI-driven copywriting tool designed for small businesses.
        </p>
        <ul className="list-disc pl-5 text-muted-foreground text-xs md:text-sm space-y-1 mb-8">
          <li>Automated the creation of blog posts, ads, and sales copy.</li>
          <li>Optimized for Norwegian SMEs, helping them improve content marketing with AI.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2020",
    content: (
      <div>
        <h4 className="text-foreground text-base md:text-lg font-semibold mb-2">Optix.io (Closed Marketplace for Video Production)</h4>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-3">
          AI-powered video production marketplace for content creators.
        </p>
        <ul className="list-disc pl-5 text-muted-foreground text-xs md:text-sm space-y-1 mb-8">
          <li>Connected businesses with skilled video editors and animators.</li>
          <li>Featured automated bidding and job-matching algorithms to optimize project selection.</li>
        </ul>
      </div>
    ),
  }
];

const additionalContributions = [
  "AI Research & Development – Explored LLMs (Large Language Models) for advanced business automation.",
  "Knowledge Graphs & AI Systems – Developed graph-based AI models for better decision-making in automation.",
  "Process Optimization Consulting – Helped businesses streamline workflows using AI automation.",
  "Global AI Consulting & Tech Strategy – Provided AI automation strategies to startups, SMEs, and enterprises."
];

const AIJourney = () => {
  return (
    <section className="w-full">
      <Timeline data={journeyData} />
      
      <div className="max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10">
        <h3 className="text-lg md:text-2xl font-semibold mb-4">Additional Contributions & Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalContributions.map((contribution, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">✔</span>
              <p className="text-muted-foreground text-sm">{contribution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIJourney;
