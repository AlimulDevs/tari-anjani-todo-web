import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState<'semua' | 'hari-ini' | 'minggu-ini' | 'bulan-ini'>('semua');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTodos(parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: new Date(todo.dueDate)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        dueDate: new Date(selectedDate)
      };
      
      // Add animation for new item
      setAnimatingItems(prev => new Set([...prev, todo.id]));
      setTodos([todo, ...todos]);
      setNewTodo('');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(todo.id);
          return newSet;
        });
      }, 600);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    // Add exit animation
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
    if (todoElement) {
      todoElement.classList.add('animate-slideOut');
      setTimeout(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      }, 300);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const getFilteredTodos = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return todos.filter(todo => {
      const todoDate = new Date(todo.dueDate.getFullYear(), todo.dueDate.getMonth(), todo.dueDate.getDate());
      
      switch (filter) {
        case 'hari-ini':
          return todoDate.getTime() === today.getTime();
        case 'minggu-ini':
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return todoDate >= weekStart && todoDate <= weekEnd;
        case 'bulan-ini':
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          return todoDate >= monthStart && todoDate <= monthEnd;
        default:
          return true;
      }
    });
  };

  const filteredTodos = getFilteredTodos();

  const filters = [
    { value: 'semua', label: 'Semua' },
    { value: 'hari-ini', label: 'Hari Ini' },
    { value: 'minggu-ini', label: 'Minggu Ini' },
    { value: 'bulan-ini', label: 'Bulan Ini' }
  ];

  const isOverdue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const isToday = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    return today.toDateString() === due.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Add Todo Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-pink-200/50 transform hover:scale-[1.02] transition-all duration-300">
        <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          Tambah Task Baru
        </h2>
        <div className="space-y-5">
          <div className="relative">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Apa yang mau dikerjain hari ini? ✨"
              className="w-full p-4 pr-12 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all bg-white/70 text-gray-800 placeholder-pink-400"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-pink-700 text-sm font-medium mb-2">Tanggal Target</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all bg-white/70"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addTodo}
                className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-4 rounded-2xl hover:from-pink-500 hover:to-rose-500 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center justify-center gap-3 font-medium"
              >
                <Plus size={20} />
                <span>Tambah Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-pink-200/50">
        <div className="flex flex-wrap gap-3">
          {filters.map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value as any)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all transform hover:scale-105 ${
                filter === filterOption.value
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg scale-105'
                  : 'text-pink-700 hover:bg-pink-100 bg-pink-50'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-12 text-center border border-pink-200/50">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-pink-800 mb-2">Belum ada task nih!</h3>
            <p className="text-pink-600 text-lg">Yuk bikin yang pertama dan mulai produktif! 💪✨</p>
          </div>
        ) : (
          filteredTodos.map((todo, index) => (
            <div
              key={todo.id}
              data-todo-id={todo.id}
              className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-200/50 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
                todo.completed ? 'opacity-75 bg-gray-50/90' : ''
              } ${
                animatingItems.has(todo.id) ? 'animate-slideInScale' : 'animate-fadeInUp'
              } ${
                isOverdue(todo.dueDate) && !todo.completed ? 'border-red-300 bg-red-50/90' : ''
              } ${
                isToday(todo.dueDate) && !todo.completed ? 'border-yellow-300 bg-yellow-50/90' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`relative w-7 h-7 rounded-full border-3 transition-all duration-300 transform hover:scale-110 ${
                      todo.completed
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-400 shadow-lg'
                        : 'border-pink-300 hover:border-pink-400 bg-white hover:bg-pink-50'
                    }`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    ) : (
                      <Circle className="w-4 h-4 text-pink-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                  
                  {/* Task Content */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-full p-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 bg-white/70"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className={`text-lg font-medium transition-all ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}>
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-pink-400" />
                          <span className={`text-sm font-medium ${
                            isOverdue(todo.dueDate) && !todo.completed
                              ? 'text-red-600'
                              : isToday(todo.dueDate) && !todo.completed
                              ? 'text-yellow-600'
                              : 'text-pink-600'
                          }`}>
                            {todo.dueDate.toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          {isOverdue(todo.dueDate) && !todo.completed && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                              Terlambat
                            </span>
                          )}
                          {isToday(todo.dueDate) && !todo.completed && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full font-medium">
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-3 text-pink-600 hover:bg-pink-100 rounded-xl transition-all transform hover:scale-110"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-all transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideInScale {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: translateY(5px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideInScale {
          animation: slideInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-slideOut {
          animation: slideOut 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
};