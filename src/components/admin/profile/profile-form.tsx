// app/admin/profile/components/profile-form.tsx
"use client"; // Ini adalah Client Component karena ada state, event handler, dan toast

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Upload } from "lucide-react";

import { useAdminStore } from "@/stores/adminStore";
import { UserProfile } from "@/types/user-profile";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/app/admin/profile/action";

interface ProfileFormProps {
  initialProfileData: UserProfile;
}

export default function ProfileForm({ initialProfileData }: ProfileFormProps) {
  // const { user } = useAuth(); // Data pengguna sekarang berasal dari initialProfileData
  const { toast } = useToast();
  const { setActiveSection } = useAdminStore(); // Untuk mengatur active section

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gunakan initialProfileData untuk menginisialisasi state form
  const [formData, setFormData] = useState<UserProfile>(initialProfileData);

  // Perbarui document.title dan active section saat komponen dimuat
  useEffect(() => {
    document.title = "Profile | Portfolio Admin";
    setActiveSection('profile');
  }, [setActiveSection]);

  // Efek untuk memperbarui formData jika initialProfileData berubah (misalnya setelah save)
  useEffect(() => {
    setFormData(initialProfileData);
  }, [initialProfileData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Panggil Server Action untuk memperbarui profil
      await updateProfile(formData);

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data ke initialProfileData yang diterima dari Server Component
    setFormData(initialProfileData);
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  // Logika untuk menampilkan avatar berdasarkan URL atau fallback
  const avatarSrc = formData.avatar;
  const avatarFallback = formData.name?.charAt(0).toUpperCase() || "JD"; // Default if name is empty

  return (
    <>
      {/* Tombol Aksi (Edit/Save/Cancel) */}
      <div className="flex justify-end mb-4"> {/* Atur posisi tombol agar tidak di dalam Card */}
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={avatarSrc} alt={formData.name} />
                <AvatarFallback className="text-2xl">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>

            {isEditing && (
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{formData.name}</h3>
              <p className="text-gray-500">{formData.email}</p>
              <Badge variant="secondary">{formData.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone || ""} // Handle undefined
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location || ""} // Handle undefined
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""} // Handle undefined
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={formData.website || ""} // Handle undefined
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedinUrl"
                      value={formData.linkedinUrl || ""} // Handle undefined
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="githubUrl"
                      value={formData.githubUrl || ""} // Handle undefined
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitterUrl">Twitter</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="twitterUrl"
                      value={formData.twitterUrl || ""} // Handle undefined
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}