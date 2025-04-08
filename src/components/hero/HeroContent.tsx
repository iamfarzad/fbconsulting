
import { HeroChat } from './HeroChat';

export function HeroContent() {
  return (
    <div className="container mx-auto z-10 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          AI Consulting Services
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          Transforming businesses with intelligent automation solutions
        </p>
      </div>
      
      <div className="w-full max-w-2xl">
        <HeroChat />
      </div>
    </div>
  );
}
