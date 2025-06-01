"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useContentStore } from "@/stores/contentStore";

export function Hero() {
  const { hero, profile } = useContentStore();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-50 to-white overflow-hidden"
      style={
        hero.backgroundImage
          ? {
              backgroundImage: `url(${hero.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div
          className="absolute inset-0 bg-gray-100"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(156,146,172,0.15) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fadeInUp">
            {hero.showProfilePhoto && profile.avatar && (
              <div className="mb-8 flex justify-center">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl">
                  <AvatarImage
                    src={profile.avatar}
                    alt={profile.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl md:text-3xl font-bold bg-portfolio-navy text-white">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <p className="text-lg md:text-xl text-gray-600 mb-4 font-light">
              {hero.greeting}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-portfolio-navy mb-4 leading-tight">
              {hero.name}
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-portfolio-light-blue mb-2">
              {hero.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium">
              {hero.subtitle}
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </div>

          <div className="animate-fadeInUp animation-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-portfolio-navy hover:bg-portfolio-blue text-white px-8 py-4 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => scrollToSection("projects")}
            >
              {hero.ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-portfolio-navy text-portfolio-navy hover:bg-portfolio-navy hover:text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToSection("about")}
          className="text-portfolio-navy hover:text-portfolio-blue transition-colors duration-300"
          aria-label="Scroll to about section"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}
