'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Linkedin, Github, MapPin, Download, Facebook } from "lucide-react";
import { useContentStore } from "@/stores/contentStore";

export function ContactSection() {
  const { toast } = useToast();
  const { profile } = useContentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadCV = () => {
    toast({
      title: "Download CV",
      description: "CV download feature will be implemented when connected to backend.",
    });
  };

  const socialLinks = [
    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Github, href: profile.github, label: "GitHub", color: "hover:text-gray-800" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Mail, href: `https://wa.me/6281287756784`, label: "WhatsApp", color: "hover:text-green-600" }
  ];

  return (
    <section id="contact" className="section-padding border-t border-gray-100">
      <h2 className="section-heading">Get In Touch</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="border-0 shadow-md card-hover h-full">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-portfolio-navy mb-6">Contact Information</h3>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-portfolio-light-blue/10 flex items-center justify-center mr-4">
                  <MapPin className="w-5 h-5 text-portfolio-light-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Location</h4>
                  <p className="text-gray-600">{profile.location}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-portfolio-light-blue/10 flex items-center justify-center mr-4">
                  <Phone className="w-5 h-5 text-portfolio-light-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Phone</h4>
                  <a href={`tel:${profile.phone}`} className="text-gray-600 hover:text-portfolio-light-blue transition-colors">
                    {profile.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-portfolio-light-blue/10 flex items-center justify-center mr-4">
                  <Mail className="w-5 h-5 text-portfolio-light-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Email</h4>
                  <a href={`mailto:${profile.email}`} className="text-gray-600 hover:text-portfolio-light-blue transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Download CV Button */}
            <div className="mt-8">
              <Button onClick={handleDownloadCV} className="w-full bg-portfolio-navy hover:bg-portfolio-blue text-white">
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            </div>

            {/* Social Links */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Connect with me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 ${social.color} transition-colors duration-300`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="border-0 shadow-md card-hover">
          <CardContent className="p-6 md:p-8">
            <h3 className="text-xl font-semibold text-portfolio-navy mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                  <Input id="name" name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input id="email" name="email" type="email" placeholder="Your email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <Input id="subject" name="subject" placeholder="Message subject" value={formData.subject} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" name="message" placeholder="Your message" rows={4} value={formData.message} onChange={handleInputChange} required />
              </div>

              <Button type="submit" className="w-full bg-portfolio-navy hover:bg-portfolio-blue" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
