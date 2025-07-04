import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "@/types/types";
import { Card, CardHeader } from "@/components/ui/card";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CheckCircle, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfileFormSchema } from "@/lib/validation/schema";
import { useToast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof updateProfileFormSchema>;

type E164Number = string;

const UpdateUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, setUser] = useState<User | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<E164Number>("");
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [, setFullName] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: "",
      phoneNumber: "",
      agencyName: "",
      sectorofOperations: "",
      position: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/users/${id}`
        );
        setUser(response.data.user);
        form.reset(response.data.user);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const { first_name, last_name } = form.getValues();
    setFullName(`${first_name} ${last_name}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("first_name"), form.watch("last_name")]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/users/users/${id}`, data);
      toast({
        title: "User Updated",
        description: "The user has been updated successfully.",
        icon: <CheckCircle className="w-10 h-10 text-green-600" />,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        icon: <AlertCircle className="w-10 h-10 text-red-600" />,
      });
    }
  };

  return (
    <main
      className={`${
        !isMobile ? "pt-[100px] pl-[300px] pr-[100px]" : "w-full px-4 py-20"
      } min-h-screen flex flex-col items-center`}
    >
      <div className="w-full max-w-6xl">
        <Card className="flex justify-center items-center justify-items-center mb-8 dark:bg-slate-700">
          <CardHeader className="font-bold text-xl">User Details</CardHeader>
        </Card>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="First Name" 
                        {...field} 
                        className="border-gray-300 focus:border-[#137775] text-black placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Last Name" 
                        {...field} 
                        className="border-gray-300 focus:border-[#137775] text-black placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Gender</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full border-gray-300 focus:border-[#137775] text-black">
                          <SelectValue placeholder="Select gender" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Male" className="text-black hover:bg-[#137775] hover:text-white">Male</SelectItem>
                          <SelectItem value="Female" className="text-black hover:bg-[#137775] hover:text-white">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value || phoneNumber}
                        defaultCountry="RW"
                        placeholder="+25078..."
                        onChange={(value) => {
                          field.onChange(value);
                          setPhoneNumber(value);
                        }}
                        onBlur={field.onBlur}
                        className="border-gray-300 focus:border-[#137775] text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agencyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Agency Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Agency Name" 
                        {...field} 
                        className="border-gray-300 focus:border-[#137775] text-black placeholder:text-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sectorofOperations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Sector of Operations</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="border-gray-300 focus:border-[#137775] text-black">
                          <SelectValue placeholder="Select a sector" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Agriculture" className="text-black hover:bg-[#137775] hover:text-white">Agriculture</SelectItem>
                          <SelectItem value="Health" className="text-black hover:bg-[#137775] hover:text-white">Health</SelectItem>
                          <SelectItem value="Education" className="text-black hover:bg-[#137775] hover:text-white">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#137775] font-semibold">Position</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="border-gray-300 focus:border-[#137775] text-black">
                          <SelectValue placeholder="Select a position" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="sectorCoordinator" className="text-black hover:bg-[#137775] hover:text-white">Sector Coordinator</SelectItem>
                          <SelectItem value="admin" className="text-black hover:bg-[#137775] hover:text-white">Admin</SelectItem>
                          <SelectItem value="districtAdministrator" className="text-black hover:bg-[#137775] hover:text-white">District Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="lg:col-span-2 bg-[#137775] hover:bg-[#0f5f5d] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200"
              >
                Update User
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default UpdateUserForm;