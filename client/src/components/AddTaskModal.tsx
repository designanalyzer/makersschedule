import React, { useState } from 'react';

const categories = [
  { label: 'Deep Work', value: 'deepwork' },
  { label: 'Busywork', value: 'busywork' },
  { label: 'Goals', value: 'goals' },
];

const COLORS = [
  // Bright and vibrant colors - more distinct
  '#F5FF90', // Bright lime green
  '#E6B800', // Darker golden yellow - better contrast
  
  // Cool tones - more variety
  '#EDF5FC', // Light blue
  '#A8D8EA', // Sky blue - more distinct
  
  // Warm tones - more variety
  '#F7A072', // Orange
  '#FF6B6B', // Coral red - more distinct from orange
  
  // Rich colors - more variety
  '#8367C7', // Purple
  '#6C5CE7', // Electric purple - more distinct
  
  // Earth tones - more variety
  '#439A86', // Teal
  '#00B894', // Emerald green - more distinct from teal
];

export type TaskInput = {
  name: string;
  description?: string; // Add description field
  category: string;
  color: string;
  duration: string;
  day?: number;
  hour?: number;
};

export default function AddTaskModal({ open, onClose, onAdd, slot }: {
  open: boolean;
  onClose: () => void;
  onAdd: (task: TaskInput) => void;
  slot?: { day: number; hour: number };
}) {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState(''); // Add description state
  const [category, setCategory] = useState(categories[0].value);
  const [color, setColor] = useState(COLORS[0]);
  const [duration, setDuration] = useState('1 hour');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      const taskData = { 
        name: taskName.trim(), 
        description: description.trim() || undefined, // Include description
        category, 
        color, 
        duration,
        ...(slot && { day: slot.day, hour: slot.hour })
      };
      onAdd(taskData);
      setTaskName('');
      setDescription(''); // Reset description
      setCategory(categories[0].value);
      setColor(COLORS[0]);
      setDuration('1 hour');
      onClose();
    }
  };

  const handleColorPick = (value: string) => setColor(value);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          {slot ? `Add Task at ${slot.hour}:00` : 'Add Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
            <input
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
              placeholder="Enter task name"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              maxLength={100}
              required
              autoFocus
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
              placeholder="Add a description for this task"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          
          {/* Category and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
              </select>
            </div>
          </div>
          
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(colorOption => (
                <button
                  type="button"
                  key={colorOption}
                  onClick={() => handleColorPick(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 ${
                    color === colorOption 
                      ? 'border-brand-blue shadow-lg' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: colorOption,
                    borderRadius: '50%' 
                  }}
                  aria-label={colorOption}
                >
                  {color === colorOption && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-brand-purple hover:bg-brand-blue text-white text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 