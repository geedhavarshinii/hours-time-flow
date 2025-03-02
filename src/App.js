import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getHours, differenceInDays, getWeek, getISOWeeksInYear, getDaysInMonth } from "date-fns";
import './styles.css';

const API_URL = 'http://localhost:5000/api';

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

export default function ProductivityWidget() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hours, setHours] = useState(Array(24).fill(false));
  const [tasks, setTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const taskInputRef = useRef(null);

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

  // Load data when date changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`${API_URL}/days/${dateKey}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setHours(data.hours || Array(24).fill(false));
        setTasks(data.tasks || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again.');
        setHours(Array(24).fill(false));
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  // Save data whenever hours or tasks change
  useEffect(() => {
    const saveData = async () => {
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
        console.error('Error saving data:', error);
        setError('Failed to save changes. Please try again.');
      }
    };

    // Debounce save operations
    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [hours, tasks, selectedDate]);

  // Theme toggle function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  const startDay = startOfMonth(selectedDate).getDay();

  const toggleHour = (index) => {
    setHours((prev) => {
      const updatedHours = [...prev];
      updatedHours[index] = !updatedHours[index];
      return updatedHours;
    });
  };

  const addTask = () => {
    if (taskInput.trim() !== "" && taskInput.length <= 80) {
      setTasks((prevTasks) => {
        const newTask = { text: taskInput, completed: false };
        // Find the index of the first completed task
        const firstCompletedIndex = prevTasks.findIndex(task => task.completed);
        
        if (firstCompletedIndex === -1) {
          // If no completed tasks, add to the end
          return [...prevTasks, newTask];
        } else {
          // Insert before the first completed task
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
    setTasks((prev) => {
      const updatedTasks = prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      );
      return updatedTasks.sort((a, b) => a.completed - b.completed);
    });
  };

  const editTask = (index, value) => {
    if (value.length <= 80) {
      const updatedTasks = [...tasks];
      updatedTasks[index].text = value;
      setTasks(updatedTasks);
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleHourDragStart = (index, initialState) => {
    setIsDragging(true);
    setDragState(initialState);
  };

  const handleHourDragEnter = (index) => {
    if (isDragging && dragState !== null) {
      setHours(prev => {
        const newHours = [...prev];
        newHours[index] = dragState;
        return newHours;
      });
    }
  };

  const CalendarView = () => (
    <div className={`w-full max-w-3xl ${darkMode ? 'bg-zinc-800' : 'bg-white border-2 border-zinc-200'} p-8 rounded-3xl shadow-lg`}>
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`${darkMode ? 'text-zinc-400' : 'text-zinc-600'} font-semibold text-sm`}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysInMonth.map((day) => (
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
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-900'} text-center flex flex-col items-center space-y-6 font-['Manrope'] transition-colors duration-300 relative`}>
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

      {/* Date Navigation */}
      <div className={`flex items-center space-x-6 font-bold text-xl ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border-2 border-zinc-200'} px-6 py-4 rounded-3xl shadow-lg w-full max-w-md mx-auto tracking-tight`}>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (showCalendar) {
              setSelectedDate(subDays(selectedDate, 30));
            } else {
              setSelectedDate(subDays(selectedDate, 1));
            }
          }}
          className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.span 
          className="flex-1 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors tracking-tight text-center"
          onClick={() => setShowCalendar(!showCalendar)}
          whileHover={{ scale: 1.02 }}
        >
          {format(selectedDate, showCalendar ? "MMMM yyyy" : "EEEE, MMMM d")}
        </motion.span>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (showCalendar) {
              setSelectedDate(addDays(selectedDate, 30));
            } else {
              setSelectedDate(addDays(selectedDate, 1));
            }
          }}
          className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {!showCalendar && <TimeContext selectedDate={selectedDate} darkMode={darkMode} />}

      {!showCalendar && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCalendar(true)}
          className={`px-5 py-3 text-base font-semibold ${darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900 border-2 border-zinc-200'} rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-lg flex items-center gap-2`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Calendar View
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {showCalendar ? (
          <CalendarView />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-3xl flex flex-col gap-6"
          >
            {/* Hours Section */}
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

            {/* Add Task Button - Centered */}
            <div className="flex justify-center -mt-2 mb-4">
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

            {/* Tasks Section */}
            <div className="flex-1 min-h-0">
              <div className="space-y-3">
                {/* Task Input */}
                <AnimatePresence>
                  {showInput && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full"
                    >
                      <input
                        ref={taskInputRef}
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value.slice(0, 80))}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        className={`w-full p-4 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} border-2 rounded-2xl focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none transition-all shadow-lg text-base font-medium`}
                        placeholder="What needs to be done?"
                        maxLength={80}
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Task List */}
                <div className="space-y-3 overflow-y-auto max-h-[60vh]">
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
                        onClick={(e) => {
                          if (editingIndex !== index) {
                            toggleTaskCompletion(index);
                          }
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingIndex(index);
                        }}
                      >
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={task.text}
                            onChange={(e) => editTask(index, e.target.value.slice(0, 80))}
                            onBlur={() => setEditingIndex(null)}
                            onKeyDown={(e) => e.key === "Enter" && setEditingIndex(null)}
                            className={`w-full p-2 bg-transparent border-2 ${darkMode ? 'border-zinc-700' : 'border-zinc-200'} rounded-lg focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white focus:outline-none transition-all text-base font-medium`}
                            maxLength={80}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTask(index);
                        }} 
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
