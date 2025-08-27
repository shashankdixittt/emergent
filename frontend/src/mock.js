// Mock data for development - this will be replaced with actual backend integration later

export const mockHabitData = () => {
  const data = {};
  for (let day = 1; day <= 30; day++) {
    data[day] = {
      habit1: Math.random() > 0.3, // 70% completion rate
      habit2: Math.random() > 0.4, // 60% completion rate
      habit3: Math.random() > 0.5, // 50% completion rate
      habit4: Math.random() > 0.6, // 40% completion rate
      habit5: Math.random() > 0.7, // 30% completion rate
    };
  }
  return data;
};

export const mockFocusHoursData = () => {
  const data = {};
  const hourOptions = [0, 2, 4, 6, 8, 10];
  
  for (let day = 1; day <= 30; day++) {
    // Create a realistic pattern with some randomness
    let baseHours;
    if (day % 7 === 0 || day % 7 === 6) { // Weekends - lower hours
      baseHours = hourOptions[Math.floor(Math.random() * 3)]; // 0, 2, or 4
    } else { // Weekdays - higher hours
      baseHours = hourOptions[Math.floor(Math.random() * 4) + 2]; // 4, 6, 8, or 10
    }
    data[day] = baseHours;
  }
  return data;
};

// Helper function to get local storage or fallback to mock data
export const getStoredData = (key, mockFunction) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error(`Error parsing stored data for ${key}:`, error);
    }
  }
  return mockFunction();
};

// Helper function to save data to local storage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to ${key}:`, error);
  }
};