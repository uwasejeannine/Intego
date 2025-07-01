import React, { useState, useEffect } from "react";
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

type NavbarProps = {
  className?: string;
};

export function Navbar({ className = "", ...props }: NavbarProps) {
  const { logout, userId, userType } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/users/${userId}`,
        );
        setUser(response.data.user);
        setLoading(false);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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
                <div className="flex items-center cursor-pointer">
                  <Icons.NotificationIcon className="w-[24px] h-[24px] text-white" />
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
          {/* Remove dashboard icon/link for admin */}
          {/* <Link to={`${userPath}/overview`} replace>
            <li className="lg:mr-[30px]">
              <Icons.DashboardIcon className="w-[24px] h-[24px] text-white cursor-pointer " />
            </li>
          </Link> */}
          <li className="lg:mr-[30px] flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center cursor-pointer">
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {user?.profileImage ? (
                        <AvatarImage
                          src={`http://localhost:3000/uploads/${user.profileImage}`}
                          alt={`${user.first_name} ${user.last_name}`}
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                  <div
                    className={`${!isMobile ? "lg:block text-[#ffffff] ml-[5px]" : "hidden"}`}
                  >{`${user?.first_name} ${user?.last_name?.[0]}.`}</div>
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
                      {user?.profileImage ? (
                        <AvatarImage
                          src={`http://localhost:3000/uploads/${user.profileImage}`}
                          alt={`${user.first_name} ${user.last_name}`}
                        />
                      ) : (
                        <AvatarFallback>
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="font-bold">{`${user?.first_name} ${user?.last_name}`}</h2>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email?.toLowerCase()}
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

<Navbar />;