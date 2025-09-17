import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiSave, 
  FiFilter, 
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiCircle,
  FiInfo
} from 'react-icons/fi';
import { motion } from 'framer-motion';
const { AnimatePresence } = motion;

const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    [Priority.LOW]: 'bg-blue-100 text-blue-800',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Priority.HIGH]: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    [Priority.LOW]: 'Low',
    [Priority.MEDIUM]: 'Medium',
    [Priority.HIGH]: 'High',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${priorityStyles[priority] || ''}`}>
      {priorityLabels[priority]}
    </span>
  );
};

const TodoItem = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit, 
  isEditing, 
  onSaveEdit, 
  editText, 
  onEditTextChange, 
  onCancelEdit 
}) => {
  const priorityIcons = {
    [Priority.LOW]: <FiClock className="text-blue-500" />,
    [Priority.MEDIUM]: <FiAlertCircle className="text-yellow-500" />,
    [Priority.HIGH]: <FiAlertCircle className="text-red-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
      className={`p-4 rounded-xl border transition-all duration-200 ${
        task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={onEditTextChange}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            onClick={onSaveEdit}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Save"
          >
            <FiSave />
          </button>
          <button
            onClick={onCancelEdit}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            title="Cancel"
          >
            <FiX />
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleComplete}
            className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
              task.completed 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            {task.completed && <FiCheck size={12} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p 
                className={`text-sm font-medium ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {task.text}
              </p>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-2">
              {priorityIcons[task.priority]}
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {!task.completed && (
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

function Todo() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState(Priority.MEDIUM);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const taskText = newTask.trim();
    if (taskText) {
      const newTaskObj = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: priority || Priority.MEDIUM,
        createdAt: new Date().toISOString()
      };
      setTasks(prevTasks => [newTaskObj, ...prevTasks]);
      setNewTask('');
      setPriority(Priority.MEDIUM);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, text: editText } : task
      ));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const tasksRemaining = tasks.filter(task => !task.completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 pb-0">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Task Manager
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              {tasksRemaining} {tasksRemaining === 1 ? 'task' : 'tasks'} remaining
            </p>
            
            <form onSubmit={addTask} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border-l pl-2 pr-6 py-1 text-sm text-gray-600 focus:outline-none"
                  >
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.HIGH}>High</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap font-medium shadow-sm"
                >
                  <FiPlus size={18} /> Add Task
                </button>
              </div>
            </form>
          </div>

          <div className="border-t border-gray-100">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <div className="flex space-x-2">
                {['all', 'active', 'completed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      filter === filterType
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
              {tasks.some(task => task.completed) && (
                <button
                  onClick={clearCompleted}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear completed
                </button>
              )}
            </div>

            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <FiCheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-500">
                      {filter === 'all' 
                        ? 'No tasks yet. Add one above!' 
                        : filter === 'active' 
                          ? 'No active tasks' 
                          : 'No completed tasks'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {filter === 'all' ? 'Get started by adding a new task' : ''}
                    </p>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => (
                    <TodoItem
                      key={task.id}
                      task={task}
                      onToggleComplete={() => toggleComplete(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={() => startEditing(task)}
                      isEditing={editingId === task.id}
                      onSaveEdit={() => saveEdit(task.id)}
                      editText={editText}
                      onEditTextChange={(e) => setEditText(e.target.value)}
                      onCancelEdit={cancelEdit}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 flex justify-between items-center">
              <span>{tasksRemaining} {tasksRemaining === 1 ? 'item' : 'items'} left</span>
              <div className="flex items-center gap-1">
                <FiInfo className="text-gray-400" />
                <span>click to edit a task</span>
              </div>
            </div>
          )}
        </motion.div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p className="mt-1">Created with React & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

export default Todo;