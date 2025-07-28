import axios from "axios";
import { z } from "zod";
import {
  loginFormSchema,
  passwordResetFormSchema,
  changePasswordFormSchema,
  reportFormSchema,
  categoriesSchema,
  VerificationCodeSchema,
  addUserFormSchema,
} from "@/lib/validation/schema";
import { Profile, Report, Role, User, UserType } from "@/types/types";
import { Contributor } from "@/types/types";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Log request details for debugging
    console.log('🔍 Making request to:', config.url);
    console.log('🎫 Current token:', token);
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔒 Added token to request headers');
    } else {
      // If no token, check if we're on a public route
      const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/validate-code'];
      const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
      
      if (!isPublicRoute) {
        console.warn('⚠️ No auth token found for protected route:', config.url);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response from:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.log('🚫 Unauthorized access, clearing token and redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      return Promise.reject(new Error('Unauthorized access'));
    }
    
    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.error('❓ Resource not found:', error.config.url);
      return Promise.reject(new Error('Resource not found'));
    }
    
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  try {
    console.log('🔐 Sending login request with:', { email });
    
  const response = await api.post("/auth/login", {
      usernameOrEmail: email,
      password: password,
    });

    console.log('📡 Login response:', response.data);

    if (response.data.status !== 'success' || !response.data.token || !response.data.user) {
      throw new Error('Invalid response from server');
    }

    // Store token in localStorage
    localStorage.setItem('token', response.data.token);

    // Set token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

  return response.data;
  } catch (error) {
    console.error('❌ Login function error:', error);
    // Clean up on error
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    throw error;
  }
}

export async function logout() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Call logout endpoint with token
      await api.post("/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clean up token
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
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
export async function changePassword(email: string, password: string) {
  const validatedData = changePasswordFormSchema.parse({
    newPassword: password,
    confirmPassword: password,
  });
  return api.post(`/users/change-password`, {
    email: email,
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
    const response = await api.get("/roles");
    console.log('👥 Raw roles response:', response);
    console.log('👥 Roles response data:', response.data);

    // Handle different response structures
    if (response.data && Array.isArray(response.data)) {
    return response.data;
    } else if (response.data && Array.isArray(response.data.roles)) {
      return response.data.roles;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('❌ Invalid roles response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching roles:', error);
    throw error;
  }
}

export async function addUser(data: z.infer<typeof addUserFormSchema>) {
  try {
    const submitData = {
      ...data,
      roleId: parseInt(data.roleId, 10),
      district_id: data.district || null,
      sector_id: data.sector || null,
    };

    // Remove the original district and sector fields
    delete (submitData as any).district;
    delete (submitData as any).sector;

    console.log('Submitting user data:', submitData);
    const response = await api.post("/users/create/", submitData);
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

// === SCHOOLS ===
export async function fetchSchools() {
  const res = await api.get('/schools');
  return res.data;
}
export async function fetchSchoolById(id: number) {
  const res = await api.get(`/schools/${id}`);
  return res.data;
}
export async function createSchool(data: any) {
  const res = await api.post('/schools', data);
  return res.data;
}
export async function updateSchool(id: number, data: any) {
  const res = await api.put(`/schools/${id}`, data);
  return res.data;
}
export async function deleteSchool(id: number) {
  const res = await api.delete(`/schools/${id}`);
  return res.data;
}

// === STUDENTS ===
export async function fetchStudents() {
  const res = await api.get('/students');
  return res.data;
}
export async function fetchStudentById(id: number) {
  const res = await api.get(`/students/${id}`);
  return res.data;
}
export async function createStudent(data: any) {
  const res = await api.post('/students', data);
  return res.data;
}
export async function updateStudent(id: number, data: any) {
  const res = await api.put(`/students/${id}`, data);
  return res.data;
}
export async function deleteStudent(id: number) {
  const res = await api.delete(`/students/${id}`);
  return res.data;
}

// === TEACHERS ===
export async function fetchTeachers() {
  const res = await api.get('/teachers');
  return res.data;
}
export async function fetchTeacherById(id: number) {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
}
export async function createTeacher(data: any) {
  const res = await api.post('/teachers', data);
  return res.data;
}
export async function updateTeacher(id: number, data: any) {
  const res = await api.put(`/teachers/${id}`, data);
  return res.data;
}
export async function deleteTeacher(id: number) {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
}

// === DROPOUTS ===
export async function fetchDropouts() {
  const res = await api.get('/dropouts');
  return res.data;
}
export async function fetchDropoutById(id: number) {
  const res = await api.get(`/dropouts/${id}`);
  return res.data;
}
export async function createDropout(data: any) {
  const res = await api.post('/dropouts', data);
  return res.data;
}
export async function updateDropout(id: number, data: any) {
  const res = await api.put(`/dropouts/${id}`, data);
  return res.data;
}
export async function deleteDropout(id: number) {
  const res = await api.delete(`/dropouts/${id}`);
  return res.data;
}

// === PERFORMANCES ===
export async function fetchPerformances() {
  const res = await api.get('/performances');
  return res.data;
}
export async function fetchPerformanceById(id: number) {
  const res = await api.get(`/performances/${id}`);
  return res.data;
}
export async function createPerformance(data: any) {
  const res = await api.post('/performances', data);
  return res.data;
}
export async function updatePerformance(id: number, data: any) {
  const res = await api.put(`/performances/${id}`, data);
  return res.data;
}
export async function deletePerformance(id: number) {
  const res = await api.delete(`/performances/${id}`);
  return res.data;
}

// === INFRASTRUCTURES ===
export async function fetchInfrastructures() {
  const res = await api.get('/infrastructures');
  return res.data;
}
export async function fetchInfrastructureById(id: number) {
  const res = await api.get(`/infrastructures/${id}`);
  return res.data;
}
export async function createInfrastructure(data: any) {
  const res = await api.post('/infrastructures', data);
  return res.data;
}
export async function updateInfrastructure(id: number, data: any) {
  const res = await api.put(`/infrastructures/${id}`, data);
  return res.data;
}
export async function deleteInfrastructure(id: number) {
  const res = await api.delete(`/infrastructures/${id}`);
  return res.data;
}

export async function fetchFarmers() {
  const res = await api.get('/farmers/individual/');
  const data = res.data;
  return data?.data || data || [];
}
export async function fetchCrops() {
  const res = await api.get('/crops');
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
}
export async function fetchCooperatives() {
  const res = await api.get('/farmers/cooperatives');
  const data = res.data;
  return data?.data || data || [];
}

export async function fetchFeedbackForUser(userId: number) {
  try {
    const response = await api.get(`/feedback/user/${userId}`);
    return response.data.feedbacks || [];
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    return [];
  }
}

export async function fetchFeedbackForCrop(itemId: number | string) {
  try {
    const response = await api.get(`/feedback?section=crops&itemId=${itemId}`);
    return response.data.feedbacks || [];
  } catch (error) {
    console.error('Error fetching crop feedback:', error);
    return [];
  }
}

export async function createFeedback(data: {
  section: string;
  itemId: number;
  fromUserId: number;
  toUserId?: number;
  message: string;
  parentId?: number;
}) {
  try {
    const response = await api.post('/feedback', data);
    return response.data.feedback;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
}

export async function fetchSectors() {
  try {
    const response = await api.get('/locations/sectors');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
}

export async function fetchSectorsByDistrict(districtId: number) {
  try {
    const response = await api.get(`/locations/districts/${districtId}/sectors`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching sectors by district:', error);
    return [];
  }
}

export async function fetchDistricts() {
  try {
    const response = await api.get('/locations/districts');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}
