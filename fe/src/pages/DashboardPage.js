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
import { deleteTodoById, getTodos, patchTodoCompletion, patchTodoDueDate, patchTodoPosition, patchTodoTitle, postTodo } from '../services/TodoService';
import HabitCreator from '../components/HabitCreator';

export default function DashboardPage() {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'professional'
  const [loading, setLoading] = useState(true);

  // --- BACKEND STATE ---
  // Limits: how many days before/after today to fetch
  const [limits, setLimits] = useState({ before: 2, after: 2 });
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
            position: todo.position,
            habitId: todo.habitId
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
  const fetchTasks = useCallback(async (isInitial) => {
    try {
      if (isInitial) setLoading(true);

      const response = await getTodos(limits.before, limits.after);
      const transformed = transformBackendData(response.data.todoFetchList);

      setData(transformed);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, [limits.before, limits.after, transformBackendData]); // ONLY depend on the limits and stable transformer

  useEffect(() => {
    const isDataEmpty = !data[activeTab] || Object.keys(data[activeTab]).length === 0;
    fetchTasks(isDataEmpty);
    // eslint-disable-next-line
  }, [fetchTasks, activeTab]);

  // --- API: CREATE (OPTIMISTIC) ---
  const handleCreateTask = async (text, dayOffset) => {
    const { isUrgent } = analyzeTask(text);
    const panelId = panelIds[activeTab];
    const dueDate = getDateStringFromOffset(dayOffset);

    // 1. Optimistic Update: Add to UI immediately
    const tempId = `temp-${Date.now()}`;

    setData(prev => {
      const currentDayTasks = prev[activeTab][dayOffset] || [];

      // Calculate a temporary position that is higher than any existing task
      // This ensures it stays at the bottom during the sort
      const maxPos = currentDayTasks.length > 0
        ? Math.max(...currentDayTasks.map(t => t.position ?? 0))
        : 0;

      const newTask = {
        id: tempId,
        text: text,
        completed: false,
        category: "GENERAL",
        isUrgent,
        position: maxPos + 1 // Temporary position for the sort
      };

      // Put the new task at the END of the current array
      const newList = [...currentDayTasks, newTask];

      // Sort with our "Completed First" rule
      const sortedList = newList.sort((a, b) => {
        // 1. Priority: Completed tasks (true) come before Incomplete (false)
        if (a.completed !== b.completed) {
          return a.completed ? -1 : 1;
        }
        // 2. Secondary: If completion is the same, sort by position
        return (a.position ?? 0) - (b.position ?? 0);
      });

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [dayOffset]: sortedList
        }
      };
    });

    const payload = {
      panelId: panelId,
      title: text,
      dueDate: dueDate,
      completed: false,
      urgency: isUrgent ? "URGENT" : "NORMAL",
      category: "GENERAL"
    };

    try {
      // 2. Sync with Backend
      const response = await postTodo(payload);

      // 3. Replace temp ID and sync real position from BE if returned
      setData(prev => {
        const updated = prev[activeTab][dayOffset].map(t =>
          t.id === tempId ? { ...t, id: response.data.id, position: response.data.position } : t
        );
        return { ...prev, [activeTab]: { ...prev[activeTab], [dayOffset]: updated } };
      });
    } catch (error) {
      console.error("Failed to create task:", error);
      fetchTasks(); // Rollback to server state on error
    }
  };

  const handleMoveTask = async (taskId, currentOffset, direction) => {
    const targetOffset = currentOffset + direction;

    // 1. Identify source and target lists
    const sourceList = data[activeTab][currentOffset] || [];
    const targetList = data[activeTab][targetOffset] || [];

    const taskToMove = sourceList.find(t => t.id === taskId);
    if (!taskToMove) return;

    // 2. Prepare API params
    const targetDueDate = getDateStringFromOffset(targetOffset);
    // Since we want it at the end, the new position is the current length of the target list
    const targetPosition = targetList.length;

    // 3. Optimistic UI Update
    // Remove from source
    const updatedSource = sourceList.filter(t => t.id !== taskId);

    // Add to target with new position metadata
    const movedTask = { ...taskToMove, position: targetPosition };
    const newTargetList = [...targetList, movedTask];

    // Sort target list to respect "Completed First" rule
    const sortedTarget = newTargetList.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? -1 : 1;
      return (a.position ?? 0) - (b.position ?? 0);
    });

    setData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [currentOffset]: updatedSource,
        [targetOffset]: sortedTarget
      }
    }));

    try {
      // 4. Sync with Backend
      // PATCH /todo/dueDate/{id}?position={targetPosition}&dueDate={targetDueDate}
      await patchTodoDueDate(taskId, targetPosition, targetDueDate);

      // Note: Because your BE deletes/re-creates, if you return the new object 
      // with a new ID, you'd update it here. If ID stays same, we are good.
    } catch (error) {
      console.error("Failed to move task due date:", error);
      // Rollback on failure
      fetchTasks();
    }
  };

  const handleEditTask = async (taskId, currentOffset, newText) => {
    // 1. Optimistic Update
    setData(prev => {
      const updatedList = prev[activeTab][currentOffset].map(t =>
        t.id === taskId ? { ...t, text: newText } : t
      );

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [currentOffset]: updatedList
        }
      };
    });

    try {
      await patchTodoTitle(taskId, { title: newText });
    } catch (error) {
      console.error("Failed to update title:", error);
      fetchTasks();
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

  const handleReorderTasks = async (dayOffset, newTasks) => {
    // 1. Identify which task was actually moved.
    // We compare its current index in the array to its stored 'position' property.
    const movedTask = newTasks.find((task, index) => task.position !== index);

    // 2. Update UI instantly (Optimistic)
    // We do this immediately so the drag-and-drop feels buttery smooth.
    updateList(dayOffset, newTasks);

    if (movedTask) {
      const newIndex = newTasks.indexOf(movedTask);

      try {
        // 3. Single API call to your backend
        await patchTodoPosition(movedTask.id, newIndex);

        // 4. SYNC LOCAL METADATA
        // Since your BE automatically reordered the others, we must update 
        // our local 'position' properties to match the new array indices.
        // This ensures the NEXT drag-and-drop identifies the correct moved item.
        newTasks.forEach((task, index) => {
          task.position = index;
        });

      } catch (error) {
        console.error("Failed to sync position:", error);
        // If the server fails, we rollback to the last known good state
        fetchTasks();
      }
    }
  };

  const handleDeleteTask = async (taskId, currentOffset) => {
    // 1. Optimistic Update: Remove from UI instantly
    setData(prev => {
      const updatedDay = prev[activeTab][currentOffset].filter(t => t.id !== taskId);

      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [currentOffset]: updatedDay
        }
      };
    });

    try {
      // 2. Sync with Backend
      await deleteTodoById(taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // Rollback: if the delete fails, re-fetch to bring the task back
      fetchTasks();
    }
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
        {/* NEW: Unified Control Row */}
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-gray-100/50">
          <ContextTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* HabitCreator now lives here, on the right */}
          <HabitCreator panelId={panelIds[activeTab]} />
        </div>

        <div className="flex flex-col space-y-3">

          {/* PAST SECTION (History) */}
          <PastSection
            data={currentData}
            onUpdateTasks={handleReorderTasks} // 2. Pass the new handler
            onMove={handleMoveTask}
            onEdit={handleEditTask}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask} // Pass it here
            onToggleTask={handleToggleTask}
            onLoadMore={() => setLimits(prev => ({ ...prev, before: prev.before + 1 }))}
          />

          {/* TODAY (Hero Section) */}
          <div className="-mt-2">
            <DaySection
              title={todayLabels.title}
              dateLabel={todayLabels.label}
              dayOffset={0}
              tasks={currentData['0'] || []}
              onUpdateTasks={(t) => handleReorderTasks('0', t)} // 3. Pass the new handler
              onCreateTask={handleCreateTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask} // Pass it here
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
            onUpdateTasks={(t) => handleReorderTasks('1', t)} // 3. Pass the new handler
            onCreateTask={handleCreateTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask} // Pass it here
            onMove={handleMoveTask}
            onEdit={handleEditTask}
          />

          {/* FUTURE SECTION (Upcoming) */}
          <FutureSection
            data={currentData}
            onUpdateTasks={handleReorderTasks} // 2. Pass the new handler
            onCreateTask={handleCreateTask}
            onMove={handleMoveTask}
            onEdit={handleEditTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask} // Pass it here
            onLoadMore={() => setLimits(prev => ({ ...prev, after: prev.after + 2 }))}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}