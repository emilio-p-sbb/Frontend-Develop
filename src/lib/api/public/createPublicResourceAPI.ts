// app/apiClient/createResourceAPI.ts
import { ResponseData } from "@/types/ResponseData";
import { UseListProps } from "@/types/UseListProps";
import { PagedResponse } from "@/types/PagedResponse";
import { apiRequestPublic } from "../../axios/publicAxios";

export const createPublicResourceAPI = <T>(
  resource: string,
  isPaged: boolean = true,
  service: string = 'auth'
) => {
//   const base = `/api/${service}/${resource}`;
  const base = `/api/${resource}`;

  return {
    getOne: (id: number) => apiRequestPublic<ResponseData<T>>('GET', `${base}/${id}`),

    create: (data: T) => apiRequestPublic<ResponseData<T>>('POST', `${base}/save`, data),

    update: (data: T) => apiRequestPublic<ResponseData<T>>('PUT', `${base}/update`, data),

    createMultipart: (data: FormData) => apiRequestPublic<ResponseData<T>>('POST', `${base}/save`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),


    updateMultipart: (data: FormData) =>
      apiRequestPublic<ResponseData<T>>('PUT', `${base}/update`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    delete: (id: number) => apiRequestPublic<ResponseData<void>>('DELETE', `${base}/delete/${id}`),

    deleteMultiple: (ids: number[]) => apiRequestPublic<ResponseData<void>>('DELETE', `${base}/deleteMultiple`, ids),

    getList: () => apiRequestPublic<ResponseData<T>>('GET', `${base}`),

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

      return apiRequestPublic<ResponseData<PagedResponse<T>>>(
        'GET',
        `${base}/partialList?${queryString}`
      );
    },

    exportData: (type: string, scope: string, ids: number[]) => {
      const params = new URLSearchParams();
      params.append("type", type);
      params.append("scope", scope);
      ids.forEach((id) => params.append("ids", id.toString()));

      return apiRequestPublic<Blob>(
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

      return apiRequestPublic<ResponseData<T>>('GET', `${base}/findBy?${queryString}`);
    },
  };

  
};
