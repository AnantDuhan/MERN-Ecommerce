import { RegisterRequest } from "../types/register";

export function toRegisterFormData(
  data: RegisterRequest
): FormData {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("confirmPassword", data.confirmPassword);

  if (data.whatsappNumber) {
    formData.append("whatsappNumber", data.whatsappNumber);
  }

  for(const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  if (data.avatar) {
    formData.append("image", {
      uri: data.avatar.uri,
      name: data.avatar.fileName ?? "avatar.jpg",
      type: data.avatar.mimeType ?? "image/jpeg",
    } as any);
  }

  return formData;
}