// app/apiClient/createResourceAPI.ts
import { ResponseData } from "@/types/ResponseData";
import { UseListProps } from "@/types/UseListProps";
import { PagedResponse } from "@/types/PagedResponse";
import { apiRequest } from "../../axios/privateAxios";

export const createPrivateResourceAPI = <T>(
  resource: string,
  isPaged: boolean = true,
  service: string = 'auth'
) => {
//   const base = `/api/${service}/${resource}`;
  const base = `/api/${resource}`;

  return {
    getOne: (id: number) => apiRequest<ResponseData<T>>('GET', `${base}/${id}`),

    create: (data: T) => apiRequest<ResponseData<T>>('POST', `${base}/save`, data),

    update: (data: T) => apiRequest<ResponseData<T>>('PUT', `${base}/update`, data),

    putAll: (path: string) => apiRequest<ResponseData<void>>('PUT', `${base}/${path}`),

    updateById: <R = T>(id: number, path: string) => apiRequest<ResponseData<R>>('PUT', `${base}/${id}/${path}`),

    createMultipart: (data: FormData) => apiRequest<ResponseData<T>>('POST', `${base}/save`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    updateMultipart: (data: FormData) =>
      apiRequest<ResponseData<T>>('PUT', `${base}/update`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    delete: (id: number) => apiRequest<ResponseData<void>>('DELETE', `${base}/delete/${id}`),

    deleteMultiple: (ids: number[]) => apiRequest<ResponseData<void>>('DELETE', `${base}/deleteMultiple`, ids),

    getList: () => apiRequest<ResponseData<T>>('GET', `${base}`),

    getAll: ({ pageIndex, pageSize, sorting, columnFilters }: UseListProps) => {
      const sortBy = sorting[0]?.id ?? '';
      const sortDir = sorting[0]?.desc ? 'desc' : 'asc';

      const filterParams = Object.fromEntries(
        columnFilters.map((filter) => [filter.id, String(filter.value)])
      );

      const queryString = new URLSearchParams({
        page: String(pageIndex),
        size: String(pageSize),
        ...(sortBy && { orderBy: sortBy }),
        ...(sortDir && { directive: sortDir }),
        ...filterParams,
      }).toString();

      return apiRequest<ResponseData<PagedResponse<T>>>(
        'GET',
        `${base}/partialList?${queryString}`
      );
    },

    exportData: (type: string, scope: string, ids: number[]) => {
      const params = new URLSearchParams();
      params.append("type", type);
      params.append("scope", scope);
      ids.forEach((id) => params.append("ids", id.toString()));

      return apiRequest<Blob>(
        "GET",
        `${base}/export?${params.toString()}`,
        null,
        {
          responseType: "blob",
          headers: { Accept: "application/octet-stream" },
        }
      );
    },

    getByParams: (params: Record<string, string | number | boolean>) => {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString();

      return apiRequest<ResponseData<T>>('GET', `${base}/findBy?${queryString}`);
    },
  };

  
};
