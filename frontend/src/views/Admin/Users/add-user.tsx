import AddUserForm from "@/components/forms/users/add-user-form";
import { Navbar } from "@/components/navigation/main-navbar";
import AdminSidebar from "@/views/Admin/Navigation/sidebar-menu";

export function AddUserPage() {
  return (
    <>
      <Navbar className="z-[1]" />
      <AdminSidebar />
      <AddUserForm  />
    </>
  );
}

export default AddUserPage;