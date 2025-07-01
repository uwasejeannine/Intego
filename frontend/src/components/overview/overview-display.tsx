import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Link } from "react-router-dom";
import { UserType } from "@/types/types";
import {
  overviewItemsForITAdmin,
  overviewItemsForSeniorManagement,
  overviewItemsForMandEOfficer,
} from "./sub-components/overviewItems";

interface OverviewDisplayProps {
  user: UserType;
}

const OverviewDisplay: React.FC<OverviewDisplayProps> = ({ user }) => {
  const overviewDisplayItems = (() => {
    switch (user) {
      case "districtAdministrator":
        return overviewItemsForSeniorManagement;
      case "sectorCoordinator":
        return overviewItemsForMandEOfficer;
      case "admin":
        return overviewItemsForITAdmin;
      default:
        return [];
    }
  })();

  const userTypePath = (() => {
    switch (user) {
      case "districtAdministrator":
        return "district-admin";
      case "sectorCoordinator":
        return "sector-coordinator";
      case "admin":
        return "admin";
      default:
        return "";
    }
  })();

  // Color palette for cards
  const cardColors = [
    'bg-[#2596be]', // blue
    'bg-[#F89D2D]', // orange
    'bg-[#099773]', // green
  ];

  return (
    <>
      <main className="shrink flex items-center justify-center px-5">
        {user === "sectorCoordinator" ? (
          <div className="w-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {overviewDisplayItems.slice(0, 4).map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 min-h-[120px] w-[260px]"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${cardColors[index % cardColors.length]} shadow-lg`}>
                          {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      <h3 className="text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <Card className="shrink flex items-center justify-center dark:bg-slate-700">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-center justify-center p-10">
                {overviewDisplayItems.slice(0, 5).map((item, index) => (
                  <React.Fragment key={index}>
                    {item.dialogOptions ? (
                      <Card className="w-[260px] min-h-[120px]">
                        <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
                          <Icons.CardInfoIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <Dialog>
                          <DialogTrigger asChild>
                            <CardContent className="flex flex-col items-center justify-center cursor-pointer">
                              <div className={`p-2 rounded-xl ${cardColors[index % cardColors.length]} shadow-lg mb-2`}>
                                {item.icon && <item.icon className="h-7 w-7 text-white" />}
                              </div>
                              <span className="block w-full border border-black border-opacity-10 dark:border-white"></span>
                              <p className="text-base text-black dark:text-white mt-2 font-semibold">
                                {item.label}
                              </p>
                            </CardContent>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] text-black dark:text-white">
                            <DialogHeader>
                              <DialogTitle>Data Entry Options</DialogTitle>
                              <DialogDescription>
                                Choose a Data Entry option that you want to do
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              {item.dialogOptions.map(
                                (dialogOption, dialogIndex) => (
                                  <Card
                                    key={dialogIndex}
                                    className="w-[170px] h-[90px]"
                                  >
                                    <Link
                                      to={`/${userTypePath}${dialogOption.href}`}
                                    >
                                      <Button
                                        type="submit"
                                        variant={"default"}
                                        className="w-[168px] h-[88px] flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-black dark:text-white hover:ring-2 dark:hover:ring-white gap-2"
                                      >
                                        {dialogOption.icon && (
                                          <dialogOption.icon />
                                        )}
                                        {dialogOption.label}
                                      </Button>
                                    </Link>
                                  </Card>
                                ),
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </Card>
                    ) : (
                      <Card key={index} className="w-[260px] min-h-[120px]">
                        <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-2">
                          <Icons.CardInfoIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <Link to={`/${userTypePath}${item.href}`}>
                          <CardContent className="flex flex-col items-center justify-center">
                            <div className={`p-2 rounded-xl ${cardColors[index % cardColors.length]} shadow-lg mb-2`}>
                              {item.icon && <item.icon className="h-7 w-7 text-white" />}
                            </div>
                            <span className="block w-full border border-black border-opacity-10 dark:border-white"></span>
                            <p className="text-base text-black dark:text-white mt-2 font-semibold">
                              {item.label}
                            </p>
                          </CardContent>
                        </Link>
                      </Card>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
};

export default OverviewDisplay;