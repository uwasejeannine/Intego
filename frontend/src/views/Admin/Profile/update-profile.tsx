import { Navbar } from "@/components/navigation/main-navbar";
import UpdateProfileForm from "@/components/forms/profile/update-profile-form";
import AdminSidebar from "../Navigation/sidebar-menu";

export function AdminUpdateProfilePage() {
  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <UpdateProfileForm />
    </>
  );
}

export default AdminUpdateProfilePage;