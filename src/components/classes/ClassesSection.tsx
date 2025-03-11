
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { GraduationCap, Book, Video, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  title: string;
  description: string;
  icon: React.ReactNode;
  format: string;
  duration: string;
}

const courses: Course[] = [
  {
    title: "AI Automation Fundamentals",
    description: "Learn the basics of implementing AI automation in business processes",
    icon: <GraduationCap className="w-6 h-6 text-teal" />,
    format: "Online Course",
    duration: "6 weeks"
  },
  {
    title: "Chatbot Development",
    description: "Master the art of building intelligent conversational AI assistants",
    icon: <Book className="w-6 h-6 text-teal" />,
    format: "Live Workshop",
    duration: "4 weeks"
  },
  {
    title: "AI Strategy Masterclass",
    description: "Develop comprehensive AI implementation strategies for your organization",
    icon: <Monitor className="w-6 h-6 text-teal" />,
    format: "Hybrid Learning",
    duration: "8 weeks"
  },
  {
    title: "Data Analytics with AI",
    description: "Transform raw data into actionable business insights using AI",
    icon: <Video className="w-6 h-6 text-teal" />,
    format: "Self-Paced",
    duration: "10 weeks"
  }
];

const ClassesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-futuristic">
            <span className="text-gradient-teal">Learn AI Automation</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master AI automation through structured learning paths designed for business professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-teal/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background/40">
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{course.format}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => navigate('/contact')}
            className="px-8 py-6 rounded-full bg-teal hover:bg-teal/90 text-white"
          >
            Explore All Courses
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ClassesSection;
