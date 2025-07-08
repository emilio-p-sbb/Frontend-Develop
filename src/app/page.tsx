'use client';

import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkilsSection";
import { useResource } from "@/hooks/public/use-resource";
import { UserProfile } from "@/types/user-profile";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";


export default function HomePage(){

  const { data: profileResponse, isLoading } = useResource<UserProfile>("users", 1)

  useEffect(() => {
    document.title = "Berkat Wahyu Purba | Java Software Engineer";

    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleClick = function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };


    anchors.forEach(anchor => anchor.addEventListener('click', handleClick));

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleClick));
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container-custom">
        {isLoading || !profileResponse ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <Hero profile={profileResponse} />
        )}
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
        {isLoading || !profileResponse ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <ContactSection profile={profileResponse} />
        )}
      </div>

      {isLoading || !profileResponse ? (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      ) : (
        <Footer profile={profileResponse} />
      )}
    </div>
  );
}
