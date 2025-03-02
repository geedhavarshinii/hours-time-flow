import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getHours, differenceInDays, getWeek, getISOWeeksInYear, getDaysInMonth } from "date-fns";
import './styles.css';

const API_URL = process.env.REACT_APP_API_URL;

// HomePage Component
const HomePage = ({ onStart, darkMode, toggleTheme }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'} flex flex-col items-center justify-center p-8 font-['Manrope']`}>
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border-2 border-zinc-200'} shadow-lg hover:shadow-xl transition-all`}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Hours
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          See your time flow. Every moment counts, every hour tells a story. Observe how your days unfold, one hour at a time.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className={`px-8 py-4 rounded-2xl text-lg font-semibold ${
              darkMode 
                ? 'bg-white text-zinc-900 hover:bg-zinc-100' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            } transition-all shadow-lg hover:shadow-xl`}
          >
            Get Started
          </motion.button>
          <a 
            href="https://github.com/geedhavarshinii/productivity-widget" 
            target="_blank"
            rel="noopener noreferrer"
            className={`px-8 py-4 rounded-2xl text-lg font-semibold ${
              darkMode
                ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                : 'bg-white text-zinc-900 border-2 border-zinc-200 hover:bg-zinc-50'
            } transition-all shadow-lg hover:shadow-xl flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Track Time Flow</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Observe how your hours unfold each day, creating patterns of time.</p>
          </div>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Daily Stories</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Each day writes its own story through the hours you mark and moments you note.</p>
          </div>
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Personal Journey</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Your time is unique to you. Record it your way, at your pace.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Storage utility
const storage = {
  getItem: (date) => {
    try {
      const key = `productivity-widget-${format(date, 'yyyy-MM-dd')}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      // Add version check if needed in the future
      return parsed;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  setItem: (date, data) => {
    try {
      const key = `productivity-widget-${format(date, 'yyyy-MM-dd')}`;
      const saveData = {
        ...data,
        updatedAt: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(key, JSON.stringify(saveData));
      
      // Create a backup
      localStorage.setItem(`${key}-backup`, JSON.stringify(saveData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // Try to recover from backup if main save fails
      const key = `productivity-widget-${format(date, 'yyyy-MM-dd')}`;
      const backup = localStorage.getItem(`${key}-backup`);
      if (backup) {
        localStorage.setItem(key, backup);
      }
    }
  }
};

// Time Context Component
const TimeContext = ({ selectedDate, darkMode }) => {
  const now = new Date();
  const daysInYear = 365;
  const dayOfYear = differenceInDays(now, new Date(now.getFullYear(), 0, 1));
  const yearProgress = (dayOfYear / daysInYear) * 100;
  const currentWeek = getWeek(now);
  const totalWeeks = getISOWeeksInYear(now);
  const weeksRemaining = totalWeeks - currentWeek;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-3xl ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border-2 border-zinc-200'} p-6 rounded-3xl shadow-lg mb-6`}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>{now.getFullYear()} Progress</span>
            <span>{Math.round(yearProgress)}%</span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${yearProgress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-black dark:bg-white rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
          <div>{`${differenceInDays(new Date(now.getFullYear() + 1, 0, 1), now)} days remaining in ${now.getFullYear()}`}</div>
          <div>{`Week ${currentWeek} of ${totalWeeks} (${weeksRemaining} weeks remaining)`}</div>
        </div>
      </div>
    </motion.div>
  );
};

// Mini Calendar Component
const MiniCalendar = ({ selectedDate, darkMode, onDateSelect }) => {
  // const daysInMonth = getDaysInMonth(selectedDate);
  const daysInMonth = Array.from({ length: getDaysInMonth(selectedDate) }, (_, i) =>
    addDays(startOfMonth(selectedDate), i)
  );
  
  const startDay = startOfMonth(selectedDate).getDay();

  return (
    <div className={`${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'} p-4 rounded-2xl shadow-lg w-64 fixed left-6 top-24`}>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'} text-xs font-semibold text-center`}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysInMonth.map((day) => (
          <motion.button
            key={day.toISOString()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDateSelect(day)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              isSameDay(day, selectedDate)
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : isSameDay(day, new Date())
                ? 'border-2 border-zinc-900 dark:border-white'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            {format(day, 'd')}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// DateDisplay Component
const DateDisplay = ({ selectedDate, darkMode, onDateChange }) => {
  return (
    <div className="flex justify-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border-2 border-zinc-200'} px-6 py-4 rounded-3xl shadow-lg mb-6 flex items-center justify-between`}
      >
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDateChange(subDays(selectedDate, 1))}
          className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <div className="text-center font-bold tracking-tight">
          <div className="text-xl">
            {format(selectedDate, "EEEE")}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {format(selectedDate, "MMMM d, yyyy")}
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

// ProductivityWidget Component
const ProductivityWidget = ({ darkMode, toggleTheme, onBack, initialShowCalendar }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hours, setHours] = useState(Array(24).fill(false));
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true); // Always start with calendar view
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncWithBackend, setSyncWithBackend] = useState(false);

  const taskInputRef = useRef(null);

  // Load data when date changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      // First try to get data from localStorage
      const localData = storage.getItem(selectedDate);
      if (localData) {
        setHours(localData.hours || Array(24).fill(false));
        setTasks(localData.tasks || []);
        setIsLoading(false);
        return;
      }

      // If no local data and backend sync is enabled, try backend
      if (syncWithBackend) {
        try {
          const dateKey = format(selectedDate, 'yyyy-MM-dd');
          const response = await fetch(`${API_URL}/days/${dateKey}`);
          if (!response.ok) throw new Error('Failed to fetch data');
          
          const data = await response.json();
          setHours(data.hours || Array(24).fill(false));
          setTasks(data.tasks || []);
          
          // Save fetched data to localStorage
          storage.setItem(selectedDate, { hours: data.hours, tasks: data.tasks });
        } catch (error) {
          console.error('Error loading data from backend:', error);
          setError('Failed to load data. Working in offline mode.');
          setHours(Array(24).fill(false));
          setTasks([]);
        }
      } else {
        // If no local data and no backend sync, start fresh
        setHours(Array(24).fill(false));
        setTasks([]);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [selectedDate, syncWithBackend]);

  // Save data whenever hours or tasks change
  useEffect(() => {
    const saveData = async () => {
      // Always save to localStorage first
      storage.setItem(selectedDate, { hours, tasks });

      // If backend sync is enabled, try to save there too
      if (syncWithBackend) {
        try {
          const dateKey = format(selectedDate, 'yyyy-MM-dd');
          const response = await fetch(`${API_URL}/days/${dateKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hours, tasks })
          });
          
          if (!response.ok) throw new Error('Failed to save data');
        } catch (error) {
          console.error('Error saving to backend:', error);
          setError('Failed to sync with backend. Data saved locally.');
        }
      }
    };

    // Debounce save operations
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [hours, tasks, selectedDate, syncWithBackend]);

  // Helper functions
  const toggleHour = (index) => {
    setHours(prev => {
      const newHours = [...prev];
      newHours[index] = !newHours[index];
      return newHours;
    });
  };

  const addTask = () => {
    if (taskInput.trim() !== "" && taskInput.length <= 80) {
      setTasks(prevTasks => {
        const newTask = { text: taskInput, completed: false };
        const firstCompletedIndex = prevTasks.findIndex(task => task.completed);
        
        if (firstCompletedIndex === -1) {
          return [...prevTasks, newTask];
        } else {
          return [
            ...prevTasks.slice(0, firstCompletedIndex),
            newTask,
            ...prevTasks.slice(firstCompletedIndex)
          ];
        }
      });
      setTaskInput("");
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks(prev => {
      const updatedTasks = prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      );
      return updatedTasks.sort((a, b) => a.completed - b.completed);
    });
  };

  const editTask = (index, value) => {
    if (value.length <= 80) {
      setTasks(prev => {
        const newTasks = [...prev];
        newTasks[index].text = value;
        return newTasks;
      });
    }
  };

  const deleteTask = (index) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleHourDragStart = (index, initialState) => {
    setIsDragging(true);
    setDragState(initialState);
  };

  const handleHourDragEnter = (index) => {
    if (isDragging && dragState !== null) {
      toggleHour(index);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'} text-center flex flex-col items-center font-['Manrope'] transition-colors duration-300 relative p-6`}>
      {/* Header with Navigation */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className={`p-2 rounded-xl ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </motion.button>

        <div className="flex items-center gap-4">
          {!showCalendar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCalendar(true)}
              className={`p-2 rounded-xl ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-2 rounded-xl ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showCalendar ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl"
          >
            <div className={`${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'} p-8 rounded-3xl shadow-lg`}>
              <div className="flex justify-between items-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDate(subDays(selectedDate, 30))}
                  className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <span className="text-xl font-bold">{format(selectedDate, "MMMM yyyy")}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDate(addDays(selectedDate, 30))}
                  className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'} font-semibold text-sm`}>
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: startOfMonth(selectedDate).getDay() }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}
                {Array.from({ length: getDaysInMonth(selectedDate) }, (_, i) => {
                  const day = addDays(startOfMonth(selectedDate), i);
                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedDate(day);
                        setShowCalendar(false);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all text-base font-semibold ${
                        isSameDay(day, new Date())
                          ? 'border-zinc-900 dark:border-white'
                          : `${darkMode ? 'border-zinc-700' : 'border-zinc-200'}`
                      } ${
                        isSameDay(day, selectedDate)
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                          : `hover:border-zinc-900 dark:hover:border-white ${darkMode ? 'bg-zinc-800' : 'bg-white'}`
                      }`}
                    >
                      {format(day, 'd')}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl flex flex-col gap-6"
          >
            <DateDisplay 
              selectedDate={selectedDate} 
              darkMode={darkMode} 
              onDateChange={setSelectedDate}
            />
            <TimeContext selectedDate={selectedDate} darkMode={darkMode} />
            
            {/* Hours Grid */}
            <div className={`${darkMode ? 'bg-zinc-800' : 'bg-zinc-800/5'} p-4 rounded-2xl shadow-lg`}>
              <div className="grid grid-cols-12 gap-2 justify-items-center">
                {Array.from({ length: 24 }, (_, i) => (
                  <motion.div
                    key={i}
                    onMouseDown={() => handleHourDragStart(i, !hours[i])}
                    onMouseEnter={() => handleHourDragEnter(i)}
                    onMouseUp={() => setIsDragging(false)}
                    onClick={() => !isDragging && toggleHour(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-2 ${
                      hours[i] 
                        ? darkMode
                          ? "bg-white text-zinc-900 border-transparent"
                          : "bg-black text-white border-transparent"
                        : `${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} hover:border-black dark:hover:border-white`
                    } transition-all shadow-sm hover:shadow-md`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base font-extrabold">{i > 12 ? i - 12 : i === 0 ? '12' : i}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="flex-1 min-h-0">
              {/* Add Task Button */}
              <div className="flex justify-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowInput(!showInput)}
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${darkMode ? 'border-white hover:bg-zinc-800' : 'border-zinc-900 hover:bg-zinc-50'} border-2 transition-all`}
                >
                  {showInput ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* Task Input */}
              <AnimatePresence>
                {showInput && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    <input
                      ref={taskInputRef}
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value.slice(0, 80))}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      className={`w-full p-4 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} border-2 rounded-2xl focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none transition-all shadow-lg text-base font-medium`}
                      placeholder="Add a note for this hour..."
                      maxLength={80}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task List */}
              <div className="space-y-3 overflow-y-auto max-h-[60vh] custom-scrollbar">
                {tasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-5 ${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'} rounded-2xl shadow-lg hover:shadow-xl transition-all relative group ${
                      task.completed ? "text-zinc-400 dark:text-zinc-500" : ""
                    }`}
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        if (editingIndex !== index) {
                          toggleTaskCompletion(index);
                        }
                      }}
                      onDoubleClick={() => setEditingIndex(index)}
                    >
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={task.text}
                          onChange={(e) => editTask(index, e.target.value)}
                          onBlur={() => setEditingIndex(null)}
                          onKeyDown={(e) => e.key === "Enter" && setEditingIndex(null)}
                          className={`w-full p-2 bg-transparent border-2 ${darkMode ? 'border-zinc-700' : 'border-zinc-200'} rounded-lg focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none transition-all text-base font-medium`}
                          maxLength={80}
                          autoFocus
                        />
                      ) : (
                        <div className={`text-base font-medium ${task.completed ? "line-through" : ""}`}>
                          {task.text}
                        </div>
                      )}
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(index)}
                      className="opacity-0 group-hover:opacity-100 transition-all ml-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [showWidget, setShowWidget] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  // Load theme preference on mount
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme toggle function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showWidget ? (
        <ProductivityWidget 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          onBack={() => {
            setShowWidget(false);
            setShowCalendar(true);
          }}
          initialShowCalendar={showCalendar} 
        />
      ) : (
        <HomePage 
          darkMode={darkMode} 
          toggleTheme={toggleTheme}
          onStart={() => {
            setShowWidget(true);
          }} 
        />
      )}
    </AnimatePresence>
  );
}
