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
import { useEffect } from "react";


export default function HomePage(){
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
        <Hero />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}
