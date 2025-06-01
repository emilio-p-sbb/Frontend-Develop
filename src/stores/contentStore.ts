
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  avatar?: string;
}

export interface AboutData {
  description: string[];
  highlights: Array<{
    title: string;
    subtitle: string;
    icon: string;
    gradient: string;
  }>;
}

export interface HeroData {
  greeting: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  backgroundImage?: string;
  showProfilePhoto?: boolean;
}

interface ContentState {
  profile: ProfileData;
  about: AboutData;
  hero: HeroData;
  updateProfile: (data: Partial<ProfileData>) => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateHero: (data: Partial<HeroData>) => void;
}

const defaultProfile: ProfileData = {
  name: "Berkat Wahyu Purba",
  title: "Java Software Engineer",
  email: "wahyu.sbb@gmail.com",
  phone: "+62 xxx-xxxx-xxxx",
  location: "Indonesia",
  website: "https://berkatsoftware.com",
  github: "https://github.com/berkatsoftware",
  linkedin: "https://linkedin.com/in/berkatsoftware",
  avatar: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face"
};

const defaultAbout: AboutData = {
  description: [
    "Experienced Java Backend Developer with nearly 10 years of expertise in designing, developing, and maintaining high-performance backend systems. Proficient in building RESTful APIs using Spring and Spring Boot frameworks, with a solid foundation in Java programming and object-oriented design principles.",
    "Skilled in integrating and optimizing relational databases, particularly PostgreSQL, and experienced with various backend technologies, including Struts2, where I developed large monolithic web applications rather than just backend systems.",
    "Passionate about continuous learning and staying up-to-date with the latest trends in backend development, microservices architecture, and distributed systems."
  ],
  highlights: [
    {
      title: "Backend",
      subtitle: "Java Development Expert",
      icon: "Code",
      gradient: "from-portfolio-navy/90 to-portfolio-navy"
    },
    {
      title: "Microservices",
      subtitle: "Architecture Specialist",
      icon: "Server",
      gradient: "from-portfolio-light-blue/90 to-portfolio-light-blue"
    }
  ]
};

const defaultHero: HeroData = {
  greeting: "Hello, I'm",
  name: "Berkat Wahyu Purba",
  title: "Java Software Engineer",
  subtitle: "Backend Developer",
  description: "Passionate about building scalable backend systems and RESTful APIs with Java, Spring Boot, and modern technologies.",
  ctaText: "View My Work",
  showProfilePhoto: true
};

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      about: defaultAbout,
      hero: defaultHero,
      updateProfile: (data) => set((state) => ({ 
        profile: { ...state.profile, ...data } 
      })),
      updateAbout: (data) => set((state) => ({ 
        about: { ...state.about, ...data } 
      })),
      updateHero: (data) => set((state) => ({ 
        hero: { ...state.hero, ...data } 
      })),
    }),
    {
      name: 'portfolio-content'
    }
  )
);