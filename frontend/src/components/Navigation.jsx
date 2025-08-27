import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Target, Clock } from 'lucide-react';
import HabitTracker from './HabitTracker';
import FocusHoursTracker from './FocusHoursTracker';

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="habits" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2 bg-white shadow-sm border">
              <TabsTrigger 
                value="habits" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Target className="h-4 w-4" />
                Protocol Tracker
              </TabsTrigger>
              <TabsTrigger 
                value="focus" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4" />
                Focus Hours
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="habits" className="space-y-4">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <FocusHoursTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Navigation;