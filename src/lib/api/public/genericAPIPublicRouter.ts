// app/apiClient/genericAPIRouter.ts

import { createPublicResourceAPI } from "./createPublicResourceAPI";

export const createResourceRouter = <T>(
  resource: string,
  isPaged: boolean = true,
  service: string = 'auth'
) => {
  const api = createPublicResourceAPI<T>(resource, isPaged, service);

  return {
    getAll: api.getAll,
    getOne: api.getOne,
    create: api.create,
    update: api.update,
    createMultipart: api.createMultipart,
    updateMultipart: api.updateMultipart,
    delete: api.delete,
    deleteMultiple: api.deleteMultiple,
    getList: api.getList,
    exportData: api.exportData,
    getByParams: api.getByParams,
  };
};

