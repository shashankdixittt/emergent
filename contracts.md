# Protocol Tracker - API Contracts & Backend Implementation Plan

## Overview
A comprehensive habit and focus hours tracking application with local storage functionality, designed for 30-day tracking cycles.

## Current Frontend Implementation Status ✅

### 1. Protocol Tracker (Habit Tracker)
- **Status**: Fully functional with local storage
- **Features**: 6 habits × 30 days checkbox grid, real-time statistics, progress tracking
- **Habit Names**: 
  1. No Social Media
  2. No Songs  
  3. No Maggie/Chai/Coffee
  4. 1min Self Video Recording
  5. 45min Book Reading
  6. Meditation
- **Data Structure**: `{ day: { habit1: boolean, habit2: boolean, ..., habit6: boolean } }`

### 2. Focus Hours Tracker  
- **Status**: Fully functional with interactive grid and line graph
- **Features**: Clickable dots for hour selection (0,2,4,6,8,10h), trend visualization, statistics
- **Data Structure**: `{ day: number }` (where number is selected hours)

## Local Storage Keys (Currently Used)
```javascript
'habitTrackerData' - Stores habit completion data
'focusHoursData' - Stores focus hours data
```

## API Contracts for Backend Implementation

### Base URL: `${REACT_APP_BACKEND_URL}/api`

### 1. Habit Tracking Endpoints

#### GET /habits/data
- **Purpose**: Retrieve all habit data for current user/session
- **Response**: 
```json
{
  "data": {
    "1": { "habit1": true, "habit2": false, "habit3": true, "habit4": false, "habit5": true, "habit6": false },
    "2": { "habit1": false, "habit2": true, "habit3": false, "habit4": true, "habit5": false, "habit6": true }
    // ... up to day 30
  },
  "lastUpdated": "2025-01-27T10:00:00Z"
}
```

#### POST /habits/update
- **Purpose**: Update habit completion for specific day
- **Payload**:
```json
{
  "day": 1,
  "habitData": { "habit1": true, "habit2": false, "habit3": true, "habit4": false, "habit5": true, "habit6": false }
}
```

### 2. Focus Hours Endpoints

#### GET /focus/data
- **Purpose**: Retrieve all focus hours data
- **Response**:
```json
{
  "data": {
    "1": 6, "2": 4, "3": 8, "4": 2
    // ... up to day 30
  },
  "statistics": {
    "totalHours": 162,
    "averageHours": 5.4,
    "currentStreak": 3,
    "bestStreak": 7
  }
}
```

#### PUT /focus/update/:day
- **Purpose**: Update focus hours for specific day
- **Payload**:
```json
{
  "hours": 6
}
```

### 3. Statistics Endpoints

#### GET /stats/summary
- **Purpose**: Get combined statistics for dashboard
- **Response**:
```json
{
  "habits": {
    "completionRates": { "habit1": 70, "habit2": 60, "habit3": 80, "habit4": 55, "habit5": 45 },
    "bestDay": { "day": 15, "completionRate": 100 },
    "currentStreak": 5
  },
  "focus": {
    "totalHours": 162,
    "averageHours": 5.4,
    "bestDay": { "day": 12, "hours": 10 },
    "productivity": 68
  }
}
```

## Backend Implementation Tasks

### 1. Database Schema (MongoDB)

#### HabitData Collection
```javascript
{
  _id: ObjectId,
  sessionId: String, // For anonymous users
  day: Number (1-30),
  habit1: Boolean,
  habit2: Boolean,
  habit3: Boolean,
  habit4: Boolean,
  habit5: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### FocusHoursData Collection
```javascript
{
  _id: ObjectId,
  sessionId: String, // For anonymous users  
  day: Number (1-30),
  hours: Number (0,2,4,6,8,10),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Session Management
- Generate unique sessionId for each user (UUID)
- Store in browser localStorage: `trackerSessionId`
- Use for data isolation without authentication

### 3. API Implementation Priority
1. **Session creation endpoint** - Generate and return sessionId
2. **Habit CRUD operations** - Full habit data management
3. **Focus hours CRUD operations** - Full focus hours management  
4. **Statistics calculation** - Real-time statistics generation
5. **Data migration endpoint** - Import existing localStorage data

### 4. Frontend Integration Changes

#### Remove Mock Data
- Replace localStorage-only logic in `HabitTracker.jsx`
- Replace localStorage-only logic in `FocusHoursTracker.jsx`
- Remove `mock.js` file dependencies

#### Add API Integration
- Create `api/habitService.js` - Habit data API calls
- Create `api/focusService.js` - Focus hours API calls  
- Create `api/sessionService.js` - Session management
- Add error handling and offline support (fallback to localStorage)

#### Session Initialization
```javascript
// Initialize session on app load
const sessionId = localStorage.getItem('trackerSessionId') || 
                  await sessionService.createSession();
```

## Migration Strategy

### Phase 1: Backend Setup
1. Create database models and endpoints
2. Implement session-based data storage
3. Add API validation and error handling

### Phase 2: Frontend Integration
1. Create API service layers
2. Replace localStorage calls with API calls
3. Add loading states and error handling
4. Implement data synchronization

### Phase 3: Data Migration
1. Create migration endpoint for existing localStorage data
2. Seamless user transition from local to server storage
3. Maintain backward compatibility

## Error Handling
- Network failure: Fallback to localStorage
- Invalid session: Create new session automatically  
- Data conflicts: Server data takes precedence
- Validation errors: Show user-friendly messages

## Performance Considerations
- Debounced API calls for rapid updates
- Optimistic UI updates
- Caching strategy for statistics
- Efficient data queries with proper indexing

---

**Status**: Ready for backend implementation. Frontend provides excellent foundation with mock data that will be seamlessly replaced with real API integration.