import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/upload";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UpdateUserProps {}

type UserUpdate = Partial<User>;

const UpdateUser: React.FC<UpdateUserProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [isContactEditable, setIsContactEditable] = useState<boolean>(false);
  const [isPersonalEditable, setIsPersonalEditable] = useState<boolean>(false);
  const [isCompanyEditable, setIsCompanyEditable] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { userId } = useAuthStore();
  const [fullName, setFullName] = useState<string>("");

  const toggleContactEdit = () => {
    setIsContactEditable(!isContactEditable);
  };

  const togglePersonalEdit = () => {
    setIsPersonalEditable(!isPersonalEditable);
  };

  const toggleCompanyEdit = () => {
    setIsCompanyEditable(!isCompanyEditable);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/users/${userId}`
        );
        setUser(response.data.user);
        setFullName(`${response.data.user.first_name} ${response.data.user.last_name}`);
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

  const handleContactUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/v1/users/users/${user?.id}`, {
        email: user?.email,
        phoneNumber: user?.phoneNumber,
      });
      setIsContactEditable(false);
      // Show success toast
    } catch (error: any) {
      // Show error toast
    }
  };

  const handlePersonalUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/v1/users/users/${user?.id}`, {
        first_name: user?.first_name,
        last_name: user?.last_name,
        gender: user?.gender,
      });
      setIsPersonalEditable(false);
      // Show success toast
    } catch (error: any) {
      // Show error toast
    }
  };

  const handleCompanyUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/v1/users/users/${user?.id}`, {
        agencyName: user?.agencyName,
        sectorofOperations: user?.sectorofOperations,
      });
      setIsCompanyEditable(false);
      // Show success toast
    } catch (error: any) {
      // Show error toast
    }
  };

  // Helper for type-safe setUser
  const updateUser = (update: UserUpdate) => {
    setUser((prev) => (prev ? { ...prev, ...update } : prev));
  };

  return (
    <main
      className={`${
        !isMobile ? "pt-[100px] pl-[100px] ml-[10%] pr-2" : "w-full px-2 py-20"
      }`}
    >
      <Card className="flex justify-center items-center justify-items-center mb-5 dark:bg-slate-700">
        <CardHeader className="font-bold">User Details</CardHeader>
      </Card>
      <Card className="dark:bg-slate-700">
        <CardContent className="grid grid-cols-1">
          <div className="flex flex-col items-center justify-center">
            <Dialog>
              <DialogTrigger>
                <div className="flex flex-col items-center justify-center mt-5">
                  <Avatar className="w-[140px] h-[140px]">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>SO</AvatarFallback>
                  </Avatar>
                </div>
              </DialogTrigger>
              <DialogContent className="dark:bg-slate-700">
                <DialogHeader>
                  <DialogTitle>Update   Profile Image</DialogTitle>
                  <DialogDescription>
                    <ImageUpload />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button type="submit">Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <h2 className="font-bold">{fullName}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Card className="dark:bg-slate-700 mb-4">
              <CardHeader className="flex flex-row justify-between">
                <h1 className="font-bold">Contact Information</h1>
                {isContactEditable ? (
                  <X
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={toggleContactEdit}
                  />
                ) : (
                  <Icons.EditIcon
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={toggleContactEdit}
                  />
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                {isContactEditable ? (
                  <>
                    <Input
                      type="email"
                      value={user?.email || ""}
                      onChange={(e) =>
                        updateUser({ email: e.target.value })
                      }
                      readOnly={!isContactEditable}
                    />
                    <Input
                      type="tel"
                      value={user?.phoneNumber || ""}
                      onChange={(e) =>
                        updateUser({ phoneNumber: e.target.value })
                      }
                      readOnly={!isContactEditable}
                    />
                  </>
                ) : (
                  <>
                    <p>Email Address: {user?.email}</p>
                    <p>Phone Number: {user?.phoneNumber}</p>
                  </>
                )}
              </CardContent>
              {isContactEditable && (
                <CardFooter className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleContactUpdate}
                  >
                    Update
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="dark:bg-slate-700 mb-4">
              <CardHeader className="flex flex-row justify-between">
                <h1 className="font-bold">Personal Information</h1>
                {isPersonalEditable ? (
                  <X
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={togglePersonalEdit}
                  />
                ) : (
                  <Icons.EditIcon
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={togglePersonalEdit}
                  />
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                {isPersonalEditable ? (
                  <>
                    <Input
                      type="text"
                      value={user?.first_name || ""}
                      onChange={(e) =>
                        updateUser({ first_name: e.target.value })
                      }
                      readOnly={!isPersonalEditable}
                    />
                    <Input
                      type="text"
                      value={user?.last_name || ""}
                      onChange={(e) =>
                        updateUser({ last_name: e.target.value })
                      }
                      readOnly={!isPersonalEditable}
                    />
                    <Select
                      value={user?.gender || ""}
                      onValueChange={(value) =>
                        updateUser({ gender: value })
                      }
                      disabled={!isPersonalEditable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <p>First Name: {user?.first_name}</p>
                    <p>Last Name: {user?.last_name}</p>
                    <p>Gender: {user?.gender}</p>
                  </>
                )}
              </CardContent>
              {isPersonalEditable && (
                <CardFooter>
                  <Button
                    type="button"
                    onClick={handlePersonalUpdate}
                  >
                    Update
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="dark:bg-slate-700 mb-4">
              <CardHeader className="flex flex-row justify-between">
                <h1 className="font-bold">Company Information</h1>
                {isCompanyEditable ? (
                  <X
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={toggleCompanyEdit}
                  />
                ) : (
                  <Icons.EditIcon
                    className="w-5 h-5 cursor-pointer text-primary"
                    onClick={toggleCompanyEdit}
                  />
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-2">
                {isCompanyEditable ? (
                  <>
                    <Input
                      type="text"
                      value={user?.agencyName || ""}
                      onChange={(e) =>
                        updateUser({ agencyName: e.target.value })
                      }
                      readOnly={!isCompanyEditable}
                    />
                    <Input
                      type="text"
                      value={user?.sectorofOperations || ""}
                      onChange={(e) =>
                        updateUser({ sectorofOperations: e.target.value })
                      }
                      readOnly={!isCompanyEditable}
                    />
                  </>
                ) : (
                  <>
                    <p>Agency Name: {user?.agencyName}</p>
                    <p>Sector of Operations: {user?.sectorofOperations}</p>
                  </>
                )}
              </CardContent>
              {isCompanyEditable && (
                <CardFooter>
                  <Button
                    type="button"
                    onClick={handleCompanyUpdate}
                  >
                    Update
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default UpdateUser;