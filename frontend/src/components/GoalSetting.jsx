import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Calendar,
  Flag
} from 'lucide-react';

const GoalSetting = () => {
  const [goals, setGoals] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'habits',
    target: '',
    deadline: '',
    priority: 'medium'
  });
  const [habitData, setHabitData] = useState({});

  useEffect(() => {
    const savedGoals = localStorage.getItem('personalGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Initialize with some example goals for 100-day challenge
      const defaultGoals = [
        {
          id: Date.now() + 1,
          title: 'Complete 80% of habits in 100-day challenge',
          description: 'Maintain consistency in daily habits to build strong routines over 100 days',
          category: 'habits',
          target: '80%',
          deadline: '2025-05-08', // ~100 days from now
          priority: 'high',
          progress: 0,
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 2,
          title: 'Achieve 750 total focus hours',
          description: 'Increase productivity through focused work sessions over 100 days',
          category: 'productivity',
          target: '750 hours',
          deadline: '2025-05-08',
          priority: 'medium',
          progress: 0,
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 3,
          title: 'Reach 50-day milestone',
          description: 'Complete half of the 100-day challenge successfully',
          category: 'personal',
          target: '50 days',
          deadline: '2025-03-18', // ~50 days from now
          priority: 'high',
          progress: 0,
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() + 4,
          title: 'Maintain 14-day streak',
          description: 'Build momentum with a 2-week consistent habit streak',
          category: 'habits',
          target: '14 days',
          deadline: '2025-02-15', // ~2 weeks from now
          priority: 'medium',
          progress: 0,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ];
      setGoals(defaultGoals);
      localStorage.setItem('personalGoals', JSON.stringify(defaultGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('personalGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const savedHabitData = localStorage.getItem('habitTrackerData');
    if (savedHabitData) {
      setHabitData(JSON.parse(savedHabitData));
    }
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: Date.now(),
      ...newGoal,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'habits',
      target: '',
      deadline: '',
      priority: 'medium'
    });
    setIsCreating(false);
  };

  const handleUpdateGoal = (id, updates) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
        : goal
    ));
  };

  const calculateAutoProgress = (goal) => {
    const habitData = JSON.parse(localStorage.getItem('habitTrackerData') || '{}');
    const focusData = JSON.parse(localStorage.getItem('focusHoursData') || '{}');

    // 100-day challenge specific calculations
    if (goal.category === 'habits' && goal.title.includes('80%')) {
      const totalPossible = 600; // 100 days * 6 habits
      const completed = Object.values(habitData).reduce((sum, day) => {
        return sum + Object.values(day || {}).filter(Boolean).length;
      }, 0);
      return Math.round((completed / totalPossible) * 100);
    }

    if (goal.category === 'productivity' && goal.title.includes('750')) {
      const totalHours = Object.values(focusData).reduce((sum, hours) => sum + (hours || 0), 0);
      return Math.round((totalHours / 750) * 100);
    }

    if (goal.category === 'personal' && goal.title.includes('50-day')) {
      const daysTracked = Object.keys(habitData).length;
      return Math.round((daysTracked / 50) * 100);
    }

    if (goal.category === 'habits' && goal.title.includes('14-day')) {
      // Calculate current streak
      const daysTracked = Object.keys(habitData).sort((a, b) => b - a); // Reverse order
      let streak = 0;
      
      for (const day of daysTracked) {
        if (habitData[day]) {
          const completed = Object.values(habitData[day]).filter(Boolean).length;
          if (completed >= 4) { // At least 4 habits
            streak++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      return Math.round((Math.min(streak, 14) / 14) * 100);
    }

    return goal.progress;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'habits': return <Target className="h-4 w-4" />;
      case 'productivity': return <Clock className="h-4 w-4" />;
      case 'personal': return <Flag className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Target className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            100-Day Challenge Goals
          </h1>
        </div>
        <p className="text-muted-foreground">Set and track your personal development goals for the 100-day journey</p>
      </div>

      {/* Goal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
            <p className="text-sm text-muted-foreground">Total Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(g => g.completed).length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {goals.filter(g => !g.completed && calculateAutoProgress(g) > 50).length}
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {goals.filter(g => g.priority === 'high').length}
            </div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* 100-Day Challenge Milestones */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Flag className="h-5 w-5" />
            100-Day Challenge Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { milestone: 25, label: "Quarter Goal", description: "25% complete" },
              { milestone: 50, label: "Halfway Point", description: "50% complete" },
              { milestone: 75, label: "Final Stretch", description: "75% complete" },
              { milestone: 100, label: "Champion!", description: "Challenge Complete!" }
            ].map(({ milestone, label, description }) => {
              const daysCompleted = Object.keys(habitData).length;
              const isReached = daysCompleted >= milestone;
              
              return (
                <div key={milestone} className={`p-4 rounded-lg border-2 ${isReached ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                  <div className={`text-center ${isReached ? 'text-green-800' : 'text-gray-600'}`}>
                    <div className="text-2xl font-bold">{milestone}</div>
                    <h4 className="font-semibold">{label}</h4>
                    <p className="text-sm">{description}</p>
                    {isReached ? (
                      <Badge variant="default" className="mt-2 bg-green-600">✅ Achieved</Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2">
                        {daysCompleted === 0 ? `${milestone} days to go` : `${milestone - daysCompleted} days to go`}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create New Goal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your 100-Day Goals</CardTitle>
            <Button 
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <div className="space-y-4">
                <Input
                  placeholder="Goal title..."
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                />
                <Textarea
                  placeholder="Goal description..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    className="p-2 border rounded"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="habits">Habits</option>
                    <option value="productivity">Productivity</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                  </select>
                  <Input
                    placeholder="Target (e.g., 80%, 500 hours)"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                  />
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                  <select
                    className="p-2 border rounded"
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateGoal}>Create Goal</Button>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map(goal => {
              const progress = calculateAutoProgress(goal);
              const daysLeft = getDaysUntilDeadline(goal.deadline);
              
              return (
                <Card key={goal.id} className={`${goal.completed ? 'opacity-75' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-semibold ${goal.completed ? 'line-through' : ''}`}>
                            {goal.title}
                          </h3>
                          <Badge variant={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getCategoryIcon(goal.category)}
                            {goal.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{goal.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Target:</span>
                            <div className="font-medium">{goal.target}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline:</span>
                            <div className="font-medium flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(goal.deadline).toLocaleDateString()}
                              {daysLeft > 0 && (
                                <span className="text-xs text-orange-600">({daysLeft}d left)</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <div className="font-medium">{progress}%</div>
                          </div>
                        </div>
                        
                        <Progress value={progress} className="mt-3" />
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleGoalCompletion(goal.id)}
                          className={goal.completed ? 'bg-green-50 text-green-600' : ''}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingGoal(goal.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {progress >= 100 && !goal.completed && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                          🎉 Congratulations! You've reached your goal target. Mark it as complete!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {goals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No goals set for your 100-day challenge</h3>
                <p className="text-muted-foreground mb-4">Create your first goal to start tracking progress</p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First 100-Day Goal
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSetting;