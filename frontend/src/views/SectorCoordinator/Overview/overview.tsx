import OverviewDisplay from "@/components/overview/overview-display";
import { Navbar } from "../../../components/navigation/main-navbar";

import { motion } from "framer-motion";

export function SectorCoordinatorOverviewPage() {
  return (
    <div className="overflow-y-scroll no-scrollbar">
      <Navbar />
      <motion.div className="shrink overview-container flex justify-center items-center my-[80px] lg:mt-[8%]">
        <OverviewDisplay user="sectorCoordinator" />
      </motion.div>
    </div>
  );
}

export default SectorCoordinatorOverviewPage;