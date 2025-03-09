
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function ScrollAnimationDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-neon-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-gradient-retro">
                AI Automation
              </span>
            </h1>
          </>
        }
      >
        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-deep-purple to-background p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-neon-white">Transform Your Business</h2>
              <p className="text-muted-foreground">
                Our AI solutions help you automate repetitive tasks, improve customer experiences, 
                and unlock insights hidden in your data.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-[250px] rounded-xl bg-gradient-to-r from-retro-pink/20 to-teal/20 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}

export default ScrollAnimationDemo;
