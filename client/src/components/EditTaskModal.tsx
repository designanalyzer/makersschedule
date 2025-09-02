import React, { useState, useEffect } from 'react';
import { ScheduledTask, TaskEditInput } from '../services/taskService';

const categories = [
  { label: 'Deep Work', value: 'deepwork', color: '#3B82F6' },
  { label: 'Busywork', value: 'busywork', color: '#F59E0B' },
  { label: 'Goals', value: 'goals', color: '#10B981' },
];

const colorOptions = [
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

const durations = [
  { label: '30 min', value: '30 minutes' },
  { label: '1 h', value: '1 hour' },
  { label: '2 h', value: '2 hours' },
  { label: '3 h', value: '3 hours' },
];

export default function EditTaskModal({ 
  open, 
  onClose, 
  onSave, 
  task 
}: {
  open: boolean;
  onClose: () => void;
  onSave: (taskId: string, updates: TaskEditInput) => void;
  task: ScheduledTask | null;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // Add description state
  const [category, setCategory] = useState(categories[0].value);
  const [color, setColor] = useState(categories[0].color);
  const [duration, setDuration] = useState(durations[1].value);

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description || ''); // Set description
      setCategory(task.category);
      setColor(task.color);
      setDuration(task.duration);
    }
  }, [task]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setColor(categories.find(c => c.value === cat)?.color || categories[0].color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !task) return;
    
    onSave(task.id, { 
      name, 
      description: description.trim() || undefined, // Include description
      category, 
      color, 
      duration 
    });
    onClose();
  };

  if (!open || !task) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
            <input
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              required
              autoFocus
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          
          {/* Duration and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
                value={duration}
                onChange={e => setDuration(e.target.value)}
              >
                {durations.map(dur => (
                  <option key={dur.value} value={dur.value}>{dur.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-colors duration-200"
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map(colorOption => (
                <button
                  type="button"
                  key={colorOption}
                  onClick={() => setColor(colorOption)}
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
              className="px-6 py-3 rounded-lg bg-brand-purple hover:bg-brand-blue text-white text-sm font-medium transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 