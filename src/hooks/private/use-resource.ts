import type { PagedResponse } from "@/types/PagedResponse";
import { ResponseData } from "@/types/ResponseData";
import { UseListProps } from "@/types/UseListProps";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { createPrivateResourceAPI } from "@/lib/api/private/createPrivateResourceAPI";


// Hook for getting a list of resources
export const useResourceList = <T>(
    resource: string, 
    { pageIndex, pageSize, sorting, columnFilters }: UseListProps, 
    isPaged: boolean = true,
  ) => {
  const { toast } = useToast();
  const resourceRouter = createPrivateResourceAPI<T>(resource, isPaged);

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
  const resourceRouter = createPrivateResourceAPI<T>(resource);

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
  const resourceRouter = createPrivateResourceAPI<T>(resource);

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


export const useResourceByParams = <T>(
  resource: string,
  params: Record<string, string | number | boolean>,
  enabled: boolean = true
) => {
  const { toast } = useToast();
  const resourceRouter = createPrivateResourceAPI<T>(resource);

  return useQuery<ResponseData<T>>({
    queryKey: [resource, 'byParams', params],
    queryFn: async () => {
      try {
        const data = await resourceRouter.getByParams(params);
        return data;
      } catch (error: any) {
        // Tangani error custom dari Spring Boot
        if (error.response?.data) {
          const errData = error.response.data as {
            timestamp: string;
            status: number;
            error: string;
            message: string;
            fieldErrors?: Record<string, string>;
            generalErrors?: string[];
          };

          toast({
            title: `Error ${errData.status} - ${errData.error}`,
            description: errData.message,
            variant: 'destructive',
          });
        } else if (error instanceof Error) {
          toast({
            title: 'Unexpected Error',
            description: error.message,
            variant: 'destructive',
          });
        }
        throw error;
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });
};



