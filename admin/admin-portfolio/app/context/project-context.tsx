import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, getProjects, createProject, updateProject, deleteProject, CreateProjectData } from '@/lib/project'

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  addProject: (data: CreateProjectData) => Promise<Project>;
  editProject: (id: string, data: Partial<CreateProjectData>) => Promise<Project>;
  removeProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  refreshProjects: () => Promise<void>;
  clearError: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new project
  const addProject = async (data: CreateProjectData): Promise<Project> => {
    try {
      setError(null);
      const newProject = await createProject(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update an existing project
  const editProject = async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    try {
      setError(null);
      const updatedProject = await updateProject(id, data);
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? updatedProject : project
        )
      );
      return updatedProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a project
  const removeProject = async (id: string): Promise<void> => {
    try {
      setError(null);
      await deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Get a single project by ID
  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  // Refresh projects (alias for fetchProjects)
  const refreshProjects = async (): Promise<void> => {
    await fetchProjects();
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const contextValue: ProjectContextType = {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
    getProjectById,
    refreshProjects,
    clearError,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

// Export the context for advanced usage
export { ProjectContext };