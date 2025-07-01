import { Navbar } from "@/components/navigation/main-navbar";
import UpdateProfileForm from "@/components/forms/profile/update-profile-form";
import DistrictAdministratorSidebar from "../Navigation/sidebar-menu";

export function DistrictAdministratorUpdateProfilePage() {
  return (
    <>
      <Navbar className="z-[1]" />
      <DistrictAdministratorSidebar />
      <UpdateProfileForm />
    </>
  );
}

export default DistrictAdministratorUpdateProfilePage;