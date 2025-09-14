import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Award, 
  Zap, 
  CheckCircle2, 
  BarChart3,
  Star,
  Flame,
  Trophy,
  Trash2
} from 'lucide-react';

const Dashboard = () => {
  const [habitData, setHabitData] = useState({});
  const [focusData, setFocusData] = useState({});
  const [currentDate] = useState(new Date());

  useEffect(() => {
    // Force clear all data for fresh start - this ensures we start from Day 0
    localStorage.removeItem('habitTrackerData');
    localStorage.removeItem('focusHoursData'); 
    localStorage.removeItem('timeEntries');
    localStorage.removeItem('personalGoals');
    localStorage.removeItem('dataCleared');
    
    // Set empty initial states
    setHabitData({});
    setFocusData({});
  }, []);

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset ALL data and start the 100-day challenge from Day 1? This will clear all habits, focus hours, time entries, and goals.')) {
      // Clear all stored data
      localStorage.removeItem('habitTrackerData');
      localStorage.removeItem('focusHoursData'); 
      localStorage.removeItem('timeEntries');
      localStorage.removeItem('personalGoals');
      localStorage.removeItem('dataCleared');
      
      // Reset all states
      setHabitData({});
      setFocusData({});
      
      // Reload the page to ensure fresh start
      window.location.reload();
    }
  };

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

  const getCurrentDayOfChallenge = () => {
    // Calculate based on actual habit data
    const daysTracked = Object.keys(habitData).length;
    return daysTracked; // Return actual days tracked (0 if no data)
  };

  const getTodaysProgress = () => {
    const daysTracked = Object.keys(habitData).length;
    if (daysTracked === 0) return 0; // No progress if no data
    
    const today = Math.max(1, daysTracked);
    if (!habitData[today]) return 0;
    const completed = Object.values(habitData[today]).filter(Boolean).length;
    return Math.round((completed / 10) * 100);
  };

  const getTotalHabitsCompleted = () => {
    let total = 0;
    Object.values(habitData).forEach(day => {
      if (day) {
        total += Object.values(day).filter(Boolean).length;
      }
    });
    return total;
  };

  const getTotalFocusHours = () => {
    return Object.values(focusData).reduce((sum, hours) => sum + (hours || 0), 0);
  };

  const getCurrentStreak = () => {
    const daysTracked = Object.keys(habitData).length;
    if (daysTracked === 0) return 0; // No streak if no data
    
    let streak = 0;
    for (let day = daysTracked; day >= 1; day--) {
      if (habitData[day]) {
        const completed = Object.values(habitData[day]).filter(Boolean).length;
        if (completed >= 7) { // At least 7 out of 10 habits completed
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeeklyStats = () => {
    const today = getCurrentDayOfChallenge();
    const weekStart = Math.max(1, today - 6);
    
    let weeklyHabits = 0;
    let weeklyFocus = 0;
    let daysCount = 0;

    for (let day = weekStart; day <= today; day++) {
      daysCount++;
      if (habitData[day]) {
        weeklyHabits += Object.values(habitData[day]).filter(Boolean).length;
      }
      if (focusData[day]) {
        weeklyFocus += focusData[day];
      }
    }

    return {
      avgHabits: Math.round((weeklyHabits / daysCount) * 10) / 10,
      totalFocus: weeklyFocus,
      avgFocus: Math.round((weeklyFocus / daysCount) * 10) / 10
    };
  };

  const getTopPerformingHabit = () => {
    const habitCounts = { habit1: 0, habit2: 0, habit3: 0, habit4: 0, habit5: 0, habit6: 0 };
    
    Object.values(habitData).forEach(day => {
      if (day) {
        Object.keys(habitCounts).forEach(habit => {
          if (day[habit]) habitCounts[habit]++;
        });
      }
    });

    const topHabit = Object.keys(habitCounts).reduce((a, b) => 
      habitCounts[a] > habitCounts[b] ? a : b
    );
    
    const habitIndex = parseInt(topHabit.replace('habit', '')) - 1;
    return {
      name: habitNames[habitIndex],
      count: habitCounts[topHabit],
      percentage: Math.round((habitCounts[topHabit] / 100) * 100)
    };
  };

  const get100DayProgress = () => {
    const daysTracked = Object.keys(habitData).length;
    const progressPercentage = Math.round((daysTracked / 100) * 100);
    return { 
      daysTracked: daysTracked || 0, // Ensure we show 0 for fresh start
      progressPercentage: progressPercentage || 0 
    };
  };

  const weeklyStats = getWeeklyStats();
  const topHabit = getTopPerformingHabit();
  const todayProgress = getTodaysProgress();
  const currentStreak = getCurrentStreak();
  const challengeProgress = get100DayProgress();

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first day",
      completed: getTotalHabitsCompleted() > 0,
      icon: <Target className="h-5 w-5" />
    },
    {
      title: "Week Warrior", 
      description: "7-day streak",
      completed: currentStreak >= 7,
      icon: <Flame className="h-5 w-5" />
    },
    {
      title: "Quarter Champion",
      description: "Complete 25 days",
      completed: challengeProgress.daysTracked >= 25,
      icon: <Award className="h-5 w-5" />
    },
    {
      title: "Halfway Hero",
      description: "Complete 50 days",
      completed: challengeProgress.daysTracked >= 50,
      icon: <Star className="h-5 w-5" />
    },
    {
      title: "Focus Master",
      description: "500+ focus hours",
      completed: getTotalFocusHours() >= 500,
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "100-Day Legend",
      description: "Complete the challenge",
      completed: challengeProgress.daysTracked >= 100,
      icon: <Trophy className="h-5 w-5" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            100-Day Challenge Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">Your comprehensive progress overview and insights</p>
      </div>

      {/* 100-Day Challenge Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-blue-800">100-Day Challenge Progress</h3>
              <p className="text-blue-600">
                {challengeProgress.daysTracked === 0 
                  ? "Ready to start your 100-day journey!" 
                  : `Day ${challengeProgress.daysTracked} of 100`}
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {challengeProgress.progressPercentage}%
            </div>
          </div>
          <Progress value={challengeProgress.progressPercentage} className="h-3" />
          <p className="text-sm text-blue-700 mt-2">
            {challengeProgress.daysTracked === 0 
              ? "Click on Protocols tab to start tracking your first day!"
              : `${100 - challengeProgress.daysTracked} days remaining`}
          </p>
        </CardContent>
      </Card>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
                <p className="text-3xl font-bold">{todayProgress}%</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-blue-600" />
            </div>
            <Progress value={todayProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">{currentStreak}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
              <Flame className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Habits</p>
                <p className="text-3xl font-bold">{getTotalHabitsCompleted()}</p>
                <p className="text-xs text-muted-foreground">completed</p>
              </div>
              <Target className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Focus Hours</p>
                <p className="text-3xl font-bold">{getTotalFocusHours()}</p>
                <p className="text-xs text-muted-foreground">total hours</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            100-Day Challenge Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.completed 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    achievement.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {achievement.icon}
                  </div>
                  {achievement.completed && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <h4 className="font-semibold">{achievement.title}</h4>
                <p className="text-sm opacity-80">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;