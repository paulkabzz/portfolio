"use client"

import { useEffect, useState } from "react"
import NavBar from "@/components/public-components/navbar/navbar"
import Footer from "@/components/public-components/footer/footer"
import { appwriteConfig, databases } from "@/lib/appwrite"
import { publicNavLinks } from "@/lib/nav-config"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [personalInfo, setPersonalInfo] = useState<any>(null)

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const response = await databases.getDocument(
          appwriteConfig.databaseId!,
          appwriteConfig.userCollectionId!,
          appwriteConfig.userDocumentId!
        )
        setPersonalInfo(response)
      } catch (error) {
        console.error("Error loading personal info:", error)
      }
    }
    loadPersonalInfo()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar links={publicNavLinks} name={personalInfo?.name || "Portfolio"} />
      <main className="flex-1">
        {children}
      </main>
      <Footer 
        name={personalInfo?.name} 
        surname={personalInfo?.surname} 
        github={personalInfo?.github} 
      />
    </div>
  )
}
