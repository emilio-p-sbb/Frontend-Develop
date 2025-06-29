import { useToast } from "@/hooks/use-toast"
import { createPrivateResourceRouter } from "@/lib/api/private/genericAPIPrivateRouter"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useUpdateResource = <T extends object>(resource: string) => {
  // Added <T extends object>
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const resourceRouter = createPrivateResourceRouter<T>(resource)

  return useMutation({
    mutationFn: (data: T) => resourceRouter.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] })
      toast({
        title: "Success",
        description: `${resource} updated successfully`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update ${resource}: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateByIdResource = <T extends object>(resource: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const resourceRouter = createPrivateResourceRouter<T>(resource);

  return useMutation({
    mutationFn: ({ id, path }: { id: number; path: string }) => resourceRouter.updateById(id, path),
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


export const useUpdateAllResource = (resource: string) => {
  // Added <T extends object>
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const resourceRouter = createPrivateResourceRouter<void>(resource)

  return useMutation({
    mutationFn: ({ path }: { path: string }) => resourceRouter.putAll(path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] })
      toast({
        title: "Success",
        description: `${resource} updated successfully`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update ${resource}: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}