import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
<<<<<<< HEAD
import { Target, Clock, Home, Timer } from 'lucide-react';
import Dashboard from './Dashboard';
import HabitTracker from './HabitTracker';
import FocusHoursTracker from './FocusHoursTracker';
=======
import { Target, Clock, Home, Flag, Timer } from 'lucide-react';
import Dashboard from './Dashboard';
import HabitTracker from './HabitTracker';
import FocusHoursTracker from './FocusHoursTracker';
import GoalSetting from './GoalSetting';
>>>>>>> 34ffc4a2d4e80540618b05b03a4fc11c04b31114
import TimeTracker from './TimeTracker';

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="flex justify-center mb-8">
<<<<<<< HEAD
            <TabsList className="grid w-[480px] grid-cols-4 bg-white shadow-sm border">
=======
            <TabsList className="grid w-[600px] grid-cols-5 bg-white shadow-sm border">
>>>>>>> 34ffc4a2d4e80540618b05b03a4fc11c04b31114
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
<<<<<<< HEAD
=======
              <TabsTrigger 
                value="goals" 
                className="flex items-center gap-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
              >
                <Flag className="h-4 w-4" />
                Goals
              </TabsTrigger>
>>>>>>> 34ffc4a2d4e80540618b05b03a4fc11c04b31114
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
<<<<<<< HEAD
=======

          <TabsContent value="goals" className="space-y-4">
            <GoalSetting />
          </TabsContent>
>>>>>>> 34ffc4a2d4e80540618b05b03a4fc11c04b31114
        </Tabs>
      </div>
    </div>
  );
};

export default Navigation;