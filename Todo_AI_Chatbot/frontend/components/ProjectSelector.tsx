'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, Project } from '@/lib/api';

interface ProjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  userId?: string;
}

const ProjectSelector = ({ value, onChange, userId }: ProjectSelectorProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await apiClient.getProjects();
        setProjects(projectsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
          <SelectValue placeholder="Loading projects..." />
        </SelectTrigger>
        <SelectContent className="bg-black text-white border-yellow-500/30">
          <SelectItem value="">Loading...</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (error) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
          <SelectValue placeholder="Error loading projects" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white border-yellow-500/30">
          <SelectItem value="">Error: {error}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-black/20 border-yellow-500/30 text-white">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent className="bg-black text-white border-yellow-500/30">
        <SelectItem value="">No Project</SelectItem>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectSelector;