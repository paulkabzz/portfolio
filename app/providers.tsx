"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./context/auth-context";
import { ProjectProvider } from "./context/project-context";
import { ExperienceProvider } from "./context/experience-context";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster } from "@/components/ui/toaster";
import { MessagesProvider } from "./context/messages-context";
import { JobProvider } from "./context/job-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProjectProvider>
          <ExperienceProvider>
            <Toaster />
            <MessagesProvider>
                <JobProvider>
                  {children}
                </JobProvider>
            </MessagesProvider>
          </ExperienceProvider>
        </ProjectProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
