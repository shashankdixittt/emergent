import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, Zap } from 'lucide-react';

const FocusHoursTracker = () => {
  const [focusData, setFocusData] = useState({});

  const hourOptions = [0, 2, 4, 6, 8, 10];
  const days = Array.from({ length: 100 }, (_, i) => i + 1);

  // Initialize focus data
  useEffect(() => {
    // Always start with empty data - force clear for fresh start
    localStorage.removeItem('focusHoursData');
    setFocusData({});
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (Object.keys(focusData).length > 0) {
      localStorage.setItem('focusHoursData', JSON.stringify(focusData));
    }
  }, [focusData]);

  const handleCellClick = (day, hours) => {
    setFocusData(prev => ({
      ...prev,
      [day]: hours
    }));
  };

  const getColorForHours = (hours) => {
    const colors = {
      0: 'bg-gray-300 hover:bg-gray-400',
      2: 'bg-yellow-400 hover:bg-yellow-500',
      4: 'bg-orange-500 hover:bg-orange-600',
      6: 'bg-red-500 hover:bg-red-600',
      8: 'bg-purple-600 hover:bg-purple-700',
      10: 'bg-blue-600 hover:bg-blue-700'
    };
    return colors[hours] || 'bg-gray-300 hover:bg-gray-400';
  };

  const getTotalHours = () => {
    return Object.values(focusData).reduce((sum, hours) => sum + hours, 0);
  };

  const getAverageHours = () => {
    const total = getTotalHours();
    return Math.round((total / 100) * 10) / 10;
  };

  const getStreakInfo = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    days.forEach(day => {
      if (focusData[day] >= 4) { // Streak if >= 4 hours
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak from the end
    for (let i = 100; i >= 1; i--) {
      if (focusData[i] >= 4) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { current: currentStreak, max: maxStreak };
  };

  const get100DayGoals = () => {
    const total = getTotalHours();
    return {
      goal500: { target: 500, progress: Math.min(100, (total / 500) * 100), achieved: total >= 500 },
      goal750: { target: 750, progress: Math.min(100, (total / 750) * 100), achieved: total >= 750 },
      goal1000: { target: 1000, progress: Math.min(100, (total / 1000) * 100), achieved: total >= 1000 }
    };
  };

  const streak = getStreakInfo();
  const goals = get100DayGoals();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Focus Hours Tracker - 100 Days
          </h1>
        </div>
        <p className="text-muted-foreground">Visual tracking of your daily focused work sessions over 100 days</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold">{getTotalHours()}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Average</p>
                <p className="text-2xl font-bold">{getAverageHours()}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{streak.current}d</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                <p className="text-2xl font-bold">{streak.max}d</p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                4h+ days
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 100-Day Focus Goals */}
      <Card>
        <CardHeader>
          <CardTitle>100-Day Focus Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(goals).map(([key, goal]) => (
              <div key={key} className={`p-4 rounded-lg border-2 ${goal.achieved ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{goal.target}h Challenge</h4>
                  {goal.achieved && <span className="text-green-600">🎯</span>}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(goal.progress)}% Complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Focus Hours Grid */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <CardTitle>100-Day Focus Hours Grid</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Click on dots to set focus hours for each day. Graph shows daily trends.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* Tabular Grid */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="sticky left-0 z-10 bg-muted/50 p-3 text-center font-medium border-r">
                    Hours
                  </th>
                  {days.map(day => (
                    <th key={day} className="p-2 text-center font-medium text-xs min-w-[35px]">
                      {day % 10 === 0 ? `D${day}` : day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hourOptions.slice().reverse().map(hours => (
                  <tr key={hours} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="sticky left-0 z-10 bg-background p-3 font-medium text-center border-r">
                      {hours}hrs
                    </td>
                    {days.map(day => (
                      <td key={`${hours}-${day}`} className="p-1 text-center">
                        <button
                          onClick={() => handleCellClick(day, hours)}
                          className={`
                            w-5 h-5 rounded-full border border-white transition-all duration-200 
                            hover:scale-125 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-blue-500
                            ${focusData[day] === hours 
                              ? `${getColorForHours(hours)} shadow-md` 
                              : 'bg-gray-200 hover:bg-gray-300'
                            }
                          `}
                          title={`Set ${hours} hours for Day ${day}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Trend Line Graph */}
          <div className="p-6 border-t">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              100-Day Progress Trend
            </h4>
            <div className="relative">
              <svg 
                className="w-full h-40 border rounded-lg bg-muted/20" 
                viewBox="0 0 3000 150"
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[25, 50, 75, 100, 125].map(y => (
                  <line key={y} x1="0" y1={y} x2="3000" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                ))}
                
                {/* Week markers */}
                {Array.from({ length: 14 }, (_, i) => (i + 1) * 7).map(weekDay => (
                  <line key={weekDay} x1={weekDay * 30} y1="0" x2={weekDay * 30} y2="150" stroke="#d1d5db" strokeWidth="1" strokeDasharray="2,2" />
                ))}
                
                {/* Trend line and dots */}
                {days.slice(0, -1).map(day => {
                  const currentHours = focusData[day] || 0;
                  const nextHours = focusData[day + 1] || 0;
                  
                  const currentX = (day - 1) * 30 + 15;
                  const nextX = day * 30 + 15;
                  
                  // Y position (inverted - 0 is at bottom, 150 at top)
                  const currentY = 125 - (currentHours / 10) * 100;
                  const nextY = 125 - (nextHours / 10) * 100;
                  
                  const strokeColor = currentHours > nextHours ? '#ef4444' : 
                                   currentHours < nextHours ? '#10b981' : '#6b7280';
                  
                  return (
                    <g key={`trend-${day}`}>
                      {/* Connection line */}
                      <line
                        x1={currentX}
                        y1={currentY}
                        x2={nextX}
                        y2={nextY}
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeOpacity="0.8"
                      />
                      {/* Data point */}
                      <circle
                        cx={currentX}
                        cy={currentY}
                        r="2"
                        fill="url(#trendGradient)"
                        stroke="white"
                        strokeWidth="1"
                      />
                      {/* Last point */}
                      {day === 99 && (
                        <circle
                          cx={nextX}
                          cy={nextY}
                          r="2"
                          fill="url(#trendGradient)"
                          stroke="white"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
              
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Day 1</span>
                <span>Day 25</span>
                <span>Day 50</span>
                <span>Day 75</span>
                <span>Day 100</span>
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-muted-foreground -ml-8">
                <span>10h</span>
                <span>8h</span>
                <span>6h</span>
                <span>4h</span>
                <span>2h</span>
                <span>0h</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 pt-0">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-3">Focus Hours Legend:</p>
              <div className="flex flex-wrap gap-4 mb-3">
                {hourOptions.map(hours => (
                  <div key={hours} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border border-white ${getColorForHours(hours).split(' ')[0]}`}></div>
                    <span className="text-sm">{hours}h</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <p><strong>Trend Lines:</strong> 🟢 Green (increasing) • 🔴 Red (decreasing) • ⚫ Gray (stable)</p>
                <p><strong>Usage:</strong> Click colored dots in the grid to set daily focus hours</p>
                <p><strong>100-Day Challenge:</strong> Aim for 500-1000 total focus hours!</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusHoursTracker;