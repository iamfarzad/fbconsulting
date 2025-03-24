import React from 'react';
import { Container } from '@/components/ui/container';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleGenAIConfig } from '@/components/copilot';
import { CopilotChat } from '@/components/copilot';

const TestGoogleAI: React.FC = () => {
  return (
    <Container>
      <PageHeader 
        title="Test Google GenAI" 
        subtitle="Testing integration of Google GenAI with CopilotKit" 
      />
      
      <div className="grid gap-6 mt-8">
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat Interface</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-medium">Google GenAI Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    This chat interface uses the Google GenAI adapter to power CopilotKit.
                  </p>
                  
                  <div className="h-[500px] border rounded-md p-4 bg-background">
                    <CopilotChat />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <GoogleGenAIConfig />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TestGoogleAI;
