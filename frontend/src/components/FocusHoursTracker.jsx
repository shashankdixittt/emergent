import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, TrendingUp, Zap } from 'lucide-react';

const FocusHoursTracker = () => {
  const [focusData, setFocusData] = useState({});

  const hourOptions = [0, 2, 4, 6, 8, 10];
  const days = Array.from({ length: 90 }, (_, i) => i + 1);

  // Initialize focus data
  useEffect(() => {
    const savedData = localStorage.getItem('focusHoursData');
    if (savedData) {
      try {
        setFocusData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading focus data:', error);
        setFocusData({});
      }
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
    return Math.round((total / 90) * 10) / 10;
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
    for (let i = 90; i >= 1; i--) {
      if (focusData[i] >= 4) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { current: currentStreak, max: maxStreak };
  };

  const get90DayGoals = () => {
    const total = getTotalHours();
    return {
      goal90: { target: 90, progress: Math.min(100, (total / 90) * 100), achieved: total >= 90 },
      goal180: { target: 180, progress: Math.min(100, (total / 180) * 100), achieved: total >= 180 },
      goal360: { target: 360, progress: Math.min(100, (total / 360) * 100), achieved: total >= 360 }
    };
  };

  const streak = getStreakInfo();
  const goals = get90DayGoals();

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Focus Hours Tracker - 90 Days
          </h1>
        </div>
        <p className="text-muted-foreground">Visual tracking of your daily focused work sessions over 90 days</p>
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

      {/* 90-Day Focus Goals */}
      <Card>
        <CardHeader>
          <CardTitle>90-Day Focus Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(goals).map(([key, goal]) => (
              <div key={key} className={`p-4 rounded-lg border-2 ${goal.achieved ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{goal.target}hrs Challenge</h4>
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
            <CardTitle>90-Day Focus Hours Grid</CardTitle>
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
          
          {/* Enhanced Trend Visualization */}
          <div className="p-6 border-t bg-gradient-to-br from-slate-50 to-blue-50">
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2 text-slate-700">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              90-Day Focus Journey Visualization
            </h4>
            
            {/* Chart Container */}
            <div className="relative bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              {/* Chart Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Progress Overview</span> • Visual representation of your focus hours across 90 days
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
                    High Focus (6-10h)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                    Medium Focus (2-5h)
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    No Focus (0h)
                  </span>
                </div>
              </div>
              
              {/* Enhanced SVG Chart */}
              <div className="relative">
                <svg 
                  className="w-full h-64 rounded-lg bg-gradient-to-br from-slate-50 via-white to-blue-50" 
                  viewBox="0 0 1000 200"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}
                >
                  <defs>
                    {/* Enhanced Gradients */}
                    <linearGradient id="mainTrendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
                    </linearGradient>
                    
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Background Grid */}
                  {[40, 80, 120, 160].map(y => (
                    <line key={y} x1="50" y1={y} x2="950" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                  ))}
                  
                  {/* Week Markers */}
                  {Array.from({ length: 12 }, (_, i) => (i + 1) * 7).filter(weekDay => weekDay <= 90).map(weekDay => {
                    const x = 50 + ((weekDay - 1) / 89) * 900;
                    return (
                      <line key={weekDay} x1={x} y1="20" x2={x} y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,4" />
                    );
                  })}
                  
                  {/* Area under curve */}
                  {(() => {
                    const pathPoints = days.map(day => {
                      const hours = focusData[day] || 0;
                      const x = 50 + ((day - 1) / 89) * 900;
                      const y = 160 - (hours / 10) * 120;
                      return `${x},${y}`;
                    });
                    
                    if (pathPoints.length === 0) return null;
                    
                    const pathD = `M 50,160 L ${pathPoints.join(' L ')} L 950,160 Z`;
                    
                    return (
                      <path
                        d={pathD}
                        fill="url(#areaGradient)"
                        opacity="0.6"
                      />
                    );
                  })()}
                  
                  {/* Main Trend Line */}
                  {(() => {
                    const pathPoints = days.map(day => {
                      const hours = focusData[day] || 0;
                      const x = 50 + ((day - 1) / 89) * 900;
                      const y = 160 - (hours / 10) * 120;
                      return `${x},${y}`;
                    });
                    
                    if (pathPoints.length === 0) return null;
                    
                    return (
                      <path
                        d={`M ${pathPoints.join(' L ')}`}
                        stroke="url(#mainTrendGradient)"
                        strokeWidth="3"
                        fill="none"
                        filter="url(#glow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    );
                  })()}
                  
                  {/* Enhanced Data Points */}
                  {days.map(day => {
                    const hours = focusData[day] || 0;
                    const x = 50 + ((day - 1) / 89) * 900;
                    const y = 160 - (hours / 10) * 120;
                    
                    if (hours === 0) return null;
                    
                    const pointColor = hours >= 6 ? '#10b981' : hours >= 2 ? '#f59e0b' : '#6b7280';
                    const pointSize = hours >= 8 ? 4 : hours >= 4 ? 3 : 2;
                    
                    return (
                      <g key={`point-${day}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r={pointSize + 1}
                          fill="white"
                          stroke={pointColor}
                          strokeWidth="2"
                          opacity="0.9"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r={pointSize}
                          fill={pointColor}
                        />
                        
                        {/* Highlight peak days */}
                        {hours >= 8 && (
                          <circle
                            cx={x}
                            cy={y}
                            r="8"
                            fill="none"
                            stroke={pointColor}
                            strokeWidth="1"
                            opacity="0.3"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Milestone Markers */}
                  {[30, 60, 90].map(milestone => {
                    const x = 50 + ((milestone - 1) / 89) * 900;
                    return (
                      <g key={`milestone-${milestone}`}>
                        <line x1={x} y1="15" x2={x} y2="185" stroke="#8b5cf6" strokeWidth="2" />
                        <rect x={x-15} y="10" width="30" height="12" fill="#8b5cf6" rx="6" />
                        <text x={x} y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                          {milestone}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Y-axis labels */}
                  {[0, 2, 4, 6, 8, 10].map(hours => {
                    const y = 160 - (hours / 10) * 120;
                    return (
                      <g key={`ylabel-${hours}`}>
                        <text x="40" y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontWeight="medium">
                          {hours}h
                        </text>
                        <circle cx="45" cy={y} r="1" fill="#cbd5e1" />
                      </g>
                    );
                  })}
                </svg>
                
                {/* Enhanced X-axis */}
                <div className="flex justify-between text-xs text-slate-500 mt-4 px-12">
                  <div className="text-center">
                    <div className="font-medium">Week 1</div>
                    <div className="text-xs opacity-70">Days 1-7</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Month 1</div>
                    <div className="text-xs opacity-70">Day 30</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Month 2</div>
                    <div className="text-xs opacity-70">Day 60</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Finish Line</div>
                    <div className="text-xs opacity-70">Day 90</div>
                  </div>
                </div>
              </div>
              
              {/* Chart Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {(() => {
                  const totalHours = getTotalHours();
                  const averageHours = getAverageHours();
                  const maxDay = Object.entries(focusData).reduce((max, [day, hours]) => 
                    hours > (focusData[max] || 0) ? day : max, '1');
                  const peakHours = focusData[maxDay] || 0;
                  
                  return (
                    <>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{totalHours}h</div>
                        <div className="text-xs text-blue-600">Total Progress</div>
                        <div className="text-xs text-blue-500 mt-1">
                          {Math.round((totalHours / 360) * 100)}% to 360h goal
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-700">{peakHours}h</div>
                        <div className="text-xs text-emerald-600">Peak Day</div>
                        <div className="text-xs text-emerald-500 mt-1">
                          Day {maxDay} • Best Performance
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="text-2xl font-bold text-purple-700">{averageHours}h</div>
                        <div className="text-xs text-purple-600">Daily Average</div>
                        <div className="text-xs text-purple-500 mt-1">
                          {averageHours >= 5 ? 'Excellent!' : averageHours >= 3 ? 'Good pace' : 'Room to grow'}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Enhanced Legend & Instructions */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactive Legend */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"></div>
                  Focus Hours Grid Legend
                </h5>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {hourOptions.map(hours => (
                    <div key={hours} className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                      <div className={`w-4 h-4 rounded-full border border-white shadow-sm ${getColorForHours(hours).split(' ')[0]}`}></div>
                      <span className="text-sm font-medium text-slate-700">{hours}h</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>💡 Pro Tip:</strong> Click the colored dots in the grid above to set your daily focus hours</p>
                  <p><strong>🎯 Target:</strong> Aim for consistent 4-6 hour daily sessions</p>
                </div>
              </div>
              
              {/* Progress Insights */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <h5 className="font-semibold text-emerald-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  100-Day Challenge Insights
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Challenge Progress:</span>
                    <span className="font-semibold text-emerald-800">{Math.round((getTotalHours() / 500) * 100)}% to 500h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Days Tracked:</span>
                    <span className="font-semibold text-emerald-800">{Object.keys(focusData).length}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">Productive Days (4h+):</span>
                    <span className="font-semibold text-emerald-800">
                      {Object.values(focusData).filter(h => h >= 4).length} days
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-100 rounded-lg">
                  <p className="text-xs text-emerald-700">
                    <strong>🏆 Challenge Milestones:</strong><br/>
                    100hrs (Beginner) • 250hrs (Intermediate) • 500hrs (Expert)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusHoursTracker;