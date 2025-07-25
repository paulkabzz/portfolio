"use client";

import Hero from "@/components/public-components/home/hero";
import HeroSkeleton from "@/components/public-components/home/hero-skeleton";
import NavBar, { NavLink } from "@/components/public-components/navbar/navbar";
import { toast } from "@/hooks/use-toast";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { PersonalInfo } from "./dashboard/page";
import About from "@/components/public-components/about/about";
import AboutSkeleton from "@/components/public-components/about/about-skeleton";
import Projects from "@/components/public-components/projects/projects";
import Experience from "@/components/public-components/experience/experience";
import Contact from "@/components/public-components/contact/contact";
import Footer from "@/components/public-components/footer/footer";

export default function Home() {

  const [isLoading, setIsLoading] = useState<boolean>(true); // Set initial loading to true
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>();

  useEffect(() => {
    loadPersonalDetails();
  }, []);

  const loadPersonalDetails = async () => {
    try {
      setIsLoading(true)
      const response = await databases.getDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.userCollectionId!,
        appwriteConfig.userDocumentId!
      )
      
      const userData = response as any
      const profileData = {
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        about: userData.about || "",
        image_url: userData.image_url || "",
        about_image_url: userData.about_image_url || "",
        location: userData.location || "",
        phone: userData.phone || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        headline: userData.headline || "",
        role: userData.role || ""
      }

      setPersonalInfo(profileData);
      
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const links: NavLink[] = [
    {
        label: "About",
        href: "#about"
    },
    {
        label: "Projects",
        href: "#projects"
    },
    // {
    //     label: "Education",
    //     href: "#education"
    // },
    {
        label: "Experience",
        href: "#experience"
    },
    {
        label: "Contact",
        href: "#contact"
    }
  ];

  return (
    <div className="">
        <NavBar links={links} name={personalInfo?.name || "Name"}/>
        
        {isLoading ? (
          <HeroSkeleton />
        ) : (
          <Hero 
            headline={personalInfo?.headline ?? `Hello, I'm ${personalInfo?.name}`} 
            name={personalInfo?.name || "Name"} 
            avatar_url={personalInfo?.image_url || "/github.png"} 
            occupation={personalInfo?.role ?? "Student"} 
            github={personalInfo?.github} 
            linkedin={personalInfo?.linkedin} 
          />
        )}
        
        {isLoading ? (
          <AboutSkeleton />
        ) : (
          personalInfo?.about && <About img={personalInfo.about_image_url} about={personalInfo?.about} />
        )}
        <Projects />
        <Experience />
        <Contact location={personalInfo?.location} email={personalInfo?.email} phone={personalInfo?.phone}/>
        <Footer name={personalInfo?.name} surname={personalInfo?.surname} github={personalInfo?.github} />
    </div>
  );
}