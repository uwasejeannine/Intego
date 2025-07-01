import React, { useState } from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  sidebarItemsForITAdmin,
  sidebarItemsForMandEOfficer,
  sidebarItemsForSeniorManagement,
} from "@/components/navigation/sub-components/sidebarItems";
import { UserType } from "@/types/types";
import { useAuthStore } from "@/stores/authStore";
import useMediaQuery from "@/hooks/useMediaQuery";

interface SidebarProps {
  user: UserType;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { userType } = useAuthStore();

  const sidebarItems = (() => {
    switch (user) {
      case "districtAdministrator":
        return sidebarItemsForSeniorManagement;
      case "sectorCoordinator":
        return sidebarItemsForMandEOfficer;
      case "admin":
        return sidebarItemsForITAdmin;
      default:
        return [];
    }
  })();

  const userTypePath = (() => {
    switch (userType) {
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

  const handleSubItemToggle = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((item) => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  return (
    <TooltipProvider>
      {!isMobile ? (
        <div className="fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-white dark:bg-slate-700 p-4 transition-all duration-300 shadow-md w-60">
          <div className="flex flex-col justify-between h-full">
            <nav>
              <ul>
                {sidebarItems.map((item, index) => (
                  <li key={index} className="mb-2">
                    <Button
                      variant="ghost"
                      className={`flex items-center px-2 py-1 w-full hover:bg-accent dark:hover:bg-blue-100 text-black dark:text-white dark:hover:text-gray-700 hover:text-primary cursor-pointer ${
                        index === 0 || !item.subItems
                          ? "justify-start items-center"
                          : ""
                      }`}
                      onClick={() => handleSubItemToggle(index)}
                    >
                      <span className="mr-2">
                        <item.icon className="w-5 h-5 dark:text-white dark:hover:text-gray-700 hover:text-primary" />
                      </span>
                      {item.subItems ? (
                        <span className=" ">{item.label}</span>
                      ) : (
                        <Link to={`/${userTypePath}${item.href}`}>
                          <span className=" ">{item.label}</span>
                        </Link>
                      )}
                      {item.subItems && (
                        <span className="ml-auto px-2 py-1 cursor-pointer text-gray-500">
                          {expandedItems.includes(index) ? (
                            <HiChevronDoubleLeft />
                          ) : (
                            <HiChevronDoubleRight />
                          )}
                        </span>
                      )}
                    </Button>
                    {item.subItems && expandedItems.includes(index) && (
                      <ul className="ml-6">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex} className="mb-1">
                            <Link to={`/${userTypePath}${subItem.href}`}>
                              <div className="flex items-center px-2 py-1 rounded-md hover:bg-accent dark:hover:bg-blue-100 text-black dark:text-white dark:hover:text-gray-700 hover:text-primary cursor-pointer">
                                <span className="mr-2">
                                  {
                                    <subItem.icon className="w-5 h-5 dark:text-white dark:hover:text-gray-700 hover:text-primary" />
                                  }
                                </span>
                                <span className="">{subItem.label}</span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-700 p-4 shadow-md z-[1]">
          <nav>
            <ul className="flex justify-around">
              {sidebarItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Popover>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex flex-col items-center justify-center p-2 hover:bg-accent dark:hover:bg-blue-100 text-black dark:text-white dark:hover:text-gray-700 hover:text-primary cursor-pointer"
                            onClick={() => handleSubItemToggle(index)}
                          >
                            <span className="mb-1">
                              <item.icon className="w-5 h-5 dark:text-white dark:hover:text-gray-700 hover:text-primary" />
                            </span>
                            <span className="text-sm">{item.label}</span>
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="start">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                    {item.subItems && (
                      <PopoverContent
                        side="top"
                        align="start"
                        className="flex flex-col"
                      >
                        <ul>
                          {item.subItems.map((subItem, subIndex) => (
                            <li key={subIndex} className="mb-2">
                              <Link to={`/${userTypePath}${subItem.href}`}>
                                <div className="flex items-center px-2 py-1 rounded-md hover:bg-accent dark:hover:bg-slate-600 text-black dark:text-white dark:hover:text-gray-300 hover:text-primary cursor-pointer">
                                  <span className="mr-2">
                                    {
                                      <subItem.icon className="w-5 h-5 dark:text-white dark:hover:text-gray-700 hover:text-primary" />
                                    }
                                  </span>
                                  <span>{subItem.label}</span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </PopoverContent>
                    )}
                  </Popover>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </TooltipProvider>
  );
};

export default Sidebar;