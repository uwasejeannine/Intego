import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileFormSchema } from "@/lib/validation/schema";
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
import { api } from "@/lib/api/api";
import { useToast } from "@/components/ui/use-toast";

interface UpdateUserProps {}

type UserUpdate = Partial<User>;

const UpdateUser: React.FC<UpdateUserProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isContactEditable, setIsContactEditable] = useState<boolean>(false);
  const [isPersonalEditable, setIsPersonalEditable] = useState<boolean>(false);
  const [isCompanyEditable, setIsCompanyEditable] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { userId } = useAuthStore();
  const [fullName, setFullName] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileFormSchema),
  });

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
        const response = await api.get(`/users/${userId}`);
        const userData = response.data.user;
        setUser(userData);
        setFullName(`${userData.first_name} ${userData.last_name}`);

        // Set form values
        setValue('first_name', userData.first_name);
        setValue('last_name', userData.last_name);
        setValue('gender', userData.gender);
        setValue('phoneNumber', userData.phoneNumber);
        setValue('agencyName', userData.agencyName);
        setValue('sectorofOperations', userData.sectorofOperations);
        setValue('position', userData.position);

        setLoading(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to fetch user data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, setValue, toast]);

  const handleContactUpdate = async (data: any) => {
    try {
      await api.put(`/users/${user?.id}`, {
        phoneNumber: data.phoneNumber,
      });
      setIsContactEditable(false);
      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update contact information",
        variant: "destructive",
      });
    }
  };

  const handlePersonalUpdate = async (data: any) => {
    try {
      await api.put(`/users/${user?.id}`, {
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
      });
      setIsPersonalEditable(false);
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update personal information",
        variant: "destructive",
      });
    }
  };

  const handleCompanyUpdate = async (data: any) => {
    try {
      await api.put(`/users/${user?.id}`, {
        agencyName: data.agencyName,
        sectorofOperations: data.sectorofOperations,
        position: data.position,
      });
      setIsCompanyEditable(false);
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update company information",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Icons.spinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
                    {user?.profileImage ? (
                      <AvatarImage src={`http://localhost:3000/uploads/${user.profileImage}`} alt={fullName} />
                    ) : (
                      <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </DialogTrigger>
              <DialogContent className="dark:bg-slate-700">
                <DialogHeader>
                  <DialogTitle>Update Profile Image</DialogTitle>
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
                  <form onSubmit={handleSubmit(handleContactUpdate)}>
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="tel"
                          {...register("phoneNumber")}
                          placeholder="Phone Number"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-sm">{`${errors.phoneNumber.message}`}</p>
                        )}
                      </div>
                      <Button type="submit">Update</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>Email Address: {user?.email}</p>
                    <p>Phone Number: {user?.phoneNumber}</p>
                  </>
                )}
              </CardContent>
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
                  <form onSubmit={handleSubmit(handlePersonalUpdate)}>
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          {...register("first_name")}
                          placeholder="First Name"
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-sm">{`${errors.first_name.message}`}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="text"
                          {...register("last_name")}
                          placeholder="Last Name"
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-sm">{`${errors.last_name.message}`}</p>
                        )}
                      </div>
                      <div>
                        <Select
                          onValueChange={(value) => setValue("gender", value)}
                          defaultValue={user?.gender}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm">{`${errors.gender.message}`}</p>
                        )}
                      </div>
                      <Button type="submit">Update</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>First Name: {user?.first_name}</p>
                    <p>Last Name: {user?.last_name}</p>
                    <p>Gender: {user?.gender}</p>
                  </>
                )}
              </CardContent>
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
                  <form onSubmit={handleSubmit(handleCompanyUpdate)}>
                    <div className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          {...register("agencyName")}
                          placeholder="Agency Name"
                        />
                        {errors.agencyName && (
                          <p className="text-red-500 text-sm">{`${errors.agencyName.message}`}</p>
                        )}
                      </div>
                      <div>
                        <Select
                          onValueChange={(value) => setValue("sectorofOperations", value)}
                          defaultValue={user?.sectorofOperations}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Sector of Operations" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                            <SelectItem value="Health">Health</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.sectorofOperations && (
                          <p className="text-red-500 text-sm">{`${errors.sectorofOperations.message}`}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="text"
                          {...register("position")}
                          placeholder="Position"
                        />
                        {errors.position && (
                          <p className="text-red-500 text-sm">{`${errors.position.message}`}</p>
                        )}
                      </div>
                      <Button type="submit">Update</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p>Agency Name: {user?.agencyName}</p>
                    <p>Sector of Operations: {user?.sectorofOperations}</p>
                    <p>Position: {user?.position}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default UpdateUser;