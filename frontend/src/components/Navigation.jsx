import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Target, Clock, Home, Flag, Timer } from 'lucide-react';
import Dashboard from './Dashboard';
import HabitTracker from './HabitTracker';
import FocusHoursTracker from './FocusHoursTracker';
import GoalSetting from './GoalSetting';
import TimeTracker from './TimeTracker';

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[720px] grid-cols-6 bg-white shadow-sm border">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="habits" 
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <Target className="h-4 w-4" />
                Protocols
              </TabsTrigger>
              <TabsTrigger 
                value="focus" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4" />
                Focus Hours
              </TabsTrigger>
              <TabsTrigger 
                value="timetracker" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Timer className="h-4 w-4" />
                Time Tracker
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="flex items-center gap-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <Flag className="h-4 w-4" />
                Goals
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard />
          </TabsContent>

          <TabsContent value="habits" className="space-y-4">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="focus" className="space-y-4">
            <FocusHoursTracker />
          </TabsContent>

          <TabsContent value="timetracker" className="space-y-4">
            <TimeTracker />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Analytics />
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <GoalSetting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Navigation;