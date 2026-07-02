import { RegisterRequest } from "../types/register";

export function toRegisterFormData(
  data: RegisterRequest
): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);

  if (data.whatsappNumber) {
    formData.append(
      "whatsappNumber",
      data.whatsappNumber
    );
  }

  formData.append("image", {
    uri: data.image.uri,
    name: data.image.fileName ?? "avatar.jpg",
    type: data.image.mimeType ?? "image/jpeg",
  } as unknown as Blob);

  return formData;
}