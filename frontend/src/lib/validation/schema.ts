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

export const reportFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  totalBudgetSpending: z.string().min(1, "Total budget spending is required"),
  location: z.string().min(1, "Location is required"),
  totalProjectBudget: z.object({
    currency: z.string().min(1, "Currency is required"),
    amount: z.string().min(1, "Amount is required"),
  }),
  projectDuration: z.string().min(1, "Project duration is required"),
  projectDescription: z.string().min(1, "Project description is required"),
  projectObjectives: z.string().min(1, "Project objectives are required"),
  keyOutputs: z.string().min(1, "Key outputs are required"),
  keyChallengesFaced: z.string().min(1, "Key challenges are required"),
  proposedSolutions: z.string().min(1, "Proposed solutions are required"),
  categoryOfProject: z.string().min(1, "Category is required"),
  keyIndicators: z.string().min(1, "Key indicators are required"),
  annTargets: z.record(
    z.object({
      main: z.boolean(),
      values: z.tuple([z.number(), z.string()]),
    }),
  ),
  cumulativeAchievements: z.string().min(1, "Cumulative achievements are required"),
  nonCumulativeAchievements: z.string().min(1, "Non-cumulative achievements are required"),
  cumulativeAchievementsOption: z.string().min(1, "Cumulative achievements option is required"),
  term: z.string().min(1, "Term is required"),
  MTof: z.string().optional(),
  Haof: z.string().optional(),
  numberOf: z.string().optional(),
  percentOf: z.string().optional(),
  projectId: z.string().min(1, "Project ID is required"),
});

export const categoriesSchema = z.object({
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});

export const VerificationCodeSchema = z.object({
  code: z.string().min(6, "Verification code must be 6 characters"),
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
  roleId: z.number().min(1, "Please select a role"),
});

const ContributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
});
