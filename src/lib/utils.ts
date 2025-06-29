import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function toFormData<T extends Record<string, any>>(
  data: T,
  jsonKey: string = "data",
  fileFields: (keyof T)[] = []
): FormData {
  const formData = new FormData();

  // Append file fields langsung
  fileFields.forEach((field) => {
    const value = data[field];
    if (value instanceof File) {
      formData.append(jsonKey, new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
    }
  });

  // Hapus fileFields dari data sebelum stringify
  const jsonData = { ...data };
  fileFields.forEach((field) => {
    delete jsonData[field];
  });

  // Append data selain file sebagai JSON string dengan key jsonKey
  formData.append(jsonKey, JSON.stringify(jsonData));

  return formData;
}
