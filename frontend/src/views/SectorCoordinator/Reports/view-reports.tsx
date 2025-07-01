import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "../../../components/navigation/main-navbar";
import SectorCoordinatorSidebar from "../Navigation/sidebar-menu";
import { fetchReports } from "@/lib/api/api";
import { DataTable } from "@/components/tables/reports/all-reports/data-table";
import {
  Report,
  columns,
} from "@/components/tables/reports/all-reports/columns";
import useMediaQuery from "@/hooks/useMediaQuery";

interface GroupedReports {
  [key: string]: Report & { numberOfReports: number };
}

export default function SectorCoordinatorReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedReports = await fetchReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchData();
  }, []);

  // Group reports by project name and calculate the count of reports for each project
  const groupedReports: GroupedReports = reports.reduce((acc, curr) => {
    if (acc[curr.projectName]) {
      acc[curr.projectName].numberOfReports++;
    } else {
      acc[curr.projectName] = {
        ...curr,
        numberOfReports: 1,
      };
    }
    return acc;
  }, {} as GroupedReports);
  
  const formattedReports = Object.values(groupedReports);
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <div>
      <Navbar className="z-[1]" />
      <SectorCoordinatorSidebar />
      <div
        className={`${!isMobile ? "pt-[80px] pl-[250px] pr-[10px]" : "w-full py-20 px-2"}`}
      >
        <Tabs defaultValue="all-reports" className="space-y-4">
          <div className="bg-white h-[80px] w-[96%] flex items-center pl-[70px] justify-items-center rounded-md dark:bg-slate-500">
            <TabsList className="w-[93%] items-start flex justify-start">
              <TabsTrigger value="all-reports">All Reports</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
          </div>
          <div className=" relative w-[96%]">
            <TabsContent value="all-reports">
              {/* Pass the formattedReports to the DataTable component */}
              <DataTable
                columns={columns}
                data={formattedReports}
                initialLoading={false}
                userType="sectorCoordinator"
              />
            </TabsContent>
            <TabsContent value="discussion">
              <div className="bg-white h-[80px] w-[100%] flex items-center pl-[70px] justify-items-center rounded-md dark:bg-slate-500">
                {" "}
                {/* Align with TabsList and add white background */}
                <h2 className="text-xl font-bold mb-2">Discussion Messages</h2>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}