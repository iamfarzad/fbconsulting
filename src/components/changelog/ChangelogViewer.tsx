
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, List, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

interface ChangelogEntry {
  content: string;
  path: string;
}

const ChangelogViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('recent');
  const [changelog, setChangelog] = useState<Record<string, ChangelogEntry>>({
    early: { content: '', path: '/src/changelogs/early-versions.md' },
    recent: { content: '', path: '/src/changelogs/recent-versions.md' },
    planned: { content: '', path: '/src/changelogs/planned-versions.md' },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChangelog = async () => {
      setLoading(true);
      try {
        // Fetch the selected changelog file
        const response = await fetch(changelog[activeTab].path);
        const content = await response.text();
        setChangelog(prev => ({
          ...prev,
          [activeTab]: { ...prev[activeTab], content }
        }));
      } catch (error) {
        console.error('Error fetching changelog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangelog();
  }, [activeTab, changelog]);

  // Parse markdown to extract version headers and their content
  const parseChangelog = (content: string) => {
    // Split by headers (## [x.x.x])
    const sections = content.split(/^## \[?(\d+\.\d+\.\d+)\]?.*$/m).filter(Boolean);
    
    // Group into pairs (version, content)
    const entries = [];
    for (let i = 0; i < sections.length; i += 2) {
      if (i + 1 < sections.length) {
        const version = sections[i];
        const content = sections[i + 1];
        entries.push({ version, content });
      }
    }
    
    return entries;
  };

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    
    return (
      <div className="prose dark:prose-invert max-w-none">
        {lines.map((line, index) => {
          // Headers
          if (line.startsWith('###')) {
            return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
          }
          // Lists
          if (line.trim().startsWith('- ')) {
            return <div key={index} className="flex items-start py-1">
              <span className="mr-2 mt-1">•</span>
              <span>{line.replace('- ', '')}</span>
            </div>;
          }
          // Regular text
          if (line.trim()) {
            return <p key={index} className="my-2">{line}</p>;
          }
          // Empty line
          return <div key={index} className="h-2"></div>;
        })}
      </div>
    );
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'early':
        return 'Early Versions (0.1.0 - 0.9.0)';
      case 'recent':
        return 'Recent Versions (1.0.0 - 1.9.0)';
      case 'planned':
        return 'Planned Future Versions';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Changelog</h1>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="early" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Early Versions</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Recent Versions</span>
          </TabsTrigger>
          <TabsTrigger value="planned" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Planned</span>
          </TabsTrigger>
        </TabsList>

        {['early', 'recent', 'planned'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{getTabTitle(tab)}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-4 text-center">Loading changelog...</div>
                ) : (
                  <>
                    {tab === 'planned' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        {renderMarkdown(changelog[tab].content)}
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {parseChangelog(changelog[tab].content).map((entry, index) => (
                          <div key={index} className="pb-6">
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="mr-2 bg-primary/10 text-primary">v{entry.version}</Badge>
                              <h3 className="text-xl font-semibold">{entry.version}</h3>
                            </div>
                            <Separator className="mb-4" />
                            {renderMarkdown(entry.content)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ChangelogViewer;
