import React, { useState, useEffect } from 'react';

// --- Theme Engine ---
const THEMES = [
  {
    id: 'glacier',
    name: 'Glacier Blue',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    primary: 'bg-blue-500',
    light: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-500'
  },
  {
    id: 'forest',
    name: 'Alpine Emerald',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    primary: 'bg-emerald-500',
    light: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-500'
  },
  {
    id: 'canyon',
    name: 'Canyon Clay',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    primary: 'bg-rose-500',
    light: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-500'
  }
];

const HOLIDAYS = {
  '1-1': 'New Year\'s Day',
  '2-14': 'Valentine\'s Day',
  '7-4': 'Independence Day',
  '10-31': 'Halloween',
  '12-25': 'Christmas Day'
};

const WallCalendar = () => {
  // --- State Initialization ---
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  const [selectionStart, setSelectionStart] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });
  
  const [selectionEnd, setSelectionEnd] = useState(null);
  
  // Data & UI States
  const [notesData, setNotesData] = useState({});
  const [tasksData, setTasksData] = useState({});
  const [currentNoteDraft, setCurrentNoteDraft] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const theme = THEMES[activeThemeIndex];

  // --- Persistence ---
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar_notes');
    const savedTasks = localStorage.getItem('calendar_tasks');
    const savedTheme = localStorage.getItem('calendar_theme_index');
    if (savedNotes) setNotesData(JSON.parse(savedNotes));
    if (savedTasks) setTasksData(JSON.parse(savedTasks));
    if (savedTheme) setActiveThemeIndex(parseInt(savedTheme, 10));
  }, []);

  // --- Helpers ---
  const formatDateKey = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
  const getActiveNoteKey = () => {
    if (selectionStart && selectionEnd) return `range_${formatDateKey(selectionStart)}_to_${formatDateKey(selectionEnd)}`;
    if (selectionStart) return `date_${formatDateKey(selectionStart)}`;
    return `month_${currentDate.getFullYear()}_${currentDate.getMonth()}`;
  };

  const activeDates = (() => {
    if (!selectionStart) return [];
    if (!selectionEnd) return [formatDateKey(selectionStart)];
    const dates = [];
    let current = new Date(selectionStart.getTime());
    const end = new Date(selectionEnd.getTime());
    while (current <= end) {
      dates.push(formatDateKey(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  })();

  const isRangeSelected = selectionStart && selectionEnd;

  useEffect(() => {
    const key = getActiveNoteKey();
    setCurrentNoteDraft(notesData[key] || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionStart, selectionEnd, currentDate]); 

  // --- Actions ---
  const handleSaveNote = () => {
    const key = getActiveNoteKey();
    const newData = { ...notesData, [key]: currentNoteDraft };
    setNotesData(newData);
    localStorage.setItem('calendar_notes', JSON.stringify(newData));
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectionStart) return;
    let updatedTasks = { ...tasksData };
    const newTaskIdBase = Date.now();
    activeDates.forEach((dateKey, index) => {
      const newTask = { id: newTaskIdBase + index, text: newTaskText, completed: false };
      updatedTasks = { ...updatedTasks, [dateKey]: [...(updatedTasks[dateKey] || []), newTask] };
    });
    setTasksData(updatedTasks);
    localStorage.setItem('calendar_tasks', JSON.stringify(updatedTasks));
    setNewTaskText('');
  };

  const toggleTask = (taskId, dateKey) => {
    const updatedTasks = {
      ...tasksData,
      [dateKey]: tasksData[dateKey].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    };
    setTasksData(updatedTasks);
    localStorage.setItem('calendar_tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId, dateKey) => {
    const updatedTasks = {
      ...tasksData,
      [dateKey]: tasksData[dateKey].filter(t => t.id !== taskId)
    };
    setTasksData(updatedTasks);
    localStorage.setItem('calendar_tasks', JSON.stringify(updatedTasks));
  };

  const goToToday = () => {
    const today = new Date();
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setSelectionStart(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      setSelectionEnd(null);
      setIsAnimating(false);
    }, 300);
  };

  // --- Calendar Logic ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handleDayClick = (day) => {
    const clickedDate = new Date(year, month, day);
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(clickedDate);
      setSelectionEnd(null);
    } else if (clickedDate < selectionStart) {
      setSelectionStart(clickedDate);
    } else {
      setSelectionEnd(clickedDate);
    }
  };

  const checkSelection = (date) => {
    if (!selectionStart) return { selected: false, isStart: false, isEnd: false };
    const time = date.getTime();
    const startTime = selectionStart.getTime();
    const endTime = selectionEnd ? selectionEnd.getTime() : null;
    if (endTime) return { selected: time >= startTime && time <= endTime, isStart: time === startTime, isEnd: time === endTime };
    return { selected: time === startTime, isStart: time === startTime, isEnd: false };
  };

  const changeMonth = (offset) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + offset, 1));
      setSelectionStart(null);
      setSelectionEnd(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(newYear, month, 1));
      setSelectionStart(null);
      setSelectionEnd(null);
      setIsAnimating(false);
    }, 300);
  };

  const currentActualYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentActualYear - 10 + i);

  const renderDays = () => {
    const grid = [];
    const todayKey = formatDateKey(new Date());

    for (let i = 0; i < startOffset; i++) grid.push(<div key={`pad-${i}`} className="p-2" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateKey = formatDateKey(dateObj);
      const { selected, isStart, isEnd } = checkSelection(dateObj);
      const isHoliday = HOLIDAYS[`${month + 1}-${day}`];
      const dayTasks = tasksData[dateKey] || [];
      const hasPendingTasks = dayTasks.some(t => !t.completed);
      const isToday = dateKey === todayKey;

      // Responsive circle sizes: w-8 h-8 on mobile, w-10 h-10 on tablet/desktop
      let baseClasses = "relative w-8 h-8 sm:w-10 sm:h-10 mx-auto flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200";
      
      if (isStart || isEnd) baseClasses += ` ${theme.primary} text-white shadow-lg transform scale-110 z-10`;
      else if (selected) baseClasses += ` ${theme.light} ${theme.text} rounded-none w-full`;
      else if (isToday) baseClasses += ` border-2 ${theme.border} ${theme.text}`;
      else baseClasses += ` text-gray-700 hover:${theme.light} hover:${theme.text}`;

      grid.push(
        <div key={`day-${day}`} className="py-1 relative group">
          <div onClick={() => handleDayClick(day)} className={baseClasses}>
            {day}
            <div className="absolute bottom-0 sm:bottom-1 flex gap-1">
               {isHoliday && !isStart && !isEnd && <span className={`w-1 h-1 rounded-full ${theme.primary}`}></span>}
               {hasPendingTasks && !isStart && !isEnd && <span className="w-1 h-1 rounded-full bg-orange-500"></span>}
            </div>
          </div>
          {(isHoliday || hasPendingTasks) && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg">
              {isHoliday && <div>🎉 {isHoliday}</div>}
              {hasPendingTasks && <div>📝 {dayTasks.filter(t=>!t.completed).length} Tasks</div>}
            </div>
          )}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-2 sm:px-4 md:px-6 flex items-center justify-center font-sans transition-colors duration-500">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 w-full h-8 flex justify-evenly px-4 z-20 opacity-80 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => <div key={i} className="w-2 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full shadow-md transform -translate-y-4 border border-gray-400"></div>)}
        </div>

        {/* Hero Section with responsive heights */}
        <div className="relative h-56 sm:h-72 md:h-96 w-full bg-gray-900 overflow-hidden pt-6 group">
          <img src={theme.image} alt="Calendar Hero" className="w-full h-full object-cover opacity-80 transition-opacity duration-1000" key={theme.image} />
          
          <div className="absolute top-8 right-4 sm:right-8 flex gap-2 z-20 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-xl">
            {THEMES.map((t, index) => (
              <button key={t.id} onClick={() => { setActiveThemeIndex(index); localStorage.setItem('calendar_theme_index', index); }} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 ${t.primary} ${index === activeThemeIndex ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'}`} title={t.name}/>
            ))}
          </div>

          <div className="absolute bottom-0 w-full h-16 sm:h-24 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
          
          <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-8 md:left-12 z-10 text-white drop-shadow-lg flex flex-col items-start">
            <div className="relative inline-flex items-center group/year mb-[-2px] sm:mb-[-5px]">
              {/* Responsive text sizing */}
              <select value={year} onChange={handleYearChange} className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-widest opacity-90 bg-transparent appearance-none cursor-pointer focus:outline-none pr-6 z-20">
                {yearOptions.map(y => <option key={y} value={y} className="text-gray-900 text-base font-sans">{y}</option>)}
              </select>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-40 absolute right-0 group-hover/year:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">{currentDate.toLocaleString('default', { month: 'long' })}</h1>
          </div>
        </div>

        {/* The Magic CSS Fix: flex-col-reverse forces the Grid to be ABOVE the Sidebar on Mobile! */}
        <div className="flex flex-col-reverse md:flex-row px-4 sm:px-6 md:px-12 py-6 sm:py-8 gap-8 md:gap-10">
          
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className={`flex flex-col ${selectionStart ? 'h-56' : 'flex-grow'}`}>
              <div className="flex justify-between items-end mb-3">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.text}`}>
                  {selectionStart && selectionEnd ? 'Range Notes' : selectionStart ? 'Daily Notes' : 'Monthly Notes'}
                </h3>
                {showSavedMsg ? <span className="text-xs font-bold text-green-500 animate-pulse">Saved! ✅</span> : <button onClick={handleSaveNote} className={`text-xs font-bold hover:underline ${theme.text}`}>Save Note</button>}
              </div>
              <div className={`flex-grow rounded-xl border-2 ${theme.border} bg-white overflow-hidden shadow-sm`}>
                <textarea className="w-full h-full p-4 resize-none bg-transparent focus:outline-none focus:ring-0 text-gray-700 leading-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)' }} placeholder={`Write notes...`} value={currentNoteDraft} onChange={(e) => setCurrentNoteDraft(e.target.value)}></textarea>
              </div>
            </div>

            {selectionStart && (
               <div className="flex flex-col flex-grow bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-inner">
                 <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme.text}`}>
                    {isRangeSelected ? `Tasks: ${selectionStart.getDate()} ${selectionStart.toLocaleString('default', { month: 'short' })} - ${selectionEnd.getDate()} ${selectionEnd.toLocaleString('default', { month: 'short' })}` : `Tasks for ${selectionStart.getDate()} ${selectionStart.toLocaleString('default', { month: 'short' })}`}
                 </h3>
                 <div className="flex-grow overflow-y-auto mb-4 space-y-4 max-h-48 sm:max-h-56 pr-2">
                    {activeDates.every(d => !(tasksData[d] && tasksData[d].length > 0)) && <p className="text-xs text-gray-400 italic text-center mt-4">No tasks set for this selection.</p>}
                    {activeDates.map(dateKey => {
                       const dayTasks = tasksData[dateKey] || [];
                       if (dayTasks.length === 0) return null;
                       const [y, m, d] = dateKey.split('-');
                       const displayDate = new Date(y, m - 1, d).toLocaleString('default', { month: 'short', day: 'numeric' });
                       return (
                         <div key={dateKey} className="space-y-2">
                           {isRangeSelected && <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 border-b pb-1">{displayDate}</div>}
                           {dayTasks.map(task => (
                             <div key={task.id} className="flex items-center justify-between group bg-white p-2 rounded shadow-sm border border-gray-100">
                               <label className="flex items-center cursor-pointer gap-2 overflow-hidden w-full">
                                 <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, dateKey)} className={`w-4 h-4 rounded border-gray-300 focus:ring-0 ${theme.text}`}/>
                                 <span className={`text-sm truncate w-full ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task.text}</span>
                               </label>
                               <button onClick={() => deleteTask(task.id, dateKey)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">✕</button>
                             </div>
                           ))}
                         </div>
                       )
                    })}
                 </div>
                 <form onSubmit={handleAddTask} className="flex gap-2 mt-auto border-t pt-3 border-gray-200">
                    <input type="text" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder={isRangeSelected ? "Add task to ALL..." : "Add a new task..."} className="flex-grow text-xs sm:text-sm p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500 shadow-sm" />
                    <button type="submit" disabled={!newTaskText.trim()} className={`p-2 px-3 rounded-lg text-white font-bold transition-opacity disabled:opacity-50 shadow-sm ${theme.primary}`}>+</button>
                 </form>
               </div>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4 sm:mb-6 relative">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              
              <div className="flex flex-col items-center">
                 <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest h-5 flex items-center mb-1 text-center">
                   {selectionStart && !selectionEnd && `Selected: ${selectionStart.toLocaleDateString()}`}
                   {selectionStart && selectionEnd && `${selectionStart.toLocaleDateString()} — ${selectionEnd.toLocaleDateString()}`}
                   {!selectionStart && 'Select a date or range'}
                 </div>
                 <button onClick={goToToday} className={`text-xs font-semibold hover:underline ${theme.text}`}>Go to Today</button>
              </div>

              <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>

            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="grid grid-cols-7 gap-y-2 sm:gap-y-4 mb-2">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
                  <div key={d} className={`text-center text-[10px] sm:text-xs font-bold tracking-wider ${i > 4 ? theme.text : 'text-gray-400'}`}>
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2 gap-x-0">
                {renderDays()}
              </div>
            </div>

            {selectionStart && (
               <div className="mt-4 sm:mt-6 text-center animate-fade-in flex justify-center">
                  <button onClick={() => { setSelectionStart(null); setSelectionEnd(null); }} className={`text-xs sm:text-sm font-semibold underline-offset-4 hover:underline ${theme.text} px-3 py-2 sm:px-4 rounded-lg hover:bg-gray-50`}>
                    Clear Selection
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallCalendar;