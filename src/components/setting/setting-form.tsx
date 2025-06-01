// app/admin/settings/components/settings-form.tsx
"use client"; // Ini adalah Client Component karena ada state, event handler, dan toast

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Palette,
  Globe,
  Lock,
  Smartphone,
  Eye,
  Save,
  Mail, // Import Mail icon for clarity if needed, though not directly used in settings object
  Shield // Import Shield icon for clarity if needed
} from "lucide-react";
import { useAdminStore } from "@/stores/adminStore"; // Untuk mengatur active section
import { UserSettings } from "@/types/user-setting";
import { useToast } from "@/hooks/use-toast";
import { updateSettings } from "@/app/admin/settings/action";

interface SettingsFormProps {
  initialSettingsData: UserSettings;
}

export default function SettingsForm({ initialSettingsData }: SettingsFormProps) {
  const { toast } = useToast();
  const { setActiveSection } = useAdminStore(); // Untuk mengatur active section

  const [loading, setLoading] = useState(false);

  // Gunakan initialSettingsData untuk menginisialisasi state form
  const [settings, setSettings] = useState<UserSettings>(initialSettingsData);

  // Perbarui document.title dan active section saat komponen dimuat
  useEffect(() => {
    document.title = "Settings | Portfolio Admin";
    setActiveSection('settings');
  }, [setActiveSection]);

  // Efek untuk memperbarui settings jika initialSettingsData berubah (misalnya setelah save)
  useEffect(() => {
    setSettings(initialSettingsData);
  }, [initialSettingsData]);


  const handleSave = async () => {
    setLoading(true);
    try {
      // Panggil Server Action untuk memperbarui pengaturan
      await updateSettings(settings);

      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => { // Menggunakan keyof UserSettings untuk type safety
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Tombol "Save Changes" */}
      <div className="flex justify-end mb-4"> {/* Atur posisi tombol agar tidak di dalam Card */}
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                disabled={loading}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Marketing Emails</Label>
                <p className="text-sm text-gray-500">Receive promotional and marketing emails</p>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value as UserSettings['theme'])} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value as UserSettings['language'])} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select value={settings.privacyLevel} onValueChange={(value) => updateSetting('privacyLevel', value as UserSettings['privacyLevel'])} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  Two-Factor Authentication
                  {settings.twoFactorEnabled && <Badge variant="secondary">Enabled</Badge>}
                </Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => updateSetting('twoFactorEnabled', checked)}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" disabled={loading}>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>

            <Button variant="outline" className="w-full justify-start" disabled={loading}>
              <Smartphone className="w-4 h-4 mr-2" />
              Manage Connected Devices
            </Button>

            <Button variant="outline" className="w-full justify-start" disabled={loading}>
              <Eye className="w-4 h-4 mr-2" />
              Privacy Settings
            </Button>

            <Separator />

            <Button variant="destructive" className="w-full" disabled={loading}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}