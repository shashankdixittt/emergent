import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  Trophy
} from 'lucide-react';

const Dashboard = () => {
  const [habitData, setHabitData] = useState({});
  const [focusData, setFocusData] = useState({});
  const [currentDate] = useState(new Date());

  useEffect(() => {
    // Clear all old data for fresh start
    const shouldClearData = !localStorage.getItem('dataCleared');
    
    if (shouldClearData) {
      // Clear all habit tracker related data
      localStorage.removeItem('habitTrackerData');
      localStorage.removeItem('focusHoursData'); 
      localStorage.removeItem('timeEntries');
      localStorage.removeItem('personalGoals');
      
      // Mark data as cleared
      localStorage.setItem('dataCleared', 'true');
      
      // Set empty initial states
      setHabitData({});
      setFocusData({});
    } else {
      // Load habit data
      const savedHabits = localStorage.getItem('habitTrackerData');
      if (savedHabits) {
        setHabitData(JSON.parse(savedHabits));
      }

      // Load focus data
      const savedFocus = localStorage.getItem('focusHoursData');
      if (savedFocus) {
        setFocusData(JSON.parse(savedFocus));
      }
    }
  }, []);

  const habitNames = [
    'No Social Media', 
    'No Songs', 
    'No Maggie/Chai/Coffee', 
    '1min Self Video Recording', 
    '45min Book Reading', 
    'Meditation'
  ];

  const getCurrentDayOfChallenge = () => {
    // For demo purposes, we'll use the current date of month
    // In a real app, this would be calculated from the challenge start date
    return Math.min(currentDate.getDate(), 100);
  };

  const getTodaysProgress = () => {
    const today = getCurrentDayOfChallenge();
    if (!habitData[today]) return 0;
    const completed = Object.values(habitData[today]).filter(Boolean).length;
    return Math.round((completed / 6) * 100);
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
    const today = getCurrentDayOfChallenge();
    let streak = 0;
    
    for (let day = today; day >= 1; day--) {
      if (habitData[day]) {
        const completed = Object.values(habitData[day]).filter(Boolean).length;
        if (completed >= 4) { // At least 4 habits completed
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
    return { daysTracked, progressPercentage };
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
              <p className="text-blue-600">Day {challengeProgress.daysTracked} of 100</p>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {challengeProgress.progressPercentage}%
            </div>
          </div>
          <Progress value={challengeProgress.progressPercentage} className="h-3" />
          <p className="text-sm text-blue-700 mt-2">
            {100 - challengeProgress.daysTracked} days remaining
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

      {/* Weekly Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Week's Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Daily Habits</span>
                <Badge variant="outline">{weeklyStats.avgHabits}/6</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Focus Hours</span>
                <Badge variant="outline">{weeklyStats.totalFocus}h</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Daily Focus Average</span>
                <Badge variant="outline">{weeklyStats.avgFocus}h</Badge>
              </div>
              <Progress value={(weeklyStats.avgHabits / 6) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Habit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-green-600">{topHabit.name}</div>
              <div className="text-3xl font-bold">{topHabit.percentage}%</div>
              <p className="text-sm text-muted-foreground">
                Completed {topHabit.count} out of 100 days
              </p>
              <Progress value={topHabit.percentage} className="mt-2" />
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

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            100-Day Challenge Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Consistency Score</h4>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((getTotalHabitsCompleted() / 600) * 100)}%
              </div>
              <p className="text-sm text-blue-600">Overall completion rate</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Days Tracked</h4>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(habitData).length}
              </div>
              <p className="text-sm text-purple-600">Out of 100 days</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Focus Target</h4>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((getTotalFocusHours() / 1000) * 100)}%
              </div>
              <p className="text-sm text-green-600">Of target 1000h/100days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;