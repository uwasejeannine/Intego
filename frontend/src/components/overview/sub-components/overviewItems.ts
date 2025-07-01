import { Icons } from "@/components/ui/icons";
import { OverviewDisplay } from "@/types/types";

export const overviewItemsForSectorCoordinator: OverviewDisplay[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Icons.ProjectsIcon,
    href: "/projects-view",
  },
  {
    label: "Data Entry",
    icon: Icons.DataEntryIcon,
    dialogOptions: [
      {
        label: "Add Project",
        icon: Icons.AddProjectIcon,
        href: "/add-project",
      },
      { label: "Add Report", icon: Icons.AddReportIcon, href: "/add-report" },
    ],
  },
  {
    label: "Reports",
    icon: Icons.ReportsIcon,
    href: "/reports-view",
  },
  {
    label: "Archives",
    icon: Icons.ArchiveIcon,
    href: "/archives",
  },
];

export const overviewItemsForDistrictAdministrator: OverviewDisplay[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Icons.ProjectsIcon,
    href: "/projects-view",
  },
  {
    label: "Reports",
    icon: Icons.ReportsIcon,
    href: "/reports-view",
  },
  {
    label: "Archives",
    icon: Icons.ArchiveIcon,
    href: "/archives",
  },
];

export const overviewItemsForAdmin: OverviewDisplay[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Users",
    icon: Icons.UserIcon,
    href: "/users-view",
  },
  {
    label: "System",
    icon: Icons.SystemIcon,
    href: "/system",
  },
  {
    label: "Integration",
    icon: Icons.IntegrationIcon,
    href: "/integration",
  },
  {
    label: "Backups",
    icon: Icons.BackupIcon,
    href: "/backups",
  },
];

// Keep old exports for backward compatibility during transition
export const overviewItemsForMandEOfficer = overviewItemsForSectorCoordinator;
export const overviewItemsForSeniorManagement = overviewItemsForDistrictAdministrator;
export const overviewItemsForITAdmin = overviewItemsForAdmin;