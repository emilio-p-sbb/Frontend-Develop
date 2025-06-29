import ProfileForm from "@/components/admin/profile/profile-form";
import { useResource } from "@/hooks/private/use-resource";
import { useUpdateMultipartResource } from "@/hooks/private/use-update-multipart-resource";
import { UserProfile } from "@/types/user-profile";
import { useSession } from "next-auth/react";

// Ini akan dipanggil di sisi server
export default async function AdminProfilePage() {

  return (
    <>
        <ProfileForm
            tittleForm = 'Profile'
            descriptionForm="Manage your account information and preferences"
        />
    </>
        
  );
}