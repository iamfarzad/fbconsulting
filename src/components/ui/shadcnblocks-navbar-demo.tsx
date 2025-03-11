
import { Book, Sunset, Trees, Zap } from "lucide-react";
import { Navbar1 } from "./navbar";

// Define the dark mode toggle props
interface DarkModeToggle {
  isDarkMode: boolean;
  onToggle: (pressed: boolean) => void;
}

// Update the props for ShadcnblocksNavbarDemo
interface ShadcnblocksNavbarDemoProps {
  darkModeToggle?: DarkModeToggle;
}

const demoData = {
  logo: {
    url: "/",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "F.B Consulting",
    title: "F.B Consulting",
  },
  menu: [
    {
      title: "Services",
      url: "/services",
      items: [
        {
          title: "AI Strategy",
          description: "Custom roadmaps for your business",
          icon: <Book className="size-5 shrink-0" />,
          url: "/services#ai-strategy",
        },
        {
          title: "Chatbots & Virtual Assistants",
          description: "24/7 customer support automation",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/services#chatbots",
        },
        {
          title: "Workflow Automation",
          description: "Streamline your business processes",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/services#workflow",
        },
        {
          title: "AI Data Insights",
          description: "Transform your raw business data into intelligence",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/services#data-insights",
        },
      ],
    },
    {
      title: "About",
      url: "/about",
      items: [
        {
          title: "My Story",
          description: "Learn about my mission and expertise",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/about",
        },
        {
          title: "Testimonials",
          description: "What our clients say about our services",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/about#testimonials",
        },
        {
          title: "FAQ",
          description: "Answers to common questions",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/about#faq",
        }
      ],
    },
    {
      title: "Resources",
      url: "/resources",
      items: [
        {
          title: "Blog",
          description: "Expert insights and case studies",
          icon: <Book className="size-5 shrink-0" />,
          url: "/blog",
        },
        {
          title: "Pricing",
          description: "Transparent pricing plans for every need",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/services#pricing",
        }
      ],
    }
  ],
  mobileExtraLinks: [
    { name: "Privacy", url: "/privacy" },
    { name: "Terms", url: "/terms" },
  ],
  ctaButton: {
    text: "Contact Us",
    url: "/contact",
  },
};

export function ShadcnblocksNavbarDemo({ darkModeToggle }: ShadcnblocksNavbarDemoProps) {
  return (
    <Navbar1 
      {...demoData} 
      darkModeToggle={darkModeToggle}
    />
  );
}
