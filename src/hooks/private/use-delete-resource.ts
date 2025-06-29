import { useToast } from "@/hooks/use-toast"
import { createPrivateResourceRouter } from "@/lib/api/private/genericAPIPrivateRouter"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// Hook for deleting a single resource
export const useDeleteResource = <T extends object>(resource: string) => {
  // Added <T extends object>
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const resourceRouter = createPrivateResourceRouter<T>(resource)

  return useMutation({
    mutationFn: (id: number) => resourceRouter.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] })
      toast({
        title: "Success",
        description: `${resource} deleted successfully`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete ${resource}: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}

// Hook for deleting multiple resources
export const useDeleteMultipleResource = <T extends object>(resource: string) => {
  // Added <T extends object>
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const resourceRouter = createPrivateResourceRouter<T>(resource)

  return useMutation({
    mutationFn: (ids: number[]) => resourceRouter.deleteMultiple(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] })
      toast({
        title: "Success",
        description: `${resource}s deleted successfully`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete ${resource}s: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}

