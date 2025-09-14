import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

const TimeTracker = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('');
  const [currentProject, setCurrentProject] = useState('Work');
  const [timeEntries, setTimeEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState(null);

  const projects = ['Work', 'Personal', 'Learning', 'Exercise', 'Focus Time', 'Reading', 'Meditation'];

  // Load saved time entries
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries).map(entry => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: new Date(entry.endTime)
      })));
    }
  }, []);

  // Save time entries to localStorage
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
    }
  }, [timeEntries]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const startTimer = () => {
    if (!currentActivity.trim()) {
      alert('Please enter an activity description');
      return;
    }
    setIsRunning(true);
    setCurrentTime(0);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    if (currentTime === 0) return;
    
    const now = new Date();
    const startTime = new Date(now.getTime() - currentTime * 1000);
    
    const newEntry = {
      id: Date.now(),
      activity: currentActivity,
      project: currentProject,
      duration: currentTime,
      startTime: startTime,
      endTime: now,
      date: now.toDateString()
    };

    setTimeEntries(prev => [newEntry, ...prev]);
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentActivity('');
  };

  const deleteEntry = (id) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getProjectColor = (project) => {
    const colors = {
      'Work': 'bg-blue-500',
      'Personal': 'bg-green-500',
      'Learning': 'bg-purple-500',
      'Exercise': 'bg-red-500',
      'Focus Time': 'bg-orange-500',
      'Reading': 'bg-yellow-500',
      'Meditation': 'bg-indigo-500'
    };
    return colors[project] || 'bg-gray-500';
  };

  const getEntriesForDate = (date) => {
    const dateString = date.toDateString();
    return timeEntries.filter(entry => entry.date === dateString);
  };

  const getDayTotal = (date) => {
    const entries = getEntriesForDate(date);
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const weekDays = getWeekDays(selectedDate);
  const selectedDateEntries = getEntriesForDate(selectedDate);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Time Tracker
          </h1>
        </div>
        <p className="text-muted-foreground">Track your time like Toggl - start, stop, and analyze your productivity</p>
      </div>

      {/* Timer Interface */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Timer Display */}
            <div className="text-6xl font-mono font-bold text-green-700">
              {formatTime(currentTime)}
            </div>
            
            {/* Activity Input */}
            <div className="flex gap-4 w-full max-w-2xl">
              <Input
                placeholder="What are you working on?"
                value={currentActivity}
                onChange={(e) => setCurrentActivity(e.target.value)}
                className="flex-1"
                disabled={isRunning}
              />
              <select
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="px-3 py-2 border rounded-md"
                disabled={isRunning}
              >
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-4">
              {!isRunning ? (
                <Button 
                  onClick={startTimer}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseTimer}
                    size="lg"
                    variant="outline"
                    className="px-8"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                  <Button 
                    onClick={stopTimer}
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Weekly Time Overview
            </CardTitle>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                Week of {weekDays[0].toLocaleDateString()}
              </span>
              <Button variant="outline" size="sm" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                {day}
              </div>
            ))}
            
            {/* Day Cells */}
            {weekDays.map((day, index) => {
              const dayEntries = getEntriesForDate(day);
              const dayTotal = getDayTotal(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = day.toDateString() === selectedDate.toDateString();
              
              return (
                <div 
                  key={index}
                  className={`border rounded-lg p-3 min-h-[120px] cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 
                    isToday ? 'border-green-500 bg-green-50' : 
                    'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-sm font-medium mb-2">
                    {day.getDate()}
                  </div>
                  
                  {dayTotal > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-green-600">
                        {formatDuration(dayTotal)}
                      </div>
                      <div className="space-y-1">
                        {dayEntries.slice(0, 2).map(entry => (
                          <div key={entry.id} className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getProjectColor(entry.project)}`}></div>
                            <div className="text-xs truncate">{entry.activity}</div>
                          </div>
                        ))}
                        {dayEntries.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEntries.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {selectedDate.toLocaleDateString()} - Time Entries
            <Badge variant="outline">
              Total: {formatDuration(getDayTotal(selectedDate))}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time entries for this day
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${getProjectColor(entry.project)}`}></div>
                    <div>
                      <div className="font-medium">{entry.activity}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.project} • {entry.startTime.toLocaleTimeString()} - {entry.endTime.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {formatDuration(entry.duration)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {timeEntries.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatDuration(timeEntries.reduce((total, entry) => total + entry.duration, 0))}
            </div>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatDuration(getDayTotal(new Date()))}
            </div>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {timeEntries.length > 0 ? formatDuration(Math.round(timeEntries.reduce((total, entry) => total + entry.duration, 0) / timeEntries.length)) : '0m'}
            </div>
            <p className="text-sm text-muted-foreground">Avg Session</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimeTracker;