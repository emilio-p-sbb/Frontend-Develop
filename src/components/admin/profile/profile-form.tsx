"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Globe, Github, Linkedin, Twitter, LucideIcon, Loader2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Schema validasi dengan Zod ---
const profileSchema = z.object({
  userId: z.number(),
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  gender: z.string().optional(),
  role: z.enum(["USER", "ADMIN", "MODERATOR"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be USER, ADMIN, or MODERATOR",
  }),
})

type ProfileFormSchema = z.infer<typeof profileSchema>

interface ProfileFormProps {
  tittleForm?: string
  descriptionForm?: string
}

export default function ProfileForm(attribute: ProfileFormProps) {
  const { data: session } = useSession()
  const userId = session?.id as number

  const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateMultipartResource<UserProfile>("users", {
    jsonKey: "user",
    fileFields: ["avatar"],
  })

  const { data: profileResponse, isLoading } = useResource<UserProfile>("users", userId)

  const { setActiveSection } = useAdminStore()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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
      gender: "",
      role: "USER",
    },
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [avatarFile])

  useEffect(() => {
    if (profileResponse) {
      reset({
        userId: profileResponse.userId,
        fullname: profileResponse.fullname || "",
        email: profileResponse.email || "",
        phone: profileResponse.phone || "",
        location: profileResponse.location || "",
        bio: profileResponse.bio || "",
        website: profileResponse.website || "",
        linkedinUrl: profileResponse.linkedinUrl || "",
        githubUrl: profileResponse.githubUrl || "",
        twitterUrl: profileResponse.twitterUrl || "",
        gender: profileResponse.gender || "",
        role: profileResponse.role || "USER",
      })
      setAvatarFile(null)
      // setPreviewUrl(profileResponse.avatar || null)
      setPreviewUrl(profileResponse.profileAvatar ? `data:image/png;base64,${profileResponse.profileAvatar}` : null)

    }
  }, [profileResponse, reset])

  useEffect(() => {
    document.title = "Profile | Portfolio Admin"
    setActiveSection("profile")
  }, [setActiveSection])

  const [isEditing, setIsEditing] = useState(false)

  const onSubmit = (data: ProfileFormSchema) => {
    const payload = {
      ...data,
      avatar: avatarFile ?? undefined,
    }
    updateUserProfile(payload, {
      onSuccess: () => {
        setIsEditing(false)
        setAvatarFile(null)
      },
    })
  }

  if (isLoading){
    return <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>;
  } 

  const socialFields: { id: keyof UserProfile; label: string; icon: LucideIcon }[] = [
    { id: "website", label: "Website", icon: Globe },
    { id: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
    { id: "githubUrl", label: "GitHub", icon: Github },
    { id: "twitterUrl", label: "Twitter", icon: Twitter },
  ]

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("userId", { valueAsNumber: true })} />
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
                  reset()
                  setAvatarFile(null)
                  // setPreviewUrl(profileResponse?.avatar || null)
                  setPreviewUrl(profileResponse?.profileAvatar ? `data:image/png;base64,${profileResponse.profileAvatar}` : null)
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
                {previewUrl ? (
                  <AvatarImage src={previewUrl} className="object-cover"/>
                ) : (
                  <AvatarFallback className="text-2xl">
                    {profileResponse?.fullname?.charAt(0).toUpperCase() || "JD"}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {isEditing && (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setAvatarFile(file)
                }}
              />
            )}

            <div className="space-y-2 text-center">
              <h3 className="font-semibold text-lg">{profileResponse?.fullname}</h3>
              <p className="text-gray-500">{profileResponse?.email}</p>
              <Badge variant="secondary">{profileResponse?.role || "USER"}</Badge>
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
                  <Input id={id} {...register(id)} disabled={!isEditing} />
                  {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>}
                </div>
              ))}

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  disabled={!isEditing}
                  defaultValue={profileResponse?.gender || ""}
                  onValueChange={(val) => setValue("gender", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  disabled={!isEditing}
                  defaultValue={profileResponse?.role || "USER"}
                  onValueChange={(val) => setValue("role", val as "USER" | "ADMIN" | "MODERATOR")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
              </div>
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
                      <Input id={id} {...register(id)} disabled={!isEditing} className="pl-10" placeholder="https://..." />
                      {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}






// "use client"

// import React, { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"

// import { Globe, Github, Linkedin, Twitter, LucideIcon } from "lucide-react"
// import { useAdminStore } from "@/stores/adminStore"
// import { UserProfile } from "@/types/user-profile"
// import { useSession } from "next-auth/react"
// import { useResource } from "@/hooks/private/use-resource"
// import { useUpdateMultipartResource } from "@/hooks/private/use-update-multipart-resource"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Separator } from "@/components/ui/separator"

// // --- Schema validasi dengan Zod ---
// const profileSchema = z.object({
//   fullname: z.string().min(1, "Fullname is required"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().optional(),
//   location: z.string().optional(),
//   bio: z.string().optional(),
//   website: z.string().url("Invalid URL").optional().or(z.literal("")),
//   linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
//   githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
//   twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
// })

// type ProfileFormSchema = z.infer<typeof profileSchema>

// interface ProfileFormProps {
//   tittleForm?: string
//   descriptionForm?: string
// }

// export default function ProfileForm(attribute: ProfileFormProps) {
//   const { data: session } = useSession()
//   const userId = session?.id as number

//   const { mutate: updateUserProfile, isPending: isUpdating } = useUpdateMultipartResource<UserProfile>("users", {
//     jsonKey: "user",
//     fileFields: ["avatar"],
//   })

//   const { data: profileResponse, isLoading } = useResource<UserProfile>("users", userId)

//   const { setActiveSection } = useAdminStore()

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<ProfileFormSchema>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       fullname: "",
//       email: "",
//       phone: "",
//       location: "",
//       bio: "",
//       website: "",
//       linkedinUrl: "",
//       githubUrl: "",
//       twitterUrl: "",
//     },
//   })

//   const [avatarFile, setAvatarFile] = useState<File | null>(null)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)

//   useEffect(() => {
//     if (avatarFile) {
//       const url = URL.createObjectURL(avatarFile)
//       setPreviewUrl(url)

//       return () => URL.revokeObjectURL(url)
//     }
//   }, [avatarFile])

//   useEffect(() => {
//     if (profileResponse) {
//       reset({
//         fullname: profileResponse.fullname || "",
//         email: profileResponse.email || "",
//         phone: profileResponse.phone || "",
//         location: profileResponse.location || "",
//         bio: profileResponse.bio || "",
//         website: profileResponse.website || "",
//         linkedinUrl: profileResponse.linkedinUrl || "",
//         githubUrl: profileResponse.githubUrl || "",
//         twitterUrl: profileResponse.twitterUrl || "",
//       })
//       setAvatarFile(null)
//       setPreviewUrl(profileResponse.avatar || null)
//     }
//   }, [profileResponse, reset])

//   useEffect(() => {
//     document.title = "Profile | Portfolio Admin"
//     setActiveSection("profile")
//   }, [setActiveSection])

//   const [isEditing, setIsEditing] = useState(false)

//   const onSubmit = (data: ProfileFormSchema) => {
//     const payload = {
//       ...data,
//       avatar: avatarFile ?? undefined, // Pastikan avatarFile ikut di payload
//     };
//     updateUserProfile(payload, {
//       onSuccess: () => {
//         setIsEditing(false);
//         setAvatarFile(null);
//       },
//     });
//   };


//   if (isLoading) return <div>Loading profile data...</div>

//   const socialFields: { id: keyof UserProfile; label: string; icon: LucideIcon }[] = [
//     { id: "website", label: "Website", icon: Globe },
//     { id: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
//     { id: "githubUrl", label: "GitHub", icon: Github },
//     { id: "twitterUrl", label: "Twitter", icon: Twitter },
//   ]

//   return (
//     <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">{attribute.tittleForm}</h1>
//           <p className="text-gray-500 mt-1">{attribute.descriptionForm}</p>
//         </div>
//         <div className="flex space-x-2">
//           {!isEditing ? (
//             <Button type="button" onClick={() => setIsEditing(true)}>
//               Edit Profile
//             </Button>
//           ) : (
//             <>
//               <Button
//                 variant="outline"
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false)
//                   reset()
//                   setAvatarFile(null)
//                   setPreviewUrl(profileResponse?.avatar || null)
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isUpdating}>
//                 {isUpdating ? "Saving..." : "Save Changes"}
//               </Button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Profile Picture</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-center">
//               <Avatar className="w-32 h-32">
//                 {previewUrl ? (
//                   <AvatarImage src={previewUrl} />
//                 ) : (
//                   <AvatarFallback className="text-2xl">
//                     {profileResponse?.fullname?.charAt(0).toUpperCase() || "JD"}
//                   </AvatarFallback>
//                 )}
//               </Avatar>
//             </div>

//             {isEditing && (
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0]
//                   console.log("✅ File dipilih:", file)
//                   if (file) setAvatarFile(file)
//                 }}
//               />
//             )}

//             <div className="space-y-2 text-center">
//               <h3 className="font-semibold text-lg">{profileResponse?.fullname}</h3>
//               <p className="text-gray-500">{profileResponse?.email}</p>
//               <Badge variant="secondary">{profileResponse?.role || "Admin"}</Badge>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Personal Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {(["fullname", "email", "phone", "location"] as (keyof UserProfile)[]).map((id) => (
//                 <div key={id} className="space-y-2">
//                   <Label htmlFor={id}>{id.charAt(0).toUpperCase() + id.slice(1)}</Label>
//                   <Input id={id} {...register(id)} disabled={!isEditing} className="pl-10" />
//                   {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>}
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="bio">Bio</Label>
//               <Textarea
//                 id="bio"
//                 {...register("bio")}
//                 disabled={!isEditing}
//                 rows={4}
//                 placeholder="Tell us about yourself..."
//               />
//               {errors.bio && <p className="text-red-600 text-sm">{errors.bio.message}</p>}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h4 className="font-semibold">Social Links</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {socialFields.map(({ id, label, icon: Icon }) => (
//                   <div key={id} className="space-y-2">
//                     <Label htmlFor={id}>{label}</Label>
//                     <div className="relative">
//                       <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input id={id} {...register(id)} disabled={!isEditing} className="pl-10" placeholder="https://..." />
//                       {errors[id] && <p className="text-red-600 text-sm">{errors[id]?.message as string}</p>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </form>
//   )
// }
