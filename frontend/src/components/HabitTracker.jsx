import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle2, Target } from 'lucide-react';

const HabitTracker = () => {
  const [habitData, setHabitData] = useState({});

  // Initialize habit data
  useEffect(() => {
    const savedData = localStorage.getItem('habitTrackerData');
    if (savedData) {
      setHabitData(JSON.parse(savedData));
    } else {
      // Initialize with empty data for 30 days and 6 habits
      const initialData = {};
      for (let day = 1; day <= 30; day++) {
        initialData[day] = {
          habit1: false,
          habit2: false,
          habit3: false,
          habit4: false,
          habit5: false,
          habit6: false,
        };
      }
      setHabitData(initialData);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(habitData).length > 0) {
      localStorage.setItem('habitTrackerData', JSON.stringify(habitData));
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
    return Math.round((count / 30) * 100);
  };

  const getDayCompletion = (day) => {
    if (!habitData[day]) return 0;
    const completed = Object.values(habitData[day]).filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  };

  const habits = ['habit1', 'habit2', 'habit3', 'habit4', 'habit5', 'habit6'];
  const habitNames = [
    'No Social Media', 
    'No Songs', 
    'No Maggie/Chai/Coffee', 
    '1min Self Video Recording', 
    '45min Book Reading', 
    'Meditation'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Protocol Tracker
          </h1>
        </div>
        <p className="text-muted-foreground">Track your daily habits and build consistent routines</p>
      </div>

      {/* Habit Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {habits.map((habit, index) => (
          <Card key={habit} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{habitNames[index]}</p>
                  <p className="text-2xl font-bold">{getCompletionCount(habit)}/30</p>
                </div>
                <Badge variant={getCompletionPercentage(habit) >= 70 ? "default" : "secondary"}>
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
            <CardTitle>30-Day Habit Tracker</CardTitle>
          </div>
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
                  {habitNames.map((name, index) => (
                    <th key={name} className="p-3 text-center font-medium min-w-[100px]">
                      {name}
                    </th>
                  ))}
                  <th className="p-3 text-center font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <tr key={day} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="sticky left-0 z-10 bg-background p-3 font-medium border-r">
                      Day {day}
                    </td>
                    {habits.map((habit, habitIndex) => (
                      <td key={habit} className="p-3 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={habitData[day]?.[habit] || false}
                            onCheckedChange={(checked) => handleHabitChange(day, habit, checked)}
                            className="h-5 w-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 hover:border-green-400 transition-colors"
                          />
                        </div>
                      </td>
                    ))}
                    <td className="p-3 text-center">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;