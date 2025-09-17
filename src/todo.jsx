import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiSave } from 'react-icons/fi';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Todo App</h1>
        
        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-[80px] justify-center"
          >
            <FiPlus size={18} /> Add
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 rounded-lg border ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 shadow-sm'}`}
              >
                {editingId === task.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 border rounded"
                      autoFocus
                    />
                    <button 
                      onClick={() => saveEdit(task.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      title="Save"
                    >
                      <FiSave />
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Cancel"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span 
                        className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                      >
                        {task.text}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {tasks.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
          </div>
        )}
      </div>
    </div>
  );
}

export default Todo;