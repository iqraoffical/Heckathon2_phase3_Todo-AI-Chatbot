'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, Calendar, Flag, CheckCircle, Circle, Clock, BarChart3, Target, FolderOpen } from 'lucide-react';
import { Task, Project } from '@/lib/api';
import { apiClient } from '@/lib/api';
import ProjectManagement from '@/components/ProjectManagement';
import Sidebar from '@/components/Sidebar';

export default function ProjectsPage() {
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
        setError('Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Stats calculation
  const totalProjects = projects.length;

  return (
    <div className="pt-32 p-4 md:p-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[calc(100vh-200px)]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 bg-clip-text text-transparent font-extrabold">
                My Projects
              </h1>
              <p className="text-white mt-2 font-medium">Manage your projects efficiently</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white text-high-contrast">Total Projects</CardTitle>
                  <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white text-high-contrast">{totalProjects}</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass backdrop-blur-xl border-yellow-500/30 bg-gradient-to-br from-black/30 to-black/10">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-white text-high-contrast font-bold">Your Projects</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/tasks">
                        <Button variant="outline" className="border-yellow-500/30 text-white hover:bg-yellow-500/10">
                          View Tasks
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProjectManagement />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}