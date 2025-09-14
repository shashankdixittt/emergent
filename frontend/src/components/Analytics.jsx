import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  Target,
  Activity
} from 'lucide-react';

const Analytics = () => {
  const [habitData, setHabitData] = useState({});
  const [focusData, setFocusData] = useState({});

  useEffect(() => {
    const savedHabits = localStorage.getItem('habitTrackerData');
    if (savedHabits) {
      setHabitData(JSON.parse(savedHabits));
    }

    const savedFocus = localStorage.getItem('focusHoursData');
    if (savedFocus) {
      setFocusData(JSON.parse(savedFocus));
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

  const getHabitAnalytics = () => {
    const analytics = habitNames.map((name, index) => {
      const habitKey = `habit${index + 1}`;
      let completed = 0;
      let streak = 0;
      let longestStreak = 0;
      let currentStreak = 0;

      // Count completions and streaks
      for (let day = 1; day <= 100; day++) {
        if (habitData[day] && habitData[day][habitKey]) {
          completed++;
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      // Calculate current streak from the end
      for (let day = 100; day >= 1; day--) {
        if (habitData[day] && habitData[day][habitKey]) {
          streak++;
        } else {
          break;
        }
      }

      return {
        name,
        completed,
        percentage: Math.round((completed / 100) * 100),
        currentStreak: streak,
        longestStreak,
        consistency: completed >= 70 ? 'High' : completed >= 50 ? 'Medium' : 'Low'
      };
    });

    return analytics.sort((a, b) => b.percentage - a.percentage);
  };

  const getWeeklyBreakdown = () => {
    const weeks = [];
    for (let week = 0; week < 14; week++) { // 14 weeks for 100 days
      const weekStart = week * 7 + 1;
      const weekEnd = Math.min((week + 1) * 7, 100);
      
      let weekHabits = 0;
      let weekFocus = 0;
      let daysInWeek = 0;

      for (let day = weekStart; day <= weekEnd; day++) {
        daysInWeek++;
        if (habitData[day]) {
          weekHabits += Object.values(habitData[day]).filter(Boolean).length;
        }
        if (focusData[day]) {
          weekFocus += focusData[day];
        }
      }

      weeks.push({
        week: week + 1,
        avgHabits: Math.round((weekHabits / daysInWeek) * 10) / 10,
        totalFocus: weekFocus,
        avgFocus: Math.round((weekFocus / daysInWeek) * 10) / 10,
        daysInWeek
      });
    }
    return weeks;
  };

  const getMonthlyBreakdown = () => {
    const months = [];
    for (let month = 0; month < 4; month++) { // 4 months for 100 days (25 days each)
      const monthStart = month * 25 + 1;
      const monthEnd = Math.min((month + 1) * 25, 100);
      
      let monthHabits = 0;
      let monthFocus = 0;
      let daysInMonth = 0;

      for (let day = monthStart; day <= monthEnd; day++) {
        daysInMonth++;
        if (habitData[day]) {
          monthHabits += Object.values(habitData[day]).filter(Boolean).length;
        }
        if (focusData[day]) {
          monthFocus += focusData[day];
        }
      }

      months.push({
        month: month + 1,
        avgHabits: Math.round((monthHabits / daysInMonth) * 10) / 10,
        totalFocus: monthFocus,
        avgFocus: Math.round((monthFocus / daysInMonth) * 10) / 10,
        daysInMonth,
        range: `Days ${monthStart}-${monthEnd}`
      });
    }
    return months;
  };

  const getFocusAnalytics = () => {
    const hours = Object.values(focusData);
    const total = hours.reduce((sum, h) => sum + (h || 0), 0);
    const avg = hours.length > 0 ? Math.round((total / hours.length) * 10) / 10 : 0;
    const max = Math.max(...hours.map(h => h || 0));
    
    // Distribution of focus hours
    const distribution = { 0: 0, 2: 0, 4: 0, 6: 0, 8: 0, 10: 0 };
    hours.forEach(h => {
      if (distribution.hasOwnProperty(h)) {
        distribution[h]++;
      }
    });

    // Productive days (4+ hours)
    const productiveDays = hours.filter(h => (h || 0) >= 4).length;

    return {
      total,
      average: avg,
      max,
      distribution,
      productiveDays,
      productivityRate: Math.round((productiveDays / 100) * 100)
    };
  };

  const getPatternInsights = () => {
    const insights = [];
    
    // Best performing day pattern
    const dayPerformance = {};
    for (let day = 1; day <= 100; day++) {
      if (habitData[day]) {
        const completed = Object.values(habitData[day]).filter(Boolean).length;
        const weekday = ((day - 1) % 7) + 1; // 1-7 for Monday-Sunday
        if (!dayPerformance[weekday]) dayPerformance[weekday] = [];
        dayPerformance[weekday].push(completed);
      }
    }

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const bestDay = Object.keys(dayPerformance).reduce((best, day) => {
      const avg = dayPerformance[day].reduce((sum, score) => sum + score, 0) / dayPerformance[day].length;
      const bestAvg = dayPerformance[best] ? dayPerformance[best].reduce((sum, score) => sum + score, 0) / dayPerformance[best].length : 0;
      return avg > bestAvg ? day : best;
    }, '1');

    if (dayPerformance[bestDay]) {
      insights.push({
        title: "Best Performance Day",
        value: dayNames[parseInt(bestDay) - 1],
        description: `You perform best on ${dayNames[parseInt(bestDay) - 1]}s`
      });
    }

    // Focus hour patterns
    const focusHours = Object.entries(focusData);
    const highFocusDays = focusHours.filter(([_, hours]) => hours >= 6).length;
    
    if (highFocusDays > 0) {
      insights.push({
        title: "Deep Focus Sessions",
        value: `${highFocusDays} days`,
        description: `${highFocusDays} days with 6+ focus hours`
      });
    }

    // 100-day challenge insights
    const totalDays = Object.keys(habitData).length;
    const challengeProgress = Math.round((totalDays / 100) * 100);
    
    insights.push({
      title: "Challenge Progress",
      value: `${challengeProgress}%`,
      description: `Completed ${totalDays} out of 100 days`
    });

    return insights;
  };

  const habitAnalytics = getHabitAnalytics();
  const weeklyBreakdown = getWeeklyBreakdown();
  const monthlyBreakdown = getMonthlyBreakdown();
  const focusAnalytics = getFocusAnalytics();
  const patternInsights = getPatternInsights();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            100-Day Challenge Analytics
          </h1>
        </div>
        <p className="text-muted-foreground">Deep insights into your habits and productivity patterns over 100 days</p>
      </div>

      <Tabs defaultValue="habits" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Habits
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="habits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>100-Day Habit Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habitAnalytics.map((habit, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{habit.name}</h4>
                      <Badge variant={habit.consistency === 'High' ? 'default' : habit.consistency === 'Medium' ? 'secondary' : 'outline'}>
                        {habit.consistency}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completion:</span>
                        <div className="font-bold text-lg">{habit.percentage}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Days Done:</span>
                        <div className="font-bold text-lg">{habit.completed}/100</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Streak:</span>
                        <div className="font-bold text-lg">{habit.currentStreak}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Best Streak:</span>
                        <div className="font-bold text-lg">{habit.longestStreak}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{focusAnalytics.total}h</div>
                <p className="text-muted-foreground">100-day challenge</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{focusAnalytics.average}h</div>
                <p className="text-muted-foreground">Per day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productivity Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{focusAnalytics.productivityRate}%</div>
                <p className="text-muted-foreground">Days with 4+ hours</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Focus Hours Distribution (100 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(focusAnalytics.distribution).map(([hours, count]) => (
                  <div key={hours} className="flex items-center justify-between">
                    <span className="font-medium">{hours} hours</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{count} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Breakdown (14 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {weeklyBreakdown.map((week) => (
                  <div key={week.week} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">Week {week.week}</h4>
                      <Badge variant="outline">{week.daysInWeek} days</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{week.avgHabits}</div>
                        <p className="text-muted-foreground text-xs">Avg Habits/Day</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{week.totalFocus}h</div>
                        <p className="text-muted-foreground text-xs">Total Focus</p>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{week.avgFocus}h</div>
                        <p className="text-muted-foreground text-xs">Avg Focus/Day</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown (25-Day Periods)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyBreakdown.map((month) => (
                  <div key={month.month} className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Period {month.month}</h4>
                        <p className="text-muted-foreground text-sm">{month.range}</p>
                      </div>
                      <Badge variant="outline">{month.daysInMonth} days</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{month.avgHabits}</div>
                        <p className="text-muted-foreground">Avg Habits/Day</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{month.totalFocus}h</div>
                        <p className="text-muted-foreground">Total Focus</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{month.avgFocus}h</div>
                        <p className="text-muted-foreground">Avg Focus/Day</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                100-Day Challenge Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patternInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">{insight.title}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{insight.value}</div>
                    <p className="text-sm text-blue-700">{insight.description}</p>
                  </div>
                ))}
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">Overall Consistency</h4>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {Math.round((Object.values(habitData).length / 100) * 100)}%
                  </div>
                  <p className="text-sm text-green-700">Days with tracked habits</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-1">Peak Focus</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-2">{focusAnalytics.max}h</div>
                  <p className="text-sm text-purple-700">Maximum focus in a single day</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-1">Challenge Target</h4>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {Math.round((focusAnalytics.total / 1000) * 100)}%
                  </div>
                  <p className="text-sm text-orange-700">Progress towards 1000h goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;