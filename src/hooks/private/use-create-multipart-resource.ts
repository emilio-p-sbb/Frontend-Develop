// app/hooks/useCreateMultipartResource.ts
import { useToast } from "@/hooks/use-toast";
import { createPrivateResourceRouter } from "@/lib/api/private/genericAPIPrivateRouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateMultipartResource = <T extends object>(
  resource: string,
  service: string = 'auth'
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const resourceRouter = createPrivateResourceRouter<T>(resource, true, service);

  return useMutation({
    mutationFn: (data: FormData) => resourceRouter.createMultipart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toast({
        title: "Success",
        description: `${resource} created successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create ${resource}: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
