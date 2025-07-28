import React, { useState } from "react";
import DistrictAdministratorSidebar from "@/views/DistrictAdministrator/Navigation/sidebar-menu";
import { Navbar } from "@/components/navigation/main-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb, BarChart2, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const alerts = {
  agriculture: [
    {
      id: 1,
      title: "Drought Warning",
      description: "Severe drought expected in the Eastern province. Farmers are advised to take necessary precautions.",
      date: "2025-07-28",
      severity: "High",
      meaning: "A drought is a period of below-average precipitation in a given region, resulting in prolonged shortages in its water supply. This can lead to reduced crop yields, livestock losses, and food shortages.",
      analysis: "Meteorological data indicates a 90% probability of a severe drought in the Eastern province for the next three months. Soil moisture levels are already 50% below the seasonal average.",
      recommendation: "Immediate implementation of the national drought contingency plan is recommended. Key actions include:",
      points: [
        "Distribution of drought-resistant seeds to 100,000 farmers.",
        "Activation of water conservation measures, including rationing for non-essential use.",
        "Allocation of emergency funds for livestock feed and water transportation.",
      ],
      source: "National Meteorological Agency",
    },
    {
      id: 2,
      title: "Pest Infestation",
      description: "Fall armyworm infestation reported in the Southern province. Immediate action required.",
      date: "2025-07-27",
      severity: "Medium",
      meaning: "A pest infestation is the presence of a large number of pests in a particular place, which can cause significant damage to crops.",
      analysis: "Field reports confirm a fall armyworm infestation in 50% of the farms in the Southern province. The infestation is spreading at a rate of 10 km per day.",
      recommendation: "Immediate procurement and distribution of pesticides to the affected areas is recommended. Key actions include:",
      points: [
        "Distribution of 10,000 liters of pesticides to the affected farmers.",
        "Deployment of agricultural extension officers to train farmers on the safe use of pesticides.",
        "Establishment of a task force to monitor the spread of the infestation.",
      ],
      source: "Ministry of Agriculture",
    },
  ],
  health: [
    {
      id: 1,
      title: "Malaria Outbreak",
      description: "Increase in malaria cases reported in the Western province. Distribute mosquito nets.",
      date: "2025-07-26",
      severity: "High",
      meaning: "A malaria outbreak is a sudden increase in the number of malaria cases in a particular area, which can overwhelm the healthcare system.",
      analysis: "Health data shows a 200% increase in malaria cases in the Western province in the last month. The outbreak is concentrated in the rural areas, where access to healthcare is limited.",
      recommendation: "Immediate deployment of a rapid response team to the affected areas is recommended. Key actions include:",
      points: [
        "Distribution of 100,000 mosquito nets to the affected households.",
        "Provision of free malaria testing and treatment to all residents.",
        "Launch of a public awareness campaign on malaria prevention.",
      ],
      source: "Ministry of Health",
    },
  ],
  education: [
    {
      id: 1,
      title: "School Reopening",
      description: "All schools are scheduled to reopen on September 1st, 2025.",
      date: "2025-07-25",
      severity: "Low",
      meaning: "This is a notification about the reopening of schools after the holidays.",
      analysis: "The current situation indicates that it is safe to reopen schools. All schools have been inspected and certified to be compliant with the safety guidelines.",
      recommendation: "All students are expected to report to their respective schools on that day. Key actions include:",
      points: [
        "Dissemination of the school reopening guidelines to all schools.",
        "Monitoring of the implementation of the safety guidelines in all schools.",
        "Provision of support to schools that are not yet compliant with the safety guidelines.",
      ],
      source: "Ministry of Education",
    },
  ],
};

const Alerts: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  return (
    <>
      <Navbar />
      <DistrictAdministratorSidebar />
      <main className="pl-[250px] pr-[20px] bg-gray-50">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4 text-[#137775]">Alerts</h1>
          <Tabs defaultValue="agriculture" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="agriculture" className="flex-1">
                Agriculture
              </TabsTrigger>
              <TabsTrigger value="health" className="flex-1">
                Health
              </TabsTrigger>
              <TabsTrigger value="education" className="flex-1">
                Education
              </TabsTrigger>
            </TabsList>
            <TabsContent value="agriculture">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.agriculture.map((alert) => (
                  <Card key={alert.id}>
                    <CardHeader>
                      <CardTitle>{alert.title}</CardTitle>
                      <CardDescription>{alert.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{alert.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAlert(alert)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="health">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.health.map((alert) => (
                  <Card key={alert.id}>
                    <CardHeader>
                      <CardTitle>{alert.title}</CardTitle>
                      <CardDescription>{alert.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{alert.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAlert(alert)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="education">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.education.map((alert) => (
                  <Card key={alert.id}>
                    <CardHeader>
                      <CardTitle>{alert.title}</CardTitle>
                      <CardDescription>{alert.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{alert.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAlert(alert)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          {selectedAlert && (
            <Dialog open onOpenChange={() => setSelectedAlert(null)}>
              <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-[#137775]">
                    {selectedAlert.title}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedAlert.date}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-black">
                  <div className="flex items-start gap-4">
                    <Lightbulb className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-bold text-lg">Meaning</h3>
                      <p>{selectedAlert.meaning}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BarChart2 className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h3 className="font-bold text-lg">Analysis</h3>
                      <p>{selectedAlert.analysis}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <h3 className="font-bold text-lg">Recommendation</h3>
                      <p>{selectedAlert.recommendation}</p>
                      <ul className="list-disc list-inside mt-2">
                        {selectedAlert.points.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 pt-4 border-t mt-4">
                    Source: {selectedAlert.source}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </>
  );
};

export default Alerts;
