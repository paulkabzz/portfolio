import React from 'react';
import { Github, ExternalLink, Calendar, Code, Star } from 'lucide-react';
import styles from './index.module.css';

interface ProjectCardProps {
  title?: string;
  description?: string;
  image?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  date?: string;
  stars?: number;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title = "TaskFlow Manager",
  description = "A modern task management application built with React and TypeScript. Features real-time collaboration, drag-and-drop functionality, and intuitive user interface design.",
  image = "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
  technologies = ["React", "TypeScript", "CSS Modules", "Node.js", "PostgreSQL"],
  githubUrl = "https://github.com/username/taskflow-manager",
  liveUrl = "https://taskflow-manager.vercel.app",
  date = "2024",
  stars = 127,
  featured = false
}) => {
  return (
    <div className={`${styles.card} ${styles.group}`}>
      {/* Featured Badge */}
      {featured && (
        <div className={styles.featuredBadge}>
          Featured
        </div>
      )}
      
      {/* Project Image */}
      <div className={styles.imageContainer}>
        <img 
          src={image} 
          alt={title}
          className={styles.projectImage}
        />
        <div className={styles.imageOverlay} />
      </div>
      
      {/* Card Content */}
      <div className={styles.cardContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h3 className={styles.title}>
              {title}
            </h3>
            <div className={styles.metadata}>
              <span className={styles.dateInfo}>
                <Calendar className={styles.icon} />
                {date}
              </span>
              {stars && (
                <span className={styles.starInfo}>
                  <Star className={styles.starIcon} />
                  {stars}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className={styles.description}>
          {description}
        </p>
        
        {/* Technologies */}
        <div className={styles.techContainer}>
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className={styles.techTag}
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.githubButton}`}
          >
            <Github className={styles.buttonIcon} />
            Code
          </a>
          
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.button} ${styles.liveButton}`}
            >
              <ExternalLink className={styles.buttonIcon} />
              Live Demo
            </a>
          )}
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className={styles.hoverGlow} />
    </div>
  );
};

export default ProjectCard;