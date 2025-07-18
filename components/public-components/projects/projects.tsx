"use client";

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useProjects } from "@/app/context/project-context"
import { Clock, ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button';
import { parseTextWithFormatting } from '@/components/utils';
import { Badge } from '@/components/ui/badge';

const Projects = () => {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <p className="text-primary/70 mt-2">My portfolio projects and work</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-secondary animate-pulse">
              <CardContent className="p-4">
                <div className="w-full h-auto mb-5 bg-secondary rounded-sm"></div>
                <div className="h-4 bg-secondary rounded mb-2"></div>
                <div className="h-3 bg-secondary rounded mb-2"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-secondary rounded"></div>
                  <div className="h-6 w-16 bg-secondary rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" id='projects'>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl lg:text-2xl font-bold text-[#131313] mb-0">Projects</h2>
          <div className="w-24 h-1 bg-[#059669] mx-auto rounded-full"></div>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="border-secondary">
                <CardContent className="p-4">
                  <div className="w-full h-auto max-h-[250px] mb-5 overflow-hidden rounded-sm">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.name}
                      className="w-full object-cover"
                    />
                  </div>
                  
                    <div className="flex justify-between mb-2 items-center">
                        <h3 className="font-semibold text-primary mb-1">{project.name}</h3>
                        {!project.completed && <Badge variant="secondary" className="bg-yellow-600/10 text-yellow-700 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Incomplete
                        </Badge>
                        }
                    </div>
                  
                  <p className="text-sm text-primary/70 mb-2 line-clamp-2">{parseTextWithFormatting(project.description)}</p>
                  
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
                            <Link href={project.github_url} className='w-full h-full' target='_blank'>Code</Link>
                        </Button>
                        <Button className='w-full' disabled={!project.live_url}>
                            <Link href={project.live_url} className='w-full h-full flex items-center justify-center gap-2' target='_blank'>Live Project <ExternalLink className="!h-3 !w-3 text-white" /></Link>
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
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