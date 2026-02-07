'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient, Project } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectManagementProps {
  userId?: string;
}

const ProjectManagement = ({ userId }: ProjectManagementProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await apiClient.getProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      const createdProject = await apiClient.createProject(newProject);
      setProjects([...projects, createdProject]);
      setNewProject({ name: '', description: '' });
      setIsCreating(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editForm.name.trim()) return;

    try {
      const updatedProject = await apiClient.updateProject(editingProject.id, editForm);
      
      setProjects(projects.map(p => 
        p.id === editingProject.id ? updatedProject : p
      ));
      
      setEditingProject(null);
      setEditForm({ name: '', description: '' });
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project. Please try again.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? This will not delete associated tasks.')) {
      return;
    }

    try {
      await apiClient.deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description || ''
    });
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditForm({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass backdrop-blur-xl border border-red-500/30 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Project Card */}
      {!isCreating && (
        <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
          <CardHeader>
            <CardTitle className="text-white text-high-contrast flex items-center justify-between">
              <span>Projects</span>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
              >
                Create New Project
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Create Project Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
              <CardHeader>
                <CardTitle className="text-white text-high-contrast">Create New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label htmlFor="project-name" className="block text-sm font-medium text-white text-high-contrast mb-1">
                      Project Name *
                    </label>
                    <Input
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                      required
                      className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="project-description" className="block text-sm font-medium text-white text-high-contrast mb-1">
                      Description
                    </label>
                    <Textarea
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Enter project description"
                      className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setNewProject({ name: '', description: '' });
                      }}
                      className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Project Form */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
              <CardHeader>
                <CardTitle className="text-white text-high-contrast">Edit Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProject} className="space-y-4">
                  <div>
                    <label htmlFor="edit-project-name" className="block text-sm font-medium text-white text-high-contrast mb-1">
                      Project Name *
                    </label>
                    <Input
                      id="edit-project-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Enter project name"
                      required
                      className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-project-description" className="block text-sm font-medium text-white text-high-contrast mb-1">
                      Description
                    </label>
                    <Textarea
                      id="edit-project-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Enter project description"
                      className="bg-black/20 border-yellow-500/30 text-white placeholder:text-yellow-300 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEditing}
                      className="border-yellow-500/30 text-white hover:bg-yellow-500/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
                    >
                      Update Project
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10 h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-high-contrast">{project.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(project)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-400"
                      aria-label="Edit project"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                      aria-label="Delete project"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                {project.description && (
                  <p className="text-gray-300 text-secondary mb-4">{project.description}</p>
                )}
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700/50">
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-200">
                    ID: {project.id.substring(0, 8)}...
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Updated: {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && !isCreating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full w-16 h-16 flex items-center justify-center inline-block">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">No projects yet</h3>
          <p className="mt-2 text-sm text-white/70">Get started by creating a new project.</p>
          <Button 
            onClick={() => setIsCreating(true)}
            className="mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
          >
            Create Your First Project
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectManagement;