import { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/assets/logo.svg";
import { NotificatonsDropDown } from "../notifications";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "react-router-dom";
import { User } from "@/types/types";
import { fetchFeedbackForUser } from "@/lib/api/api";

type NavbarProps = {
  className?: string;
};

export function Navbar({ className = "", ...props }: NavbarProps) {
  const { 
    logout, 
    userId, 
    userType,
    first_name,
    last_name,
    userEmail,
    profileImage,
    username
  } = useAuthStore();
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [feedbackCount, setFeedbackCount] = useState(0);

  // Get user initials for avatar
  const getInitials = () => {
    if (first_name && last_name) {
      return `${first_name[0]}${last_name[0]}`;
    }
    if (username) {
      return username.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  // Get display name
  const getDisplayName = () => {
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }
    if (username) {
      return username;
    }
    return "User";
  };

  // Get short display name for navbar
  const getShortDisplayName = () => {
    if (first_name && last_name) {
      return `${first_name} ${last_name[0]}.`;
    }
    if (username) {
      return username;
    }
    return "User";
  };

  useEffect(() => {
    if ((userType !== "sectorCoordinator" && userType !== "districtAdministrator") || !userId) return;
    fetchFeedbackForUser(Number(userId)).then(fbs => setFeedbackCount(fbs.length));
  }, [userId, userType]);

  const handleLogout = () => {
    logout();
  };

  let userPath = "";
  switch (userType) {
    case "admin":
      userPath = "/admin";
      break;
    case "sectorCoordinator":
      userPath = "/sector-coordinator";
      break;
    case "districtAdministrator":
      userPath = "/district-admin";
      break;
    default:
      break;
  }

  return (
    <header
      className={cn(
        "fixed top-[0] w-full bg-[#137775] flex items-center justify-between px-[20px] py-[10px] dark:bg-slate-700 z-10000",
        className,
      )}
      {...props}
    >
      <a className="logo-container flex items-center cursor-pointer">
        <img src={Logo} alt="logo" className="w-[40px] h-[40px]" />
        <span className="text-white ml-[10px] font-extrabold">
          INTEGO360
        </span>
      </a>
      <nav>
        <ul
          className={`${!isMobile ? "m-0" : "space-x-2"} list-none flex items-center`}
        >
          <li className="hidden lg:block lg:mr-[30px]">
            <Icons.HelpIcon className="w-[24px] h-[24px] text-white cursor-pointer" />
          </li>
          <li className="lg:mr-[30px] flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer relative">
                  <Icons.NotificationIcon className="w-[24px] h-[24px] text-white" />
                  {(userType === "sectorCoordinator" || userType === "districtAdministrator") && feedbackCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                      {feedbackCount}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[330px]" align="end" forceMount>
                <DropdownMenuGroup>
                  <NotificatonsDropDown />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-end justify-end">
                    <Button variant="ghost" className="">
                      Clear
                    </Button>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li className="lg:mr-[30px] flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {profileImage ? (
                        <AvatarImage
                          src={`http://localhost:3000/uploads/${profileImage}`}
                          alt={getDisplayName()}
                        />
                      ) : (
                        <AvatarFallback>
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                  <div
                    className={`${!isMobile ? "lg:block text-[#ffffff] ml-[5px]" : "hidden"}`}
                  >
                    {getShortDisplayName()}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56"
                align={`${!isMobile ? "end" : "center"}`}
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Avatar className="w-[70px] h-[70px]">
                      {profileImage ? (
                        <AvatarImage
                          src={`http://localhost:3000/uploads/${profileImage}`}
                          alt={getDisplayName()}
                        />
                      ) : (
                        <AvatarFallback>
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="font-bold">{getDisplayName()}</h2>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail?.toLowerCase() || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to={`${userPath}/update-profile`} className="" replace>
                    <DropdownMenuItem>
                      <Icons.UserIcon className="mr-2 h-4 w-4 text-primary" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Icons.SettingsIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <Icons.LogoutIcon className="mr-2 h-4 w-4 text-primary" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;