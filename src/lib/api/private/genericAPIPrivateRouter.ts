// app/apiClient/genericAPIRouter.ts
import { createPrivateResourceAPI } from "./createPrivateResourceAPI";

export const createPrivateResourceRouter = <T>(
  resource: string,
  isPaged: boolean = true,
  service: string = 'auth'
) => {
  const api = createPrivateResourceAPI<T>(resource, isPaged, service);
  const apiVoid = createPrivateResourceAPI<void>(resource, isPaged, service);

  return {
    getAll: api.getAll,
    getOne: api.getOne,
    create: api.create,
    update: api.update,
    putAll: apiVoid.putAll,
    updateById:api.updateById,
    createMultipart: api.createMultipart,
    updateMultipart: api.updateMultipart,
    delete: api.delete,
    deleteMultiple: api.deleteMultiple,
    getList: api.getList,
    exportData: api.exportData,
    getByParams: api.getByParams,
  };
};

