
import { Faq3 } from "@/components/ui/faq3";

const demoData = {
  heading: "Frequently asked questions",
  description:
    "Everything you need to know about our AI services. Can't find the answer you're looking for? Feel free to contact our support team.",
  items: [
    {
      id: "faq-1",
      question: "What AI services do you offer?",
      answer:
        "We offer a wide range of AI services including chatbots, virtual assistants, workflow automation, AI strategy consulting, and custom AI development tailored to your business needs.",
    },
    {
      id: "faq-2",
      question: "How can AI automation benefit my business?",
      answer:
        "AI automation can significantly reduce manual processes, minimize human error, improve customer service, enhance decision-making with data insights, and ultimately increase operational efficiency and revenue.",
    },
    {
      id: "faq-3",
      question: "Is AI implementation expensive?",
      answer:
        "AI implementation costs vary based on your specific needs. We offer flexible pricing plans suitable for businesses of all sizes, focusing on solutions that provide measurable ROI and quick time-to-value.",
    },
    {
      id: "faq-4",
      question: "How long does it take to implement AI solutions?",
      answer:
        "Implementation timelines depend on the complexity of your needs. Simple chatbots can be deployed in a few weeks, while comprehensive workflow automation might take 2-3 months. We provide clear timelines during our initial consultation.",
    },
    {
      id: "faq-5",
      question: "Do you offer support after implementation?",
      answer:
        "Yes, we provide ongoing support and maintenance for all our AI solutions. Our support packages include regular updates, performance monitoring, and technical assistance to ensure your AI systems continue to perform optimally.",
    },
  ],
  supportHeading: "Still have questions?",
  supportDescription:
    "Our AI specialists are ready to help you find the perfect automation solution for your business. Get in touch for a free consultation.",
  supportButtonText: "Contact Our Team",
  supportButtonUrl: "/contact",
};

function Faq3Demo() {
  return <Faq3 {...demoData} />;
}

export { Faq3Demo };
