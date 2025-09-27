import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle2, Target } from 'lucide-react';
import DataManager from '../utils/dataManager';

const HabitTracker = () => {
  const [habitData, setHabitData] = useState({});

  // Initialize habit data
  useEffect(() => {
    const savedData = DataManager.loadHabitData();
    if (savedData && Object.keys(savedData).length > 0) {
      setHabitData(savedData);
    } else {
      // Initialize with empty data for 90 days and 10 habits
      const initialData = {};
      for (let day = 1; day <= 90; day++) {
        initialData[day] = {
          habit1: false, habit2: false, habit3: false, habit4: false, habit5: false,
          habit6: false, habit7: false, habit8: false, habit9: false, habit10: false,
        };
      }
      setHabitData(initialData);
      DataManager.saveHabitData(initialData);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(habitData).length > 0) {
      DataManager.saveHabitData(habitData);
    }
  }, [habitData]);

  const handleHabitChange = (day, habit, checked) => {
    setHabitData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [habit]: checked
      }
    }));
  };

  const getCompletionCount = (habit) => {
    return Object.values(habitData).filter(dayData => dayData && dayData[habit]).length;
  };

  const getCompletionPercentage = (habit) => {
    const count = getCompletionCount(habit);
    return Math.round((count / 90) * 100);
  };

  const getDayCompletion = (day) => {
    if (!habitData[day]) return 0;
    const completed = Object.values(habitData[day]).filter(Boolean).length;
    return Math.round((completed / 10) * 100);
  };

  const habits = ['habit1', 'habit2', 'habit3', 'habit4', 'habit5', 'habit6', 'habit7', 'habit8', 'habit9', 'habit10'];
  const habitNames = [
    'No Insta/FB', 
    'No Songs', 
    'No Maggie', 
    'Mindful Eating', 
    'No PMO', 
    'WakeUp @8pm', 
    '45min Book Reading', 
    'Meditation',
    'Revise Notes',
    '3hrs of Tech'
  ];

  const shortHabitNames = [
    'No Insta/FB', 
    'No Songs', 
    'No Maggie', 
    'Mindful Eating', 
    'No PMO', 
    'WakeUp @8pm', 
    'Book Reading', 
    'Meditation',
    'Revise Notes',
    '3hrs Tech'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            90-Day Protocol Challenge
          </h1>
        </div>
        <p className="text-muted-foreground">Track your 10 daily protocols and build consistent habits over 90 days</p>
      </div>

      {/* Habit Stats Overview */}
      <div className="grid grid-cols-10 gap-3 mb-6">
        {habits.map((habit, index) => (
          <Card key={habit} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex flex-col text-center">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">{habitNames[index]}</p>
                  <p className="text-sm font-bold">{getCompletionCount(habit)}/90</p>
                </div>
                <Badge variant={getCompletionPercentage(habit) >= 70 ? "default" : "secondary"} className="mt-1 w-fit mx-auto text-xs">
                  {getCompletionPercentage(habit)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Habit Tracker Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle>100-Day Protocol Tracker</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Complete your daily protocols to build strong habits and reach your 100-day goal
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="sticky left-0 z-10 bg-muted/50 p-3 text-left font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Day
                    </div>
                  </th>
                  {shortHabitNames.map((name, index) => (
                    <th key={name} className="p-2 text-center font-medium text-xs min-w-[80px]">
                      <div className="whitespace-nowrap">
                        {name}
                      </div>
                    </th>
                  ))}
                  <th className="p-3 text-center font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 100 }, (_, i) => i + 1).map(day => (
                  <tr key={day} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="sticky left-0 z-10 bg-background p-3 font-medium border-r">
                      <div className="flex flex-col">
                        <span>Day {day}</span>
                        {day % 10 === 0 && (
                          <Badge variant="outline" className="text-xs mt-1 w-fit">
                            Week {Math.ceil(day / 7)}
                          </Badge>
                        )}
                      </div>
                    </td>
                    {habits.map((habit, habitIndex) => (
                      <td key={habit} className="p-3 text-center">
                        <div className="flex justify-center">
                          {day <= 5 ? (
                            <span className="text-xs text-muted-foreground font-medium bg-gray-100 px-2 py-1 rounded">
                              N/A
                            </span>
                          ) : (
                            <Checkbox
                              checked={habitData[day]?.[habit] || false}
                              onCheckedChange={(checked) => handleHabitChange(day, habit, checked)}
                              className="h-5 w-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 hover:border-green-400 transition-colors"
                            />
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="p-3 text-center">
                      {day <= 5 ? (
                        <span className="text-xs text-muted-foreground font-medium">N/A</span>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 bg-muted rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                              style={{ width: `${getDayCompletion(day)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {getDayCompletion(day)}%
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 100-Day Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>100-Day Challenge Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { milestone: 25, label: "Quarter Way", color: "bg-yellow-500" },
              { milestone: 50, label: "Halfway Point", color: "bg-orange-500" },
              { milestone: 75, label: "Three Quarters", color: "bg-purple-500" },
              { milestone: 100, label: "Challenge Complete!", color: "bg-green-500" }
            ].map(({ milestone, label, color }) => {
              const daysCompleted = Object.keys(habitData).filter(day => 
                habitData[day] && Object.values(habitData[day]).some(Boolean)
              ).length;
              const isReached = daysCompleted >= milestone;
              
              return (
                <div key={milestone} className={`p-4 rounded-lg border-2 ${isReached ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm mb-2 ${!isReached && 'opacity-50'}`}>
                    {milestone}
                  </div>
                  <h4 className="font-semibold">{label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isReached ? "✅ Achieved!" : `${milestone - daysCompleted} days to go`}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;