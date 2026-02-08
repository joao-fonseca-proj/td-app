import React, { useState, useEffect, useCallback } from 'react';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContextTabs from '../components/ContextTabs';
import DaySection from '../components/DaySection';
import FutureSection from '../components/FutureSection';
import PastSection from '../components/PastSection';

// Helpers & Services
import {
  getDayLabels,
  calculateOffsetFromDate,
  getDateStringFromOffset,
  analyzeTask
} from '../utils/helpers';
import { getTodos, patchTodoCompletion, postTodo } from '../services/TodoService';

export default function DashboardPage() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'professional'
  const [loading, setLoading] = useState(true);

  // --- BACKEND STATE ---
  // Limits: how many days before/after today to fetch
  const [limits, setLimits] = useState({ before: 0, after: 1 });
  // Map to store dynamic IDs from BE: { personal: 5, professional: 12 }
  const [panelIds, setPanelIds] = useState({ personal: null, professional: null });

  // The Main Data Store
  const [data, setData] = useState({
    personal: {},
    professional: {}
  });

  // --- DATA TRANSFORMATION (BE -> FE) ---
  const transformBackendData = useCallback((todoFetchList) => {
    const newState = { personal: {}, professional: {} };
    const ids = { personal: null, professional: null };

    todoFetchList.forEach(item => {
      const tabKey = item.panel.name.toLowerCase(); // Map "PERSONAL" to "personal"
      ids[tabKey] = item.panel.id;

      if (newState[tabKey] !== undefined) {
        const dayGroups = {};

        item.todos.forEach(todo => {
          const offset = calculateOffsetFromDate(todo.dueDate);
          if (!dayGroups[offset]) dayGroups[offset] = [];

          dayGroups[offset].push({
            id: todo.id,
            text: todo.title,
            completed: todo.completed,
            category: todo.category || 'GENERAL',
            isUrgent: todo.urgency === 'URGENT',
            position: todo.position
          });
        });

        // Sort by position provided by BE
        Object.keys(dayGroups).forEach(offset => {
          dayGroups[offset].sort((a, b) => {
            // Primary sort: Completed tasks at the top
            if (a.completed !== b.completed) return a.completed ? -1 : 1;
            // Secondary sort: Position
            return a.position - b.position;
          });
        });
        
        newState[tabKey] = dayGroups;
      }
    });

    setPanelIds(ids);
    return newState;
  }, []);

  // --- API: FETCH ---
  const fetchTasks = useCallback(async () => {
    try {
      // Show loading spinner only on initial load
      if (Object.keys(data[activeTab]).length === 0) setLoading(true);

      const response = await getTodos(limits.before, limits.after);
      const transformed = transformBackendData(response.data.todoFetchList);
      setData(transformed);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, [limits, activeTab, transformBackendData]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- API: CREATE (OPTIMISTIC) ---
  const handleCreateTask = async (text, dayOffset) => {
    const { isUrgent } = analyzeTask(text);
    const panelId = panelIds[activeTab];
    const dueDate = getDateStringFromOffset(dayOffset);

    const payload = {
      panelId: panelId,
      title: text,
      dueDate: dueDate,
      completed: false,
      urgency: isUrgent ? "URGENT" : "NORMAL",
      category: "GENERAL"
    };

    // 1. Optimistic Update: Add to UI immediately
    const tempId = `temp-${Date.now()}`;
    const newTask = {
      id: tempId,
      text: text,
      completed: false,
      category: "GENERAL",
      isUrgent
    };

    setData(prev => {
      const currentDayTasks = prev[activeTab][dayOffset] || [];
      // Add new task to the beginning
      const newList = [newTask, ...currentDayTasks];

      // Sort to ensure it's at the top of the incomplete section
      const sortedList = newList.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return 0; // New tasks don't have a position yet, so they stay at top
      });

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [dayOffset]: sortedList
        }
      };
    });


    try {
      // 2. Sync with Backend
      const response = await postTodo(payload);

      // 3. Replace temp ID with real DB ID
      setData(prev => {
        const updated = prev[activeTab][dayOffset].map(t =>
          t.id === tempId ? { ...t, id: response.data.id } : t
        );
        return { ...prev, [activeTab]: { ...prev[activeTab], [dayOffset]: updated } };
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      fetchTasks(); // Rollback to server state on error
    }
  };

  const handleToggleTask = async (taskId, currentOffset) => {
    const dayTasks = data[activeTab][currentOffset];
    const task = dayTasks.find(t => t.id === taskId);
    if (!task) return;

    const newValue = !task.completed;

    // --- OPTIMISTIC UPDATE ---
    setData(prev => {
      const updatedTasks = prev[activeTab][currentOffset].map(t =>
        t.id === taskId ? { ...t, completed: newValue } : t
      );

      // SORT: Completed (true) comes BEFORE Incomplete (false)
      const sortedTasks = [...updatedTasks].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? -1 : 1; // Completed (true) FIRST
        }
        // If completion status is the same, use backend position
        return a.position - b.position;
      });

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [currentOffset]: sortedTasks
        }
      };
    });

    try {
      await patchTodoCompletion(taskId, newValue);
    } catch (error) {
      console.error("Failed to toggle:", error);
      fetchTasks(); // Rollback to server state on error
    }
  };

  // --- API: EDIT ---
  const handleEditTask = async (taskId, currentOffset, newText) => {
    // Local update
    setData(prev => {
      const updatedList = prev[activeTab][currentOffset].map(t =>
        t.id === taskId ? { ...t, text: newText } : t
      );
      return { ...prev, [activeTab]: { ...prev[activeTab], [currentOffset]: updatedList } };
    });
    // BE call would go here: await putTodo(taskId, { title: newText });
  };

  // --- API: MOVE (BIDIRECTIONAL) ---
  const handleMoveTask = async (taskId, currentOffset, direction) => {
    const targetOffset = currentOffset + direction;
    const taskToMove = data[activeTab][currentOffset]?.find(t => t.id === taskId);
    if (!taskToMove) return;

    // Local Update
    const updatedSourceList = data[activeTab][currentOffset].filter(t => t.id !== taskId);
    const targetList = data[activeTab][targetOffset] || [];
    const updatedTargetList = [taskToMove, ...targetList];

    setData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [currentOffset]: updatedSourceList,
        [targetOffset]: updatedTargetList
      }
    }));

    // BE call would go here: await patchTodoDate(taskId, getDateStringFromOffset(targetOffset));
  };

  // --- API: REORDER / TOGGLE ---
  const updateList = (dayKey, newTasks) => {
    setData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [dayKey]: newTasks }
    }));
    // BE call would go here to update positions/completion status
  };

  const currentData = data[activeTab];
  const todayLabels = getDayLabels(0);
  const tomorrowLabels = getDayLabels(1);

  // Full screen loader for initial load
  if (loading && Object.keys(currentData).length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 pt-6 pb-20">
        <div className="mb-6 text-center md:text-left">
          <ContextTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="flex flex-col space-y-4">

          {/* PAST SECTION (History) */}
          <PastSection
            data={currentData}
            onUpdateTasks={updateList}
            onMove={handleMoveTask}
            onEdit={handleEditTask}
            onToggleTask={handleToggleTask}
            onLoadMore={() => setLimits(prev => ({ ...prev, before: prev.before + 2 }))}
          />

          {/* TODAY (Hero Section) */}
          <div className="-mt-2">
            <DaySection
              title={todayLabels.title}
              dateLabel={todayLabels.label}
              dayOffset={0}
              tasks={currentData['0'] || []}
              onUpdateTasks={(t) => updateList('0', t)}
              onCreateTask={handleCreateTask}
              onToggleTask={handleToggleTask}
              onMove={handleMoveTask}
              onEdit={handleEditTask}
              autoFocus={true}
              isHero={true}
            />
          </div>

          {/* TOMORROW */}
          <DaySection
            title={tomorrowLabels.title}
            dateLabel={tomorrowLabels.label}
            dayOffset={1}
            tasks={currentData['1'] || []}
            onUpdateTasks={(t) => updateList('1', t)}
            onCreateTask={handleCreateTask}
            onToggleTask={handleToggleTask}
            onMove={handleMoveTask}
            onEdit={handleEditTask}
          />

          {/* FUTURE SECTION (Upcoming) */}
          <FutureSection
            data={currentData}
            onUpdateTasks={updateList}
            onMove={handleMoveTask}
            onEdit={handleEditTask}
            onToggleTask={handleToggleTask}
            onLoadMore={() => setLimits(prev => ({ ...prev, after: prev.after + 2 }))}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}