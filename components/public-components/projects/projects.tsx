"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/app/context/project-context";
import { Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { parseTextWithFormatting } from '@/components/utils';
import { Badge } from '@/components/ui/badge';

const ProjectSkeletonCard = () => (
  <Card className="border-secondary">
    <CardContent className="p-4">
      {/* Image Skeleton */}
      <div className="w-full h-[250px] mb-5 bg-gray-200 rounded-sm animate-pulse overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Header with title and status */}
      <div className="flex justify-between mb-2 items-center">
        <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
      </div>
      
      {/* Description skeleton - multiple lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      
      {/* Technology tags skeleton */}
      <div className="flex gap-2 mb-5">
        <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex w-full relative flex-col gap-5">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

const Projects = () => {
  const { projects, loading } = useProjects();

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" id='projects'>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#131313] mb-0">Projects</h2>
          <div className="w-24 h-1 bg-[#059669] mx-auto rounded-full"></div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectSkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Loaded projects */}
        {!loading && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="border-secondary">
                <CardContent className="p-4">
                  <div className="w-full h-auto max-h-[290px] mb-5 overflow-hidden rounded-sm">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex justify-between mb-2 items-center">
                    <h3 className="font-semibold text-primary mb-1">{project.name}</h3>
                    {!project.completed && (
                      <Badge variant="secondary" className="bg-yellow-600/10 text-yellow-700 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Incomplete
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-primary/70 mb-2 line-clamp-2">
                    {parseTextWithFormatting(project.description)}
                  </p>
                  
                  <div className="flex gap-2">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-secondary text-primary text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="px-2 py-1 bg-secondary text-primary text-xs rounded">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className='flex w-full relative flex-col gap-5 mt-5'>
                      <Button className='w-full' disabled={!project.github_url}>
                        <Link href={project.github_url} className='w-full h-full' target='_blank'>
                          Code
                        </Link>
                      </Button>
                      <Button className='w-full' disabled={!project.live_url}>
                        <Link 
                          href={project.live_url} 
                          className='w-full h-full flex items-center justify-center gap-2' 
                          target='_blank'
                        >
                          Live Project <ExternalLink className="!h-3 !w-3 text-white" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-primary/30" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">No projects yet</h3>
            <p className="text-primary/60 mb-6">Start building your portfolio by adding your first project.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects