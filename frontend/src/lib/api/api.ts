import axios from "axios";
import { z } from "zod";
import {
  loginFormSchema,
  passwordResetFormSchema,
  changePasswordFormSchema,
  updateProfileFormSchema,
  reportFormSchema,
  categoriesSchema,
  VerificationCodeSchema,
  addUserFormSchema,
} from "@/lib/validation/schema";
import { Profile, Report, Role, User } from "@/types/types";
import { Contributor } from "@/types/types";

import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export async function login(email: string, password: string) {
  const formData = loginFormSchema.parse({ email, password });
  const response = await api.post("/auth/login", {
    usernameOrEmail: formData.email,
    password: formData.password,
  });

  // Update the Zustand store with the user's information and token
  const { userId, token, roleId, first_name, last_name, profileImage } =
    response.data;
  useAuthStore.setState({
    userId,
    token,
    roleId,
    isAuthenticated: true,
    first_name,
    last_name,
    profileImage,
  });

  return response.data;
}

export async function sendVerificationCode(email: string) {
  const formData = passwordResetFormSchema.parse({ email });

  return api.put("/auth/forgot-password", {
    email: formData.email,
  });
}

export async function verifyCode(code: string) {
  const validatedData = VerificationCodeSchema.parse({ code });
  return api.post("/auth/validate-code", validatedData);
}
export async function changePassword(userId: string, password: string) {
  const validatedData = changePasswordFormSchema.parse({
    newPassword: password,
    confirmPassword: password,
  });
  return api.put(`/users/users/${userId}`, {
    password: validatedData.newPassword,
  });
}

export async function fetchUsers(): Promise<Profile[]> {
  try {
    const response = await api.get("/users/users");
    if (response.data.users && Array.isArray(response.data.users)) {
      console.log("Users data from backend:", response.data.users);
      return response.data.users;
    } else {
      console.error("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function deleteUser(userId: number) {
  try {
    const response = await api.delete(`/users/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function getUserInfo(userId: string): Promise<Profile> {
  try {
    const response = await axios.get(`/users/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  userData: Partial<Profile>,
): Promise<void> {
  try {
    await axios.put(`/users/users/${userId}`, userData);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function addReport(formData: Report) {
  const validatedData = reportFormSchema.parse(formData);
  return api.post("/reports/reports", validatedData);
}

export async function fetchCategories(): Promise<
  z.infer<typeof categoriesSchema>
> {
  const response = await api.get("/categories/categories/");
  return categoriesSchema.parse(response.data);
}

export async function fetchRoles(): Promise<Role[]> {
  try {
    const response = await api.get("/roles/roles");
    return response.data.roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

export async function addUser(
  data: z.infer<typeof addUserFormSchema>,
): Promise<z.infer<typeof addUserFormSchema>> {
  try {
    const response = await api.post("/users/create/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function fetchReports(): Promise<Report[]> {
  const response = await api.get("/reports/reports");
  if (response.data && Array.isArray(response.data.reports)) {
    const reports = response.data.reports as Report[];
    return reports;
  } else {
    return [];
  }
}

export async function fetchReportById(
  reportId: number,
): Promise<Report> {
  const response = await api.get(`/reports/reports/${reportId}`);
  if (response.data && response.data.report) {
    const report = response.data.report as Report;
    return report;
  } else {
    throw new Error("API response data is not as expected");
  }
}

export async function updateReport(
  reportId: number | string,
  updatedReport: Partial<Report>,
): Promise<void> {
  try {
    await api.put(`/reports/reports/${reportId}`, updatedReport);
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function updateUser(user: User) {
  try {
    const response = await api.put(`/users/users/${user.id}`, user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function fetchContributors(): Promise<Contributor[]> {
  try {
    const response = await api.get("/contributors/contributors");
    return response.data.contributors;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    throw error;
  }
}

export async function addContributor(formData: Contributor) {
  try {
    const response = await api.post("/contributors/contributors", formData);
    return response.data;
  } catch (error) {
    console.error("Error adding contributor:", error);
    throw error;
  }
}

export async function editContributor(id: number, formData: Contributor) {
  try {
    const response = await api.put(`/contributors/contributors/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error editing contributor:", error);
    throw error;
  }
}

export async function deleteContributor(id: number) {
  try {
    const response = await api.delete(`/contributors/contributors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting contributor:", error);
    throw error;
  }
}
