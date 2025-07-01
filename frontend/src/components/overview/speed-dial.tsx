import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  overviewItemsForITAdmin,
  overviewItemsForSeniorManagement,
  overviewItemsForProjectManager,
  overviewItemsForMandEOfficer,
} from "./sub-components/overviewItems";
import { UserType } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";

interface SpeedDialProps {
  user: UserType;
  userTypePath: string;
}

const SpeedDial: React.FC<SpeedDialProps> = ({ user, userTypePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const overviewDisplayItems = (() => {
    switch (user) {
      case "seniorManagement":
        return overviewItemsForSeniorManagement;
      case "MandEOfficer":
        return overviewItemsForMandEOfficer;
      case "projectManager":
        return overviewItemsForProjectManager;
      case "ITAdmin":
        return overviewItemsForITAdmin;
      default:
        return [];
    }
  })();

  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-end justify-end">
            <motion.div
              className="flex flex-col items-center space-y-4 mr-20"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {overviewDisplayItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.dialogOptions ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex flex-col items-center">
                          <Button
                            variant="ghost"
                            className="bg-blue-500 text-white rounded-full p-3 shadow-md hover:bg-blue-600 transition-colors duration-200"
                          >
                            {item.icon && <item.icon className="w-6 h-6" />}
                          </Button>
                          <span className="text-sm mt-1">{item.label}</span>
                        </div>
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
                              <Link
                                key={dialogIndex}
                                to={`/${userTypePath}${dialogOption.href}`}
                              >
                                <Button
                                  type="submit"
                                  variant={"default"}
                                  className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-black dark:text-white hover:ring-2 dark:hover:ring-white gap-2"
                                >
                                  {dialogOption.icon && <dialogOption.icon />}
                                  {dialogOption.label}
                                </Button>
                              </Link>
                            ),
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Link to={`/${userTypePath}${item.href}`}>
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          className="bg-blue-500 text-white rounded-full p-3 shadow-md hover:bg-blue-600 transition-colors duration-200"
                        >
                          {item.icon && <item.icon className="w-6 h-6" />}
                        </Button>
                        <span className="text-sm mt-1">{item.label}</span>
                      </div>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.button
        className={`bg-blue-500 text-white rounded-full p-3 shadow-md ${
          isOpen ? "rotate-45" : ""
        }`}
        onClick={toggleSpeedDial}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <HiPlus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default SpeedDial;
