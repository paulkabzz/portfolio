"use client";

import Hero from "@/components/public-components/home/hero";
import NavBar, { NavLink } from "@/components/public-components/navbar/navbar";
import { toast } from "@/hooks/use-toast";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { PersonalInfo } from "./dashboard/page";

export default function Home() {

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        location: userData.location || "",
        phone: userData.phone || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        headline: userData.headline || ""
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
      setIsLoading(false);
    }
  }

  if (isLoading) return <div>Loading...</div>

  console.log(personalInfo);


  const links: NavLink[] = [
    {
        label: "About",
        href: "#about"
    },
    {
        label: "Projects",
        href: "#projects"
    },
    {
        label: "Education",
        href: "#education"
    },
    {
        label: "Experience",
        href: "#experience"
    },
    {
        label: "Contact",
        href: "/contact"
    }
    ];
  return (
    <div className="">
        <NavBar links={links} name={personalInfo?.name || "Name"}/>
        <Hero headline={personalInfo?.headline ?? `Hello, I'm ${personalInfo?.name}`} name={personalInfo?.name || "Name"} avatar_url={personalInfo?.image_url || "/github.png"} occupation="jsjsjsj" github={personalInfo?.github} linkedin={personalInfo?.linkedin} />

    </div>
  );
}
