import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, Zap } from 'lucide-react';

const FocusHoursTracker = () => {
  const [focusData, setFocusData] = useState({});

  const hourOptions = [0, 2, 4, 6, 8, 10];
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Initialize focus data
  useEffect(() => {
    const savedData = localStorage.getItem('focusHoursData');
    if (savedData) {
      setFocusData(JSON.parse(savedData));
    } else {
      // Initialize with some sample data
      const initialData = {};
      for (let day = 1; day <= 30; day++) {
        initialData[day] = Math.floor(Math.random() * 6) * 2; // Random hours: 0,2,4,6,8,10
      }
      setFocusData(initialData);
    }
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
    return Math.round((total / 30) * 10) / 10;
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
    for (let i = 30; i >= 1; i--) {
      if (focusData[i] >= 4) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { current: currentStreak, max: maxStreak };
  };

  const streak = getStreakInfo();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Focus Hours Tracker
          </h1>
        </div>
        <p className="text-muted-foreground">Visual tracking of your daily focused work sessions</p>
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

      {/* Main Focus Hours Grid */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <CardTitle>30-Day Focus Hours Grid</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Click on dots to set focus hours for each day. Lines connect daily progress.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] relative">
              {/* Headers */}
              <div className="flex mb-4">
                <div className="w-16 flex items-center justify-center text-sm font-medium text-muted-foreground"></div>
                <div className="flex-1 grid grid-cols-30 gap-2">
                  {days.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      D{day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hour rows */}
              {hourOptions.slice().reverse().map(hours => (
                <div key={hours} className="flex mb-2 items-center">
                  {/* Hour label */}
                  <div className="w-16 h-12 flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted/30 rounded mr-2">
                    {hours}h
                  </div>
                  
                  {/* Day cells for this hour */}
                  <div className="flex-1 grid grid-cols-30 gap-2">
                    {days.map(day => {
                      const isActive = focusData[day] === hours;
                      const isSelected = selectedCell?.day === day && selectedCell?.hours === hours;
                      
                      return (
                        <div key={`${day}-${hours}`} className="h-12 flex items-center justify-center">
                          <button
                            onClick={() => handleCellClick(day, hours)}
                            className={`
                              w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 hover:shadow-md
                              ${isActive 
                                ? `${getColorForHours(hours)} border-white shadow-md ${getIntensityClass(hours)}` 
                                : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                              }
                              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                            `}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Connection lines - Simple line graph */}
              <div className="mt-6 relative">
                <svg 
                  className="w-full h-32" 
                  viewBox={`0 0 ${days.length * 30} 100`}
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  
                  {/* Connection lines */}
                  {days.slice(0, -1).map(day => {
                    const currentHours = focusData[day] || 0;
                    const nextHours = focusData[day + 1] || 0;
                    
                    const currentX = (day - 1) * 30 + 15;
                    const nextX = day * 30 + 15;
                    
                    // Y position (inverted - 0 is at top, 100 at bottom)
                    const currentY = 90 - (currentHours / 10) * 80;
                    const nextY = 90 - (nextHours / 10) * 80;
                    
                    const strokeColor = currentHours > nextHours ? '#ef4444' : 
                                     currentHours < nextHours ? '#10b981' : '#6b7280';
                    
                    return (
                      <g key={`line-${day}`}>
                        <line
                          x1={currentX}
                          y1={currentY}
                          x2={nextX}
                          y2={nextY}
                          stroke={strokeColor}
                          strokeWidth="2"
                          strokeOpacity="0.8"
                        />
                        {/* Data points */}
                        <circle
                          cx={currentX}
                          cy={currentY}
                          r="4"
                          fill="url(#lineGradient)"
                          stroke="white"
                          strokeWidth="2"
                        />
                        {day === 29 && (
                          <circle
                            cx={nextX}
                            cy={nextY}
                            r="4"
                            fill="url(#lineGradient)"
                            stroke="white"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
                
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Day 1</span>
                  <span>Day 15</span>
                  <span>Day 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-2">Focus Hours Legend:</p>
            <div className="flex flex-wrap gap-4">
              {hourOptions.map(hours => (
                <div key={hours} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getColorForHours(hours)}`}></div>
                  <span className="text-sm">{hours}h</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Lines: 🟢 Green (increase) • 🔴 Red (decrease) • ⚫ Gray (same)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusHoursTracker;