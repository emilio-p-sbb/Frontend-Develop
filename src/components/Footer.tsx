'use client';

import { useResource } from "@/hooks/public/use-resource";
import { UserProfile } from "@/types/user-profile";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export function Footer({ profile }: { profile: UserProfile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-portfolio-navy text-white py-8 mt-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">
              BW<span className="text-portfolio-light-blue">.dev</span>
            </h2>
            <p className="text-gray-300 mt-1">Java Software Engineer</p>
          </div>

          <div className="flex space-x-4">
            <a
              href={profile?.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={profile?.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={`mailto:${profile?.email}`}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href={`tel:${profile?.phone}`}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Phone"
            >
              <Phone size={20} />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {currentYear} {`${profile?.fullname}`}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
