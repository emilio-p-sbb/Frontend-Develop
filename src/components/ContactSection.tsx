'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Linkedin, Github, MapPin, Download, Facebook } from "lucide-react";
import { z } from "zod";
import { useCreateResource } from "@/hooks/public/use-create-resource";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfile } from "@/types/user-profile";

const messageSchema = z.object({
  from: z.string().min(1, "From is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type MessageFormData = z.infer<typeof messageSchema>;

export function ContactSection({ profile }: { profile: UserProfile }) {
  const { toast } = useToast();
  // const { profile } = useContentStore();

  const { mutate: send, isPending: isCreating } = useCreateResource<MessageFormData>("messages");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      from: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // const onSubmit = (data: MessageFormData) => send(data);

  const onSubmit = (data: MessageFormData) => {
    send(data, {
      onSuccess: () => {
        reset(); // ✅ Reset form
      }
    });
  };


  const handleDownloadCV = () => {
    toast({
      title: "Download CV",
      description: "CV download feature will be implemented when connected to backend.",
    });
  };

  const socialLinks = [
    { icon: Linkedin, href: profile?.linkedinUrl, label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Github, href: profile?.githubUrl, label: "GitHub", color: "hover:text-gray-800" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Mail, href: `https://wa.me/${profile?.phone}`, label: "WhatsApp", color: "hover:text-green-600" }
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="from" className="text-sm font-medium text-gray-700">From</label>
                  <Input id="from" {...register("from")} placeholder="Your name" />
                  {errors.from && <p className="text-sm text-red-500">{errors.from.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input id="email" type="email" {...register("email")} placeholder="Your email" />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <Input id="subject" {...register("subject")} placeholder="Message subject" />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" {...register("message")} placeholder="Your message" rows={4} />
                {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-portfolio-navy hover:bg-portfolio-blue" disabled={isCreating}>
                {isCreating ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
