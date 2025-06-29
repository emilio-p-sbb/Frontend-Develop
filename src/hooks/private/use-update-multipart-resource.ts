// app/hooks/use-update-multipart-resoutce.ts
import { useToast } from "@/hooks/use-toast";
import { createPrivateResourceRouter } from "@/lib/api/private/genericAPIPrivateRouter";
import { toFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseUpdateMultipartResourceOptions<T> {
  jsonKey?: string;               // key untuk JSON string di FormData, default "data"
  fileFields?: (keyof T)[];       // daftar field yang harus di-append sebagai file, default []
}

export const useUpdateMultipartResource = <T extends object>(
  resource: string,
  options?: UseUpdateMultipartResourceOptions<T>
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const resourceRouter = createPrivateResourceRouter<T>(resource);

  const jsonKey = options?.jsonKey ?? "data";
  const fileFields = options?.fileFields ?? [];

  return useMutation({
    mutationFn: (data: T) => {
      const formData = toFormData(data, jsonKey, fileFields);
      return resourceRouter.updateMultipart(formData as FormData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toast({
        title: "Success",
        description: `${resource} updated successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update ${resource}: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};