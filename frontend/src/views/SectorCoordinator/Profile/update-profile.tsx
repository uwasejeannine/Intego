import { Navbar } from "@/components/navigation/main-navbar";
import UpdateProfileForm from "@/components/forms/profile/update-profile-form";
import SectorCoordinatorSidebar from "../Navigation/sidebar-menu";

export function SectorCoordinatorUpdateProfilePage() {
  return (
    <>
      <Navbar className="z-[1]" />
      <SectorCoordinatorSidebar />
      <UpdateProfileForm />
    </>
  );
}

export default SectorCoordinatorUpdateProfilePage;