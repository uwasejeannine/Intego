import OverviewDisplay from "@/components/overview/overview-display";
import { Navbar } from "../../../components/navigation/main-navbar"; 

import { motion } from "framer-motion";

export function DistrictAdministratorOverviewPage() {
  return (
    <div className="">
      <Navbar />
      <motion.div className="shrink overview-container flex justify-center items-center my-[80px] lg:mt-[8%]">
        <OverviewDisplay user="districtAdministrator" />
      </motion.div>
    </div>
  );
}

export default DistrictAdministratorOverviewPage;