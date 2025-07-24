// Role ID mapping enforced throughout the app:
// 3: admin
// 4: districtAdministrator
// 2: sectorCoordinator

import * as React from "react";

export const flagStatus = [
  { label: "On Track", value: "On Track" },
  { label: "Delay", value: "Delay" },
  { label: "At Risk", value: "At Risk" },
];

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export const roles = [
  { label: "Admin", value: "admin", id: 3 },
  { label: "District Administrator", value: "districtAdministrator", id: 4 },
  { label: "Sector Coordinator", value: "sectorCoordinator", id: 2 },
];

export type SidebarItem = {
  label: React.ReactNode;
  icon: React.ElementType;
  href?: string;
  subItems?: SidebarItem[];
};

export type UserType = "admin" | "districtAdministrator" | "sectorCoordinator";

export type OverviewDisplay = {
  label?: React.ReactNode;
  icon?: React.ElementType;
  href?: string;
  dialogOptions?: OverviewDisplay[];
};

export interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  userType?: UserType;
  categoryId?: number;
  flagStatus?: any;
  numberOfReports?: React.ReactNode;
  projectName?: string;
  totalBudgetSpending?: string;
  location?: string;
  totalProjectBudget?: {
    currency: string;
    amount: string;
  };
  projectDuration?: string;
  projectDescription?: string;
  projectObjectives?: string;
  keyOutputs?: string;
  keyChallengesFaced?: string;
  proposedSolutions?: string;
  categoryOfProject?: string;
  keyIndicators?: string;
  annTargets?: Record<string, {
    main: boolean;
    values: [number, string];
  }>;
  cumulativeAchievements?: string;
  nonCumulativeAchievements?: string;
  cumulativeAchievementsOption?: string;
  term?: string;
  MTof?: string | null;
  Haof?: string | null;
  numberOf?: string | null;
  percentOf?: string | null;
  projectId?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roleId: number;
  role?: Role;
  gender?: string;
  phoneNumber?: string;
  profileImage?: string;
  agencyName?: string;
  sectorofOperations?: string;
  position?: string;
  district_id?: number;
  sector_id?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface Profile {
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
  role?: string;
  position?: string;
  roleId?: string;
  newPassword?: string;
  confirmPassword?: string;
  status?: "Active" | "Inactive" | "Offline";
}

export interface District {
  id: number;
  name: string;
  sectors: Sector[];
}

export interface Sector {
  id: number;
  name: string;
  district_id: number;
}

export interface Contributor {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  organization?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string | number;
  name: string;
}