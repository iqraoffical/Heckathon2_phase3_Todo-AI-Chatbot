'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ProjectSelector from './ProjectSelector';

interface TaskFormData {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  category?: string;
  estimatedTime?: number;
  actualTimeSpent?: number;
  projectId?: string;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
    tags: initialData?.tags || [],
    category: initialData?.category || '',
    estimatedTime: initialData?.estimatedTime || undefined,
    actualTimeSpent: initialData?.actualTimeSpent || undefined,
    projectId: initialData?.projectId || ''
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setFormData({
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'todo',
      priority: initialData?.priority || 'medium',
      dueDate: initialData?.dueDate || '',
      tags: initialData?.tags || [],
      category: initialData?.category || '',
      estimatedTime: initialData?.estimatedTime || undefined,
      actualTimeSpent: initialData?.actualTimeSpent || undefined,
      projectId: initialData?.projectId || ''
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (name === 'estimatedTime' || name === 'actualTimeSpent') {
      const numValue = value === '' ? undefined : parseInt(value, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-white">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" className="text-white">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-yellow-500/30">
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority" className="text-white">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleSelectChange('priority', value)}
          >
            <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-yellow-500/30">
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="dueDate" className="text-white">Due Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
        />
      </div>

      <div>
        <Label htmlFor="tags" className="text-white">Tags</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="tags"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300 flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddTag}
            variant="outline"
            className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="border-yellow-500/30 text-yellow-200 bg-black/20 flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-xs hover:text-white"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" className="text-white">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-yellow-500/30">
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="projectId" className="text-white">Project</Label>
          <ProjectSelector
            value={formData.projectId || ''}
            onChange={(value) => handleSelectChange('projectId', value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="estimatedTime" className="text-white">Estimated Time (minutes)</Label>
          <Input
            id="estimatedTime"
            name="estimatedTime"
            type="number"
            value={formData.estimatedTime ?? ''}
            onChange={handleChange}
            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="actualTimeSpent" className="text-white">Actual Time Spent (minutes)</Label>
          <Input
            id="actualTimeSpent"
            name="actualTimeSpent"
            type="number"
            value={formData.actualTimeSpent ?? ''}
            onChange={handleChange}
            className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
        >
          {initialData?.title ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;