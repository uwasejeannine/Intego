import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectorCoordinatorSidebar from "../Navigation/sidebar-menu";
import { Navbar } from "../../../components/navigation/main-navbar";
import { fetchReportById } from "@/lib/api/api";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SectorCoordinatorReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const reportDetails = await fetchReportById(parseInt(id, 10));
        setReport(reportDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report details:", error);
        console.log("Error object:", error);
        setError("Failed to fetch report details.");
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <>
      <Navbar className="z-[1]" />
      <SectorCoordinatorSidebar />
      <div className="pt-[100px] pl-[100px] ml-[10%]">
        <Card className="flex w-[96%] justify-center items-center justify-items-center mb-5 dark:bg-slate-700">
          <CardHeader className="font-bold">
            {report && report.projectName}
          </CardHeader>
        </Card>
        <Card className=" w-[96%] dark:bg-slate-800 ">
          {report && (
            <div className="bg-white dark:bg-slate-800 shadow-md rounded-md p-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="font-bold">Project Basic Information</h2>
                  <Separator className="mt-2 mb-4" />
                  <p className="mb-5">
                    <b>Location (Districts)</b>
                  </p>
                  <p className="mb-5">{report.location}</p>
                  <p className="mb-5">
                    <b>Total budget of the Project :</b>{" "}
                    {report.totalProjectBudget?.amount}{" "}
                    {report.totalProjectBudget?.currency}
                  </p>
                  <p className="mb-5">
                    <b>Project duration</b>
                  </p>
                  <p className="mb-5">{report.projectDuration}</p>
                  <p className="mb-5">
                    <b>Project Description</b>
                  </p>
                  <p className="mb-5">{report.projectDescription}</p>
                  <p className="mb-5">
                    <b>Project objectives</b>
                  </p>
                  <p className="mb-5">{report.projectObjectives}</p>
                  <p className="mb-5">
                    <b>Key Outputs</b>
                  </p>
                  <p className="mb-5">{report.keyOutputs}</p>
                  <p className="mb-5">
                    <b>Project Category</b>
                  </p>
                  <p className="mb-5">{report.categoryOfProject}</p>
                </div>
                <div className="border-l border-gray-300 pl-8">
                  <h2 className="font-bold">Details of the Project Progress</h2>
                  <Separator className="mt-2 mb-4" />
                  <p className="mb-5">
                    <b>Total budget spending : </b> {report.totalBudgetSpending}
                  </p>
                  <p className="mb-5">
                    <b>Physical achievements Vs Annual targets (Summary)</b>
                  </p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">
                          Key Indicators
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Annual Targets
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Cumulative Achievements
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          {report.keyIndicators}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <ul className="list-disc ml-6 mb-4">
                            {report.annTargets &&
                              Object.entries(report.annTargets).map(
                                ([key, value], index) => {
                                  const [numberValue, stringValue] = value;
                                  return (
                                    <p key={index}>
                                      {key}: {numberValue} - {stringValue}
                                    </p>
                                  );
                                },
                              )}
                          </ul>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {report.cumulativeAchievements}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mb-5">
                    <b>General implementation progress in %</b> ...
                  </p>
                  <p className="mb-5">
                    <b>Key challenges faced</b>
                  </p>
                  <p className="mb-5">{report.keyChallengesFaced}</p>
                  <p className="mb-5">
                    <b>
                      Proposed solutions to address the identified challenges
                    </b>
                  </p>
                  <p className="mb-5">{report.proposedSolutions}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default SectorCoordinatorReportDetailsPage;