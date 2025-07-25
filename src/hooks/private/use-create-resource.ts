// app/hooks/useCreateResource.ts
import { useToast } from "@/hooks/use-toast"
import { createPrivateResourceAPI } from "@/lib/api/private/createPrivateResourceAPI"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateResource = <T extends object>(
  resource: string,
  service: string = 'auth',
) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const resourceRouter = createPrivateResourceAPI<T>(resource, true, service)

  return useMutation({
    mutationFn: (data: T) => resourceRouter.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] })
      toast({
        title: "Success",
        description: `${resource} created successfully`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create ${resource}: ${error.message}`,
        variant: "destructive",
      })
    },
  })
}
