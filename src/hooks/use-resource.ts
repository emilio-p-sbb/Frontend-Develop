import { createResourceRouter } from "@/lib/api/genericAPIRouter";
import type { PagedResponse } from "@/types/PagedResponse";
import { ResponseData } from "@/types/ResponseData";
import { UseListProps } from "@/types/UseListProps";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Hook for getting a list of resources
export const useResourceList = <T>(resource: string, { pageIndex, pageSize, sorting, columnFilters }: UseListProps, isPaged: boolean = true) => {
  const { toast } = useToast();
  const resourceRouter = createResourceRouter<T>(resource, isPaged);

  return useQuery<ResponseData<PagedResponse<T>>>({
    queryKey: [resource, { pageIndex, pageSize, sorting, columnFilters }],
    queryFn: async () => {
      try {
        const data = await resourceRouter.getAll({ pageIndex, pageSize, sorting, columnFilters });
        return data;
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
        throw error;
      }
    },
    refetchOnWindowFocus: true,
  });
};

// Hook for getting details of a single resource
export const useResource = <T>(resource: string, id: number) => {
  const { toast } = useToast();
  const resourceRouter = createResourceRouter<T>(resource);

  return useQuery<ResponseData<T>>({
    queryKey: [resource, id],
    queryFn: () => resourceRouter.getOne(id),
    refetchOnWindowFocus: true,
    select: (data) => {
      if (data instanceof Error) {
        toast({
          title: "Error",
          description: `Failed to fetch ${resource} details: ${data.message}`,
          variant: "destructive",
        });
      }
      return data;
    },
  });
};

// Hook for getting a list of resources without pagination
export const useResources = <T>(resource: string) => {
  const { toast } = useToast();
  const resourceRouter = createResourceRouter<T>(resource);

  return useQuery<ResponseData<T>>({
    queryKey: [resource],
    queryFn: async () => await resourceRouter.getList(),
    refetchOnWindowFocus: true,
    select: (data) => {
      if (data instanceof Error) {
        toast({
          title: "Error",
          description: `Failed to fetch ${resource} list: ${data.message}`,
          variant: "destructive",
        });
      }
      return data;
    },
  });
};

