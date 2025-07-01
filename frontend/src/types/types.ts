import * as React from "react";

export const flagStatus = [
  { label: "On Track", value: "On Track" },
  { label: "Delay", value: "Delay" },
  { label: "At Risk", value: "At Risk" },
];

export type Role = {
  id: number;
  name: string;
  description: string;
};

export const roles = [
  { label: "MandEOfficer", value: "MandEOfficer" },
  { label: "ITAdmin", value: "ITAdmin" },
  { label: "projectManager", value: "projectManager" },
  { label: "seniorManagement", value: "seniorManagement" },
  { label: "Sector Coordinator", value: "sectorCoordinator" },
  { label: "District Administrator", value: "districtAdministrator" },
  { label: "Admin", value: "admin" },
];

export type AgencyName = "MINAGRI" | "NAEB" | "RAB";

export type SidebarItem = {
  label: React.ReactNode;
  icon: React.ElementType;
  href?: string;
  subItems?: SidebarItem[];
};

export type UserType =
  | "seniorManagement"
  | "MandEOfficer"
  | "projectManager"
  | "ITAdmin"
  | "sectorCoordinator"
  | "districtAdministrator"
  | "admin";

export type OverviewDisplay = {
  label?: React.ReactNode;
  icon?: React.ElementType;
  href?: string;
  dialogOptions?: OverviewDisplay[];
};

export type Report = {
  userType: UserType;
  categoryId: number;
  flagStatus: any;
  numberOfReports: React.ReactNode;
  id: string;
  projectName: string;
  totalBudgetSpending: string;
  location: string;
  totalProjectBudget: {
    currency: string;
    amount: string;
  };
  projectDuration: string;
  projectDescription: string;
  projectObjectives: string;
  keyOutputs: string;
  keyChallengesFaced: string;
  proposedSolutions: string;
  categoryOfProject: string;
  keyIndicators: string;
  annTargets: anunualtargets;
  cumulativeAchievements: string;
  nonCumulativeAchievements: string;
  cumulativeAchievementsOption: string;
  term: string;
  MTof?: string | null;
  Haof?: string | null;
  numberOf?: string | null;
  percentOf?: string | null;
  projectId: string;
  status:
    | "Pending"
    | "Ongoing"
    | "Completed"
    | "Stopped"
    | "Under Review"
    | "Rejected";
  createdAt: string;
};

export type Profile = {
  id?: string | number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profileImage?: string;
  phoneNumber?: string | number;
  gender?: string;
  agencyName?: string;
  sectorofOperations?: string;
  yourRole?: string;
  position?: string;
  roleId?: string;
  newPassword?: string;
  confirmPassword?: string;
  status: "Active" | "Inactive" | "Offline";
};
export type Category = {
  id: string | number;
  name: string;
};

export type Contributor = {
  id: number;
  name: string;
  phoneNumber: string;
  role?: string;
};

interface anunualtargets {
  [key: string]: {
    main: boolean;
    values: [number, string];
  };
}

// types.ts
export interface User {
  role: any;
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phoneNumber: string;
  agencyName: string;
  sectorofOperations: string;
  profileImage: string;
  roleId: number;
  projectId: number | null;
  status: string;
  passwordResetExpires: string | null;
  passwordResetCode: string | null;
  loginAttempts: number;
}