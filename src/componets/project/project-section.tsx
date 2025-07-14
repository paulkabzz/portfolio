import ProjectCard from './project-card';
import styles from './index.module.css';

const ProjectsSection: React.FC = () => {
  const projects = [
    {
      title: "TaskFlow Manager",
      description: "A modern task management application built with React and TypeScript. Features real-time collaboration, drag-and-drop functionality, and intuitive user interface design.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
      technologies: ["React", "TypeScript", "CSS Modules", "Node.js", "PostgreSQL"],
      githubUrl: "https://github.com/username/taskflow-manager",
      liveUrl: "https://taskflow-manager.vercel.app",
      date: "2024",
      stars: 127,
      featured: true
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Built with modern web technologies.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      technologies: ["Next.js", "Prisma", "Stripe", "React Query", "CSS Modules"],
      githubUrl: "https://github.com/username/ecommerce-platform",
      liveUrl: "https://ecommerce-demo.vercel.app",
      date: "2024",
      stars: 89
    },
    {
      title: "Weather Dashboard",
      description: "Interactive weather application with location-based forecasts, beautiful visualizations, and responsive design.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
      technologies: ["React", "Chart.js", "OpenWeather API", "CSS Modules"],
      githubUrl: "https://github.com/username/weather-dashboard",
      liveUrl: "https://weather-dashboard-demo.vercel.app",
      date: "2023",
      stars: 45
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>
            Featured Projects
          </h1>
          <p className={styles.sectionDescription}>
            Explore my latest work and side projects. Each project demonstrates different skills and technologies I've worked with.
          </p>
        </div>
        
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;