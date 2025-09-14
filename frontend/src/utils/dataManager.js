// Local Storage Data Manager for Protocol Keeper App
// This ensures all data persists across browser refreshes

const DATA_KEYS = {
  HABITS: 'habitTrackerData',
  FOCUS: 'focusHoursData',
  TIME_ENTRIES: 'timeEntries',
  GOALS: 'personalGoals',
  APP_SETTINGS: 'appSettings'
};

class DataManager {
  // Save data with error handling
  static saveData(key, data) {
    try {
      const dataString = JSON.stringify(data);
      localStorage.setItem(key, dataString);
      console.log(`✅ Data saved successfully: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving data for ${key}:`, error);
      return false;
    }
  }

  // Load data with error handling
  static loadData(key, defaultValue = null) {
    try {
      const dataString = localStorage.getItem(key);
      if (dataString) {
        const parsedData = JSON.parse(dataString);
        console.log(`✅ Data loaded successfully: ${key}`);
        return parsedData;
      }
      return defaultValue;
    } catch (error) {
      console.error(`❌ Error loading data for ${key}:`, error);
      return defaultValue;
    }
  }

  // Habit Data Management
  static saveHabitData(habitData) {
    return this.saveData(DATA_KEYS.HABITS, habitData);
  }

  static loadHabitData() {
    return this.loadData(DATA_KEYS.HABITS, {});
  }

  // Focus Hours Data Management
  static saveFocusData(focusData) {
    return this.saveData(DATA_KEYS.FOCUS, focusData);
  }

  static loadFocusData() {
    return this.loadData(DATA_KEYS.FOCUS, {});
  }

  // Time Entries Data Management
  static saveTimeEntries(timeEntries) {
    return this.saveData(DATA_KEYS.TIME_ENTRIES, timeEntries);
  }

  static loadTimeEntries() {
    const entries = this.loadData(DATA_KEYS.TIME_ENTRIES, []);
    // Convert date strings back to Date objects
    return entries.map(entry => ({
      ...entry,
      startTime: new Date(entry.startTime),
      endTime: new Date(entry.endTime)
    }));
  }

  // Goals Data Management
  static saveGoals(goals) {
    return this.saveData(DATA_KEYS.GOALS, goals);
  }

  static loadGoals() {
    return this.loadData(DATA_KEYS.GOALS, []);
  }

  // Backup and Restore
  static exportAllData() {
    const allData = {
      habits: this.loadHabitData(),
      focus: this.loadFocusData(),
      timeEntries: this.loadTimeEntries(),
      goals: this.loadGoals(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return allData;
  }

  static importAllData(data) {
    try {
      if (data.habits) this.saveHabitData(data.habits);
      if (data.focus) this.saveFocusData(data.focus);
      if (data.timeEntries) this.saveTimeEntries(data.timeEntries);
      if (data.goals) this.saveGoals(data.goals);
      console.log('✅ All data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  // Clear specific data type
  static clearHabitData() {
    localStorage.removeItem(DATA_KEYS.HABITS);
    console.log('🗑️ Habit data cleared');
  }

  static clearFocusData() {
    localStorage.removeItem(DATA_KEYS.FOCUS);
    console.log('🗑️ Focus data cleared');
  }

  static clearTimeEntries() {
    localStorage.removeItem(DATA_KEYS.TIME_ENTRIES);
    console.log('🗑️ Time entries cleared');
  }

  static clearGoals() {
    localStorage.removeItem(DATA_KEYS.GOALS);
    console.log('🗑️ Goals cleared');
  }

  // Clear all data (nuclear option)
  static clearAllData() {
    Object.values(DATA_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ All data cleared');
  }

  // Get storage usage info
  static getStorageInfo() {
    const info = {};
    Object.entries(DATA_KEYS).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      info[name] = {
        exists: !!data,
        size: data ? data.length : 0,
        sizeKB: data ? Math.round(data.length / 1024 * 100) / 100 : 0
      };
    });
    return info;
  }

  // Validate data integrity
  static validateData() {
    const validation = {
      habits: true,
      focus: true,
      timeEntries: true,
      goals: true,
      errors: []
    };

    try {
      const habits = this.loadHabitData();
      if (typeof habits !== 'object') {
        validation.habits = false;
        validation.errors.push('Invalid habit data structure');
      }
    } catch (error) {
      validation.habits = false;
      validation.errors.push(`Habit data error: ${error.message}`);
    }

    try {
      const focus = this.loadFocusData();
      if (typeof focus !== 'object') {
        validation.focus = false;
        validation.errors.push('Invalid focus data structure');
      }
    } catch (error) {
      validation.focus = false;
      validation.errors.push(`Focus data error: ${error.message}`);
    }

    try {
      const timeEntries = this.loadTimeEntries();
      if (!Array.isArray(timeEntries)) {
        validation.timeEntries = false;
        validation.errors.push('Invalid time entries data structure');
      }
    } catch (error) {
      validation.timeEntries = false;
      validation.errors.push(`Time entries error: ${error.message}`);
    }

    try {
      const goals = this.loadGoals();
      if (!Array.isArray(goals)) {
        validation.goals = false;
        validation.errors.push('Invalid goals data structure');
      }
    } catch (error) {
      validation.goals = false;
      validation.errors.push(`Goals error: ${error.message}`);
    }

    return validation;
  }
}

export default DataManager;
export { DATA_KEYS };