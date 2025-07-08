import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toFormData<T extends object>(
  data: T,
  jsonKey = "data",
  fileFields: (keyof T)[] = []
): FormData {
  const formData = new FormData();

  // Append JSON data
  const jsonData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!fileFields.includes(key as keyof T)) {
      jsonData[key] = value;
    }
  }
  formData.append(jsonKey, JSON.stringify(jsonData));

  // Append files
  for (const field of fileFields) {
    const file = data[field];
    if (file instanceof File) {
      formData.append(field as string, file);
    }
  }

  return formData;
}


// export function toFormData<T extends Record<string, any>>(
//   data: T,
//   jsonKey: string = "data",
//   fileFields: (keyof T)[] = []
// ): FormData {
//   const formData = new FormData();

//   // Append file fields langsung
//   fileFields.forEach((field) => {
//     const value = data[field];
//     if (value instanceof File) {
//       formData.append(field as string, value);
//     }
//   });
//   // fileFields.forEach((field) => {
//   //   const value = data[field];
//   //   if (value instanceof File) {
//   //     formData.append(jsonKey, new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
//   //   }
//   // });

//   // Hapus fileFields dari data sebelum stringify
//   const jsonData = { ...data };
//   fileFields.forEach((field) => {
//     if (field in jsonData) {
//       delete jsonData[field]
//     }
//   })

//   // fileFields.forEach((field) => {
//   //   delete jsonData[field];
//   // });

//   // Append data selain file sebagai JSON string dengan key jsonKey
//   // formData.append(jsonKey, JSON.stringify(jsonData));

//   formData.append(jsonKey, new Blob([JSON.stringify(jsonData)], { type: "application/json" }));

//   // formData.append(jsonKey, new Blob([JSON.stringify(jsonData)], { type: "application/json" }));


//   return formData;
// }
