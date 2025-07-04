import { z } from "zod";
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addUser, fetchRoles } from "@/lib/api/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Step, Stepper, useStepper } from "@/components/stepper";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/types";
import { Input } from "@/components/ui/input";

// Updated schema to match backend changes
const updatedAddUserFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  sectorofOperations: z.enum(["Education", "Agriculture", "Health"], {
    required_error: "Please select a sector of operations",
  }),
  roleId: z.string().min(1, "Please select a role"),
});

type FormData = z.infer<typeof updatedAddUserFormSchema>;

const steps = [
  { label: "Step 1", description: "Personal Information" },
  { label: "Step 2", description: "Professional Information" },
];

function StepperFormActions({ onSubmit, isLoading }: { onSubmit: () => void; isLoading: boolean }) {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  return (
    <div className="w-full flex justify-end gap-2 py-4">
      {hasCompletedAllSteps ? (
        <Button 
          className="w-32" 
          onClick={resetSteps}
          style={{ backgroundColor: "#137775" }}
        >
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            variant="outline"
            className="w-32 border-[#137775] text-[#137775] hover:bg-[#137775] hover:text-white"
          >
            Prev
          </Button>
          <Button
            onClick={isLastStep ? onSubmit : nextStep}
            disabled={isLoading}
            className="w-32"
            style={{ backgroundColor: "#137775" }}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLastStep
              ? `${isLoading ? "Creating..." : "Create User"}`
              : isOptionalStep
                ? "Skip"
                : "Next"}
          </Button>
        </>
      )}
    </div>
  );
}

const CreateUserForm: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(updatedAddUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      gender: "",
      phoneNumber: "",
      sectorofOperations: undefined,
      roleId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchData();
  }, []);

  const handlePhoneChange = (value: string) => {
    form.setValue("phoneNumber", value);
  };

  const generateUsername = (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    }
    return "";
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await addUser({
        ...data,
        roleId: parseInt(data.roleId, 10),
      });
      form.reset();
      setIsLoading(false);
      toast({
        title: "User Created Successfully",
        description: "You have successfully created a new user!",
        icon: <Icons.CreateUserSuccess className="w-10 h-10 text-green-600" />,
      });
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.status === 409) {
        toast({
          title: "User Already Exists",
          description: "A user with the same username or email already exists.",
          icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
        });
      } else {
        toast({
          title: "User Creation Failed",
          description: "An unexpected error occurred. Please try again later.",
          icon: <Icons.CreateUserFailed className="w-10 h-10 text-red-600" />,
        });
      }
    }
  };

  return (
    <main
      className={`${
        !isMobile ? "pt-[100px] pl-[100px] ml-[10%] pr-2" : "w-full py-20 px-2"
      }`}
    >
      <Card className="flex justify-center items-center justify-items-center mb-5 dark:bg-slate-800">
        <CardHeader 
          className="font-bold text-lg"
          style={{ color: "#137775" }}
        >
          Add A New User
        </CardHeader>
      </Card>
      <Card className="dark:bg-slate-700">
        <CardContent className="mt-5">
          <Form {...form}>
            <div className="w-full grid lg:grid-cols-1 gap-2 p-2">
              <Stepper variant="circle-alt" initialStep={0} steps={steps}>
                {steps.map((stepProps, index) => {
                  if (index === 0) {
                    return (
                      <Step key={stepProps.label} {...stepProps}>
                        <div className="grid lg:grid-cols-2 items-center gap-6">
                          <div className="space-y-0.5">
                            <FormField
                              control={form.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel 
                                    htmlFor="first_name"
                                    style={{ color: "#137775" }}
                                  >
                                    First Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="first_name"
                                      placeholder="First Name"
                                      className="focus:border-[#137775] focus:ring-[#137775]"
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        const lastName =
                                          form.getValues("last_name");
                                        const username = generateUsername(
                                          e.target.value,
                                          lastName,
                                        );
                                        form.setValue("username", username);
                                      }}
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
                                  <FormLabel 
                                    htmlFor="last_name"
                                    style={{ color: "#137775" }}
                                  >
                                    Last Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="last_name"
                                      placeholder="Last Name"
                                      className="focus:border-[#137775] focus:ring-[#137775]"
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        const firstName =
                                          form.getValues("first_name");
                                        const username = generateUsername(
                                          firstName,
                                          e.target.value,
                                        );
                                        form.setValue("username", username);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel 
                                    htmlFor="username"
                                    style={{ color: "#137775" }}
                                  >
                                    Username
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="username"
                                      placeholder="Username"
                                      readOnly
                                      className="bg-gray-50 focus:border-[#137775]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="space-y-1">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel 
                                    htmlFor="email"
                                    style={{ color: "#137775" }}
                                  >
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id="email"
                                      placeholder="Email"
                                      type="email"
                                      className="focus:border-[#137775] focus:ring-[#137775]"
                                      {...field}
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
                                  <FormLabel 
                                    htmlFor="gender"
                                    style={{ color: "#137775" }}
                                  >
                                    Gender
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="focus:border-[#137775] focus:ring-[#137775]">
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel 
                                    htmlFor="phoneNumber"
                                    style={{ color: "#137775" }}
                                  >
                                    Phone Number
                                  </FormLabel>
                                  <FormControl>
                                    <PhoneInput
                                      id="phoneNumber"
                                      value={field.value}
                                      onChange={handlePhoneChange}
                                      defaultCountry="RW"
                                      className="w-full focus:border-[#137775] focus:ring-[#137775]"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <StepperFormActions
                          onSubmit={form.handleSubmit(onSubmit)}
                          isLoading={isLoading}
                        />
                      </Step>
                    );
                  } else {
                    return (
                      <Step key={stepProps.label} {...stepProps}>
                        <div className="grid lg:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="sectorofOperations"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel 
                                  htmlFor="sectorofOperations"
                                  style={{ color: "#137775" }}
                                >
                                  Sector of Operations
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="focus:border-[#137775] focus:ring-[#137775]">
                                      <SelectValue placeholder="Select sector" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Education">
                                      <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                        Education
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Agriculture">
                                      <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                        Agriculture
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="Health">
                                      <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                        Health
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="roleId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel 
                                  htmlFor="roleId"
                                  style={{ color: "#137775" }}
                                >
                                  Role
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="focus:border-[#137775] focus:ring-[#137775]">
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {roles.map((role) => (
                                      <SelectItem
                                        key={role.id}
                                        value={role.id.toString()}
                                      >
                                        {role.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <StepperFormActions
                          onSubmit={form.handleSubmit(onSubmit)}
                          isLoading={isLoading}
                        />
                      </Step>
                    );
                  }
                })}
              </Stepper>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateUserForm;