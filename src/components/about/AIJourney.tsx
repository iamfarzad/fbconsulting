
import React from "react";
import { Timeline } from "@/components/ui/timeline";

const journeyData = [
  {
    title: "2024",
    content: (
      <div>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-8">
          Leading AI automation implementations and helping businesses scale globally from Oslo. Focusing on creating accessible, ROI-driven AI solutions that work across different markets and industries.
        </p>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-8">
          Expanded expertise in LLMs and AI automation, working with businesses across Europe to implement intelligent workflows and process optimization solutions.
        </p>
      </div>
    ),
  },
  {
    title: "2022",
    content: (
      <div>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-8">
          Specialized in AI-driven business process automation, developing custom solutions for complex enterprise workflows and scaling operations.
        </p>
      </div>
    ),
  },
  {
    title: "2020-2021",
    content: (
      <div>
        <p className="text-muted-foreground text-xs md:text-sm font-normal mb-8">
          Started working with early LLM implementations, focusing on practical business applications and automation solutions. Built foundation in AI/ML technologies.
        </p>
      </div>
    ),
  }
];

const AIJourney = () => {
  return (
    <section className="w-full">
      <Timeline data={journeyData} />
    </section>
  );
};

export default AIJourney;
