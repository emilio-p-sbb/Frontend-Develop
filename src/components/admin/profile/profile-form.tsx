"use client"

import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  User, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Upload,
  LucideIcon
} from "lucide-react"
import { useAdminStore } from "@/stores/adminStore"
import { UserProfile } from "@/types/user-profile"
import { useSession } from "next-auth/react"
import { useResource } from "@/hooks/private/use-resource"
import { useUpdateMultipartResource } from "@/hooks/private/use-update-multipart-resource"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"

// --- Schema validasi dengan Zod ---
const profileSchema = z.object({
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  avatar: z.instanceof(File).optional().or(z.string().optional()),
})

type ProfileFormSchema = z.infer<typeof profileSchema>

interface ProfileFormProps {
  tittleForm?: string; // typo di 'tittle', saya biarkan sesuai kamu
  descriptionForm?: string;
}

export default function ProfileForm(attribute: ProfileFormProps) {
  const { data: session } = useSession()
  // const userId = session?.id as number
  const userId = session?.id as number


  const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateMultipartResource<UserProfile>("users", {
      jsonKey: "user",           // sesuaikan dengan backend
      fileFields: ["avatar"],    // field yang berupa file
    });

  const { data: profileResponse, isLoading } = useResource<UserProfile>("users", userId)

  

  const { setActiveSection } = useAdminStore()

  // Setup react-hook-form dengan resolver zod dan default values kosong dulu
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty }
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      website: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      avatar: undefined,
    },
  })

  // Sinkronisasi data profile ke form saat data sudah didapat
  useEffect(() => {
    if (profileResponse) {
      reset({
        fullname: profileResponse.fullname || "",
        email: profileResponse.email || "",
        phone: profileResponse.phone || "",
        location: profileResponse.location || "",
        bio: profileResponse.bio || "",
        website: profileResponse.website || "",
        linkedinUrl: profileResponse.linkedinUrl || "",
        githubUrl: profileResponse.githubUrl || "",
        twitterUrl: profileResponse.twitterUrl || "",
        avatar: profileResponse.avatar || "",
      })
    }
  }, [profileResponse, reset])

  console.log('profileResponse?.data = '+JSON.stringify(profileResponse))

  useEffect(() => {
    document.title = "Profile | Portfolio Admin"
    setActiveSection("profile")
  }, [setActiveSection])

  // State untuk edit mode
  const [isEditing, setIsEditing] = React.useState(false)

  // Submit handler
  const onSubmit = (data: ProfileFormSchema) => {
    // data.avatar bisa berupa File (upload baru) atau string (url avatar lama)
    updateUserProfile(data, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  if (isLoading) return <div>Loading profile data...</div>

  // Social field config
  const socialFields: { id: keyof UserProfile; label: string; icon: LucideIcon }[] = [
    { id: "website", label: "Website", icon: Globe },
    { id: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
    { id: "githubUrl", label: "GitHub", icon: Github },
    { id: "twitterUrl", label: "Twitter", icon: Twitter },
  ]

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{attribute.tittleForm}</h1>
          <p className="text-gray-500 mt-1">{attribute.descriptionForm}</p>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  reset() // Reset ke last known values saat cancel
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32">
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <>
                      {typeof field.value === "string" && field.value ? (
                        <AvatarImage src={field.value} />
                      ) : field.value instanceof File ? (
                        <AvatarImage src={URL.createObjectURL(field.value)} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {profileResponse?.fullname?.charAt(0).toUpperCase() || "JD"}
                        </AvatarFallback>
                      )}
                    </>
                  )}
                />
              </Avatar>
            </div>

            {isEditing && (
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={typeof field.value === "string" ? field.value : undefined}
                    onChange={(file) => field.onChange(file)}
                    maxSize={2}
                    label="Upload New Photo"
                    placeholder="Upload profile picture"
                  />
                )}
              />
            )}

            <div className="space-y-2 text-center">
              <h3 className="font-semibold text-lg">{profileResponse?.fullname}</h3>
              <p className="text-gray-500">{profileResponse?.email}</p>
              <Badge variant="secondary">{profileResponse?.role || "Admin"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["fullname", "email", "phone", "location"] as (keyof UserProfile)[]).map((id) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
                  <Input
                    id={id}
                    {...register(id)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                  {/* {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>} */}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && <p className="text-red-600 text-sm">{errors.bio.message}</p>}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialFields.map(({ id, label, icon: Icon }) => (
                  <div key={id} className="space-y-2">
                    <Label htmlFor={id}>{label}</Label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id={id}
                        {...register(id)}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="https://..."
                      />
                    </div>
                    {/* {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>} */}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        h
      </div>
    </form>
  )
}
