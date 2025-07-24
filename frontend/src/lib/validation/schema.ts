import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const passwordResetFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const changePasswordFormSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  agencyName: z.string().min(1, "Please select an agency"),
  sectorofOperations: z.string().min(1, "Please select a sector"),
  position: z.string().min(1, "Please select a position"),
});

export const addUserFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  sectorofOperations: z.enum(["Education", "Agriculture", "Health"], {
    required_error: "Please select a sector of operations",
  }),
  roleId: z.string().min(1, "Please select a role"),
  district: z.string().optional(),
  sector: z.string().optional(),
}).refine((data) => {
  const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
  const selectedRole = roles.find((r: any) => r.id.toString() === data.roleId);
  
  if (selectedRole) {
    const roleName = selectedRole.name.toLowerCase();
    
    // District Administrator must select a district
    if (roleName === 'districtadministrator') {
      return data.district && data.district.length > 0;
    }
    
    // Sector Coordinator must select both district and sector
    if (roleName === 'sectorcoordinator') {
      return data.district && data.district.length > 0 && data.sector && data.sector.length > 0;
    }
  }
  
  return true;
}, {
  message: "Please select the required location fields for this role",
  path: ["district"]
});

type FormData = z.infer<typeof addUserFormSchema>;

export const reportFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  status: z.string().min(1, "Status is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
});

export const categoriesSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
  })
);

export const VerificationCodeSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});
