
import { Book, Sunset, Trees, Zap } from "lucide-react";
import { Navbar1 } from "./shadcnblocks-com-navbar1";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Define the dark mode toggle props
interface DarkModeToggle {
  isDarkMode: boolean;
  onToggle: (checked: boolean) => void;
}

// Update the props for ShadcnblocksNavbarDemo
interface ShadcnblocksNavbarDemoProps {
  darkModeToggle?: DarkModeToggle;
}

const demoData = {
  logo: {
    url: "/",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "AI Automation Ally",
    title: "AI Automation Ally",
  },
  menu: [
    {
      title: "Home",
      url: "/",
    },
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
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "Expert insights and case studies",
          icon: <Book className="size-5 shrink-0" />,
          url: "/blog",
        },
        {
          title: "About Us",
          description: "Learn about our mission and expertise",
          icon: <Trees className="size-5 shrink-0" />,
          url: "/about",
        },
        {
          title: "Testimonials",
          description: "What our clients say about our services",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "/services#testimonials",
        },
        {
          title: "FAQ",
          description: "Answers to common questions",
          icon: <Zap className="size-5 shrink-0" />,
          url: "/about#faq",
        },
      ],
    },
    {
      title: "Pricing",
      url: "/services#pricing",
    },
    {
      title: "Contact",
      url: "/contact",
    },
  ],
  mobileExtraLinks: [
    { name: "Testimonials", url: "/services#testimonials" },
    { name: "Contact", url: "/contact" },
    { name: "Privacy", url: "/privacy" },
    { name: "Terms", url: "/terms" },
  ],
  ctaButton: {
    text: "Book a Call",
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
