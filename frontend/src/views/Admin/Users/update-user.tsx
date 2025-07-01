import UpdateUserForm from "@/components/forms/users/update-user-form";
import { Navbar } from "@/components/navigation/main-navbar";
import AdminSidebar from "@/views/Admin/Navigation/sidebar-menu";

export function UpdateUserPage() {
  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <UpdateUserForm />
    </>
  );
}

export default UpdateUserPage;