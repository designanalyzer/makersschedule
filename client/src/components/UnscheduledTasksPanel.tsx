import React from 'react';
import { UnscheduledTask } from '../services/taskService';

const categories = [
  { label: 'Deep Work', value: 'deepwork' },
  { label: 'Busywork', value: 'busywork' },
  { label: 'Projects', value: 'projects' },
];

const filterOptions = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Projects', value: 'projects' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Unscheduled', value: 'unscheduled' },
];

export default function UnscheduledTasksPanel({ tasks = [], onDragStart, onRemove }: {
  tasks?: UnscheduledTask[];
  onDragStart: (e: React.DragEvent, task: UnscheduledTask) => void;
  onRemove: (id: string) => void;
}) {
  // Separate regular tasks from project tasks
  const regularTasks = tasks.filter(task => !task.id.startsWith('project-'));
  const projectTasks = tasks.filter(task => task.id.startsWith('project-'));

  // Group project tasks by project name and task type
  const projectTasksByProject = projectTasks.reduce((acc, task) => {
    // Extract project name from task name (format: "Project Name: Step text")
    const projectName = task.name.split(':')[0];
    if (!acc[projectName]) {
      acc[projectName] = { ongoing: [], next: [] };
    }
    
    if (task.task_type === 'ongoing') {
      acc[projectName].ongoing.push(task);
    } else if (task.task_type === 'next') {
      acc[projectName].next.push(task);
    } else {
      // Fallback for tasks without task_type
      acc[projectName].ongoing.push(task);
    }
    
    return acc;
  }, {} as Record<string, { ongoing: UnscheduledTask[], next: UnscheduledTask[] }>);

  // Limit to exactly 2 tasks per project (1 ongoing + 1 next)
  Object.keys(projectTasksByProject).forEach(projectName => {
    projectTasksByProject[projectName].ongoing = projectTasksByProject[projectName].ongoing.slice(0, 1);
    projectTasksByProject[projectName].next = projectTasksByProject[projectName].next.slice(0, 1);
  });

  return (
    <div className="w-full flex-1 overflow-y-auto p-4">
      {/* Project Tasks - Show First */}
      {Object.keys(projectTasksByProject).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your ongoing tasks</h3>
          {Object.entries(projectTasksByProject).map(([projectName, projectTasks]) => (
            <div key={projectName} className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">
                {projectName}
              </h4>
              
              {/* Ongoing Task */}
              {projectTasks.ongoing.length > 0 && (
                <div className="mb-2">
                  <div
                    className="rounded px-3 py-2 cursor-grab flex items-center justify-between group"
                    style={{
                      backgroundColor: `${projectTasks.ongoing[0].color}20`,
                      border: `2px dotted ${projectTasks.ongoing[0].color}`
                    }}
                    draggable
                    onDragStart={(e) => {
                      console.log('Sidebar drag start for project task:', projectTasks.ongoing[0]);
                      console.log('Drag event details:', {
                        dataTransfer: e.dataTransfer,
                        target: e.currentTarget,
                        taskData: JSON.stringify(projectTasks.ongoing[0])
                      });
                      onDragStart(e, projectTasks.ongoing[0]);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{projectTasks.ongoing[0].name.split(': ')[1] || projectTasks.ongoing[0].name}</span>
                      <span className="text-xs opacity-75">({projectTasks.ongoing[0].duration})</span>
                    </div>
                    {/* No delete button for project tasks */}
                  </div>
                </div>
              )}
              
              {/* Next Task */}
              {projectTasks.next.length > 0 && (
                <div className="mb-2">
                  <div
                    className="rounded px-3 py-2 cursor-grab flex items-center justify-between group"
                    style={{
                      backgroundColor: `${projectTasks.next[0].color}20`,
                      border: `2px dotted ${projectTasks.next[0].color}`
                    }}
                    draggable
                    onDragStart={(e) => {
                      console.log('Sidebar drag start for project task:', projectTasks.next[0]);
                      console.log('Drag event details:', {
                        dataTransfer: e.dataTransfer,
                        target: e.currentTarget,
                        taskData: JSON.stringify(projectTasks.next[0])
                      });
                      onDragStart(e, projectTasks.next[0]);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{projectTasks.next[0].name.split(': ')[1] || projectTasks.next[0].name}</span>
                      <span className="text-xs opacity-75">({projectTasks.next[0].duration})</span>
                    </div>
                    {/* No delete button for project tasks */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Regular Tasks */}
      {categories.map(cat => (
        <div key={cat.value} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{cat.label}</h3>
          <div className="space-y-2">
            {regularTasks.filter(t => t.category === cat.value).length === 0 && (
              <div className="text-xs text-gray-400">No tasks</div>
            )}
            {regularTasks.filter(t => t.category === cat.value).map(task => (
              <div
                key={task.id}
                className="rounded px-3 py-2 cursor-grab flex items-center justify-between group"
                style={{
                  backgroundColor: `${task.color}20`,
                  border: `2px dotted ${task.color}`
                }}
                draggable
                onDragStart={(e) => {
                  console.log('Sidebar drag start for regular task:', task);
                  console.log('Drag event details:', {
                    dataTransfer: e.dataTransfer,
                    target: e.currentTarget,
                    taskData: JSON.stringify(task)
                  });
                  onDragStart(e, task);
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{task.name}</span>
                  <span className="text-xs opacity-75">({task.duration})</span>
                </div>
                <button
                  onClick={() => onRemove(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 