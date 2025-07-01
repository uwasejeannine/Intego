import OverviewDisplay from "@/components/overview/overview-display";
import { Navbar } from "../../../components/navigation/main-navbar"; // Change import statement

import { motion } from "framer-motion";

export function AdminOverviewPage() {
  return (
    <div className="">
      <Navbar />
      <motion.div className=" shrink overview-container flex justify-center items-center my-[80px] lg:my-[8%]">
        <OverviewDisplay user="admin" />
      </motion.div>
    </div>
  );
}

export default AdminOverviewPage;