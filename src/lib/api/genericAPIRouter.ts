// app/apiClient/genericAPIRouter.ts
import { createResourceAPI } from "./createResourceAPI";

export const createResourceRouter = <T>(
  resource: string,
  isPaged: boolean = true,
  service: string = 'auth'
) => {
  const api = createResourceAPI<T>(resource, isPaged, service);

  return {
    getAll: api.getAll,
    getOne: api.getOne,
    create: api.create,
    update: api.update,
    delete: api.delete,
    deleteMultiple: api.deleteMultiple,
    getList: api.getList,
    exportData: api.exportData,
  };
};
