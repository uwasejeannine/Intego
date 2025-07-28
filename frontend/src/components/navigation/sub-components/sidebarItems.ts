import { Icons } from "@/components/ui/icons";
import { SidebarItem } from "@/types/types";

export const sidebarItemsForSeniorManagement: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Icons.ProjectsIcon,
    subItems: [
      {
        label: "View Project",
        icon: Icons.ViewProjectIcon,
        href: "/projects-view",
      },
    ],
  },
  {
    label: "Reports",
    icon: Icons.ReportsIcon,
    subItems: [
      {
        label: "View Reports",
        icon: Icons.ReportsIcon,
        href: "/reports-view",
      },
    ],
  },
  {
    label: "Archive",
    icon: Icons.ArchiveIcon,
    href: "/archive",
  },
];

export const sidebarItemsForMandEOfficer: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Icons.ProjectsIcon,
    subItems: [
      {
        label: "View Project",
        icon: Icons.ViewProjectIcon,
        href: "/projects-view",
      },
      {
        label: "Add Project",
        icon: Icons.ViewProjectIcon,
        href: "/add-project",
      },
    ],
  },
  {
    label: "Reports",
    icon: Icons.ReportsIcon,
    subItems: [
      {
        label: "View Reports",
        icon: Icons.ReportsIcon,
        href: "/reports-view",
      },
      {
        label: "Add Report",
        icon: Icons.ViewProjectIcon,
        href: "/add-report",
      },
    ],
  },
  {
    label: "Archive",
    icon: Icons.ArchiveIcon,
    href: "/archive",
  },
];

export const sidebarItemsForProjectManager: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Icons.ProjectsIcon,
    subItems: [
      {
        label: "View Project",
        icon: Icons.ViewProjectIcon,
        href: "/projects-view",
      },
      {
        label: "Approve Projects",
        icon: Icons.ViewProjectIcon,
        href: "/approve-projects-view",
      },
      {
        label: "Add Project",
        icon: Icons.AddProjectIcon,
        href: "/add-project",
      },
    ],
  },
  {
    label: "Reports",
    icon: Icons.ReportsIcon,
    subItems: [
      {
        label: "View Reports",
        icon: Icons.ReportsIcon,
        href: "/reports-view",
      },
      {
        label: "Approve Reports",
        icon: Icons.ReportsIcon,
        href: "/approve-reports-view",
      },
      {
        label: "Add Report",
        icon: Icons.AddReportIcon,
        href: "/add-report",
      },
    ],
  },
  {
    label: "Archive",
    icon: Icons.ArchiveIcon,
    href: "/archive",
  },
];

export const sidebarItemsForITAdmin: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: Icons.SidebarDashboard,
    href: "/dashboard",
  },
  {
    label: "Users",
    icon: Icons.UserIcon,
    subItems: [
      {
        label: "View Users",
        icon: Icons.ViewUsers,
        href: "/users-view",
      },
      { label: "Add User", icon: Icons.AddUser, href: "/add-user" },
    ],
  },
  {
    label: "Roles",
    icon: Icons.RoleIcon,
    href: "/roles-management",
  },
  {
    label: "Terms & Conditions",
    icon: Icons.SystemIcon,
    href: "/terms-and-conditions",
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
    label: "Backup",
    icon: Icons.BackupIcon,
    subItems: [
      {
        label: "Backup Schedule",
        icon: Icons.BackupScheduleIcon,
        href: "/backup/schedule",
      },
      {
        label: "Recovery Options",
        icon: Icons.RecoveryOptionsIcon,
        href: "/backup/recovery",
      },
      {
        label: "Backup History",
        icon: Icons.BackupHistoryIcon,
        href: "/backup/history",
      },
    ],
  },
];
