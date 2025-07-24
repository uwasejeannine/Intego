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

// Rwanda Districts data
const RWANDA_DISTRICTS = [
  "Bugesera", "Burera", "Gakenke", "Gasabo", "Gatsibo", "Gicumbi", "Gisagara",
   "Huye", "Kamonyi", "Karongi", "Kayonza", "Kicukiro", "Kirehe", "Muhanga",
  "Musanze", "Ngoma", "Ngororero", "Nyabihu", "Nyagatare", "Nyamagabe",
  "Nyamasheke", "Nyanza", "Nyarugenge", "Nyaruguru", "Rubavu", "Ruhango",
  "Rulindo", "Rusizi", "Rutsiro", "Rwamagana"
];

// Sectors for each district (adding more sectors for better functionality)
const DISTRICT_SECTORS: Record<string, string[]> = {
  "Bugesera": ["Gashora", "Juru", "Kamabuye", "Mareba", "Mayange", "Musenyi", "Mwogo", "Ngeruka", "Ntarama", "Nyamata", "Nyarugenge", "Rilima", "Ruhuha", "Rweru", "Shyara"],
  "Burera": ["Bunge", "Butaro", "Cyanika", "Cyeru", "Gahunga", "Gatebe", "Gitovu", "Kagogo", "Kinoni", "Kinyababa", "Kivuye", "Nemba", "Rugarama", "Rugendabari", "Ruhunde", "Rusarabuye", "Rwerere"],
  "Gakenke": ["Busengo", "Cyabingo", "Gakenke", "Gashenyi", "Mugunga", "Janja", "Kamubuga", "Karambo", "Kivuruga", "Mataba", "Minazi", "Muhondo", "Muyongwe", "Nemba", "Ruli", "Rusasa", "Rushashi"],
  "Gasabo": ["Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", "Kimihurura", "Kimisagara", "Kinyinya", "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga"],
  "Gatsibo": ["Gasange", "Gatsibo", "Gitoki", "Kabarore", "Kageyo", "Kiramuruzi", "Kiziguro", "Muhura", "Murambi", "Ngarama", "Nyagihanga", "Remera", "Rugarama", "Rwimbogo"],
  "Gicumbi": ["Bukure", "Bwisige", "Byumba", "Cyumba", "Gicumbi", "Kaniga", "Manyagiro", "Miyove", "Mutete", "Nyamiyaga", "Nyankenke", "Rubaya", "Rukomo", "Rushaki", "Rutare", "Ruvune", "Rwamiko", "Shangasha"],
  "Gisagara": ["Gikonko", "Gishubi", "Kansi", "Kibirizi", "Kigembe", "Muganza", "Mukindo", "Ndora", "Nyanza", "Save"],
  "Huye": ["Gishamvu", "Karama", "Kigoma", "Kinazi", "Maraba", "Mbazi", "Mukura", "Ngoma", "Ruhashya", "Rusatira", "Rwaniro", "Simbi", "Tumba", "Yanze"],
  "Kamonyi": ["Gacurabwenge", "Karama", "Kayenzi", "Kayumbu", "Mugina", "Musambira", "Nyamiyaga", "Nyarubaka", "Rugalika", "Rukoma", "Runda", "Ruzo"],
  "Karongi": ["Bwishyura", "Gashari", "Gishyita", "Gitesi", "Murambi", "Mutuntu", "Rugabano", "Ruganda", "Rutsiro", "Rwankuba"],
  "Kayonza": ["Gahini", "Kabare", "Kabarondo", "Mukarange", "Murama", "Murundi", "Mwiri", "Ndego", "Nyamirama", "Rukara", "Ruramira", "Rwinkwavu"],
  "Kicukiro": ["Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", "Kigarama", "Masaka", "Niboye", "Nyarugunga"],
  "Kirehe": ["Gatore", "Kigarama", "Kigina", "Kirehe", "Mahama", "Mpanga", "Musaza", "Mushikiri", "Nasho", "Nyamugari", "Nyarubuye"],
  "Muhanga": ["Cyeza", "Kabacuzi", "Kibangu", "Kiyumba", "Muhanga", "Mukura", "Mushishiro", "Nyabinoni", "Nyamabuye", "Nyamiyaga", "Rongi", "Rugendabari"],
  "Musanze": ["Busogo", "Cyuve", "Gacaca", "Gashaki", "Gataraga", "Kimonyi", "Kinigi", "Muhoza", "Muko", "Musanze", "Nkotsi", "Nyange", "Remera", "Rwaza", "Shingiro"],
  "Ngoma": ["Gashanda", "Jarama", "Karembo", "Kazo", "Kibungo", "Mugesera", "Murama", "Mutenderi", "Remera", "Rukira", "Rukumberi", "Sake", "Zaza"],
  "Ngororero": ["Bwira", "Gatumba", "Hindiro", "Kabaya", "Kageyo", "Kavumu", "Matyazo", "Muhanda", "Muhororo", "Ndaro", "Ngororero", "Nyange", "Sovu"],
  "Nyabihu": ["Bigogwe", "Jenda", "Jomba", "Kabatwa", "Karago", "Kintobo", "Mukamira", "Muringa", "Rambura", "Rurembo", "Shyira"],
  "Nyagatare": ["Gatunda", "Karama", "Karangazi", "Katabagemu", "Kiyombe", "Matimba", "Mimuli", "Mukama", "Musheri", "Nyagatare", "Rukomo", "Rwempasha", "Rwimiyaga", "Tabagwe"],
  "Nyamagabe": ["Buruhukiro", "Cyanika", "Gasaka", "Gatare", "Kaduha", "Kamegeri", "Kibirizi", "Kibumbwe", "Kitabi", "Mbazi", "Mugano", "Mushubi", "Musange", "Nkomane", "Tare", "Uwinkingi"],
  "Nyamasheke": ["Bushekeri", "Bushenge", "Cyato", "Gihombo", "Kagano", "Kanjongo", "Karambi", "Karengera", "Kirimbi", "Macuba", "Mahembe", "Nyabitekeri", "Rangiro", "Ruharambuga", "Shangi"],
  "Nyanza": ["Busasamana", "Busoro", "Cyabakamyi", "Kibirizi", "Kigoma", "Mukingo", "Muyira", "Ntyazo", "Nyagisozi", "Rwabicuma"],
  "Nyarugenge": ["Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere", "Muhima", "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"],
  "Nyaruguru": ["Cyahinda", "Busanze", "Kibeho", "Kivu", "Mata", "Muganza", "Munini", "Ngera", "Ngoma", "Nyabimata", "Nyagisozi", "Ruheru", "Rusenge", "Rwabicuma"],
  "Rubavu": ["Bugeshi", "Busasamana", "Cyanzarwe", "Gisenyi", "Kageyo", "Kanama", "Mudende", "Nyakiliba", "Nyamyumba", "Nyundo", "Rubavu", "Rugerero"],
  "Ruhango": ["Bweramana", "Byimana", "Kabagari", "Kinazi", "Kinihira", "Muhanga", "Mwendo", "Ntongwe", "Ruhango"],
  "Rulindo": ["Base", "Burega", "Bushoki", "Cyinzuzi", "Cyungo", "Kinihira", "Kisaro", "Masoro", "Mbogo", "Murambi", "Ngoma", "Ntarabana", "Rukozo", "Rusiga", "Shyorongi", "Tumba"],
  "Rusizi": ["Bugarama", "Butare", "Buziba", "Gashonga", "Gikundamvura", "Giteranyi", "Kamembe", "Muganza", "Mururu", "Nkanka", "Nkombo", "Nyakabuye", "Nyakarenzo", "Ruganda", "Ruhwa", "Rwimbogo"],
  "Rutsiro": ["Boneza", "Gihango", "Kigeyo", "Kivumu", "Manihira", "Mukura", "Musasa", "Mushonyi", "Mushubati", "Nyabirasi", "Ruhango", "Rusebeya"],
  "Rwamagana": ["Gahengeri", "Gishari", "Karenge", "Kigabiro", "Muhazi", "Munyaga", "Munyiginya", "Musha", "Muyumbu", "Mwulire", "Nyakaliro", "Nzige", "Rubona", "Rurenge"]
};
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
  district: z.string().optional(),
  sector: z.string().optional(),
}).refine((data) => {
  const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
  const selectedRole = roles.find((r: any) => r.id.toString() === data.roleId);
  
  if (selectedRole) {
    const roleName = selectedRole.name.toLowerCase();
    
    // District Administrator must select a district
    if (roleName === 'districtadministrator') {
      return data.district && data.district.length > 0;
    }
    
    // Sector Coordinator must select both district and sector
    if (roleName === 'sectorcoordinator') {
      return data.district && data.district.length > 0 && data.sector && data.sector.length > 0;
    }
  }
  
  return true;
}, {
  message: "Please select the required location fields for this role",
  path: ["district"]
});

type FormData = z.infer<typeof updatedAddUserFormSchema>;

const steps = [
  { label: "Step 1", description: "Personal Information" },
  { label: "Step 2", description: "Professional Information & Location" },
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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);

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
      district: "",
      sector: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
        // Store roles in sessionStorage for validation
        sessionStorage.setItem('roles', JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchData();
  }, []);

  // Watch for role changes
  const watchedRoleId = form.watch("roleId");
  useEffect(() => {
    if (watchedRoleId) {
      const role = roles.find(r => r.id.toString() === watchedRoleId);
      setSelectedRole(role || null);
      // Reset location fields when role changes
      form.setValue("district", "");
      form.setValue("sector", "");
      setSelectedDistrict("");
      setAvailableSectors([]);
    }
  }, [watchedRoleId, roles, form]);

  // Watch for district changes
  const watchedDistrict = form.watch("district");
  useEffect(() => {
    if (watchedDistrict) {
      setSelectedDistrict(watchedDistrict);
      const sectors = DISTRICT_SECTORS[watchedDistrict] || [];
      setAvailableSectors(sectors);
      // Reset sector when district changes
      form.setValue("sector", "");
    }
  }, [watchedDistrict, form]);

  const handlePhoneChange = (value: string) => {
    form.setValue("phoneNumber", value);
  };

  const generateUsername = (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      return `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    }
    return "";
  };

  // Helper functions
  const isDistrictAdmin = () => {
    if (!selectedRole) return false;
    return selectedRole.name.toLowerCase() === 'districtadministrator';
  };

  const isSectorCoordinator = () => {
    if (!selectedRole) return false;
    return selectedRole.name.toLowerCase() === 'sectorcoordinator';
  };

  // Render location fields based on role
  const renderLocationFields = () => {
    if (!selectedRole) return null;

    if (isDistrictAdmin() || isSectorCoordinator()) {
      return (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {(isDistrictAdmin() || isSectorCoordinator()) && (
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    htmlFor="district"
                    style={{ color: "#137775" }}
                  >
                    District *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:border-[#137775] focus:ring-[#137775]">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RWANDA_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isSectorCoordinator() && (
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel 
                    htmlFor="sector"
                    style={{ color: "#137775" }}
                  >
                    Sector *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedDistrict}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:border-[#137775] focus:ring-[#137775]">
                        <SelectValue 
                          placeholder={
                            selectedDistrict 
                              ? "Select sector" 
                              : "Select district first"
                          } 
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      );
    }

    return null;
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Prepare submission data with proper field names
      const submitData = {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        phoneNumber: data.phoneNumber,
        sectorofOperations: data.sectorofOperations,
        roleId: parseInt(data.roleId, 10),
        // Send district and sector names (not IDs) and ensure they're not null
        district: data.district || null,
        sector: data.sector || null,
      };

      console.log('Submitting user data:', submitData);
      
      // Validate that required location fields are present based on role
      if (selectedRole) {
        const roleName = selectedRole.name.toLowerCase();
        
        if (roleName === 'districtadministrator' && !submitData.district) {
          throw new Error('District is required for District Administrator role');
        }
        
        if (roleName === 'sectorcoordinator' && (!submitData.district || !submitData.sector)) {
          throw new Error('Both district and sector are required for Sector Coordinator role');
        }
      }

      await addUser(submitData);
      
      // Reset form and state
      form.reset();
      setSelectedRole(null);
      setSelectedDistrict("");
      setAvailableSectors([]);
      
      toast({
        title: "User Created Successfully",
        description: "You have successfully created a new user!",
        icon: <Icons.CreateUserSuccess className="w-10 h-10 text-green-600" />,
      });
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      if (error.response && error.response.status === 409) {
        toast({
          title: "User Already Exists",
          description: "A user with the same username or email already exists.",
          icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
        });
      } else if (error.message && error.message.includes('required')) {
        toast({
          title: "Missing Required Fields",
          description: error.message,
          icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
        });
      } else {
        toast({
          title: "User Creation Failed",
          description: "An unexpected error occurred. Please try again later.",
          icon: <Icons.CreateUserFailed className="w-10 h-10 text-red-600" />,
        });
      }
    } finally {
      setIsLoading(false);
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
                    // Step 2: Professional Information & Location
                    return (
                      <Step key={stepProps.label} {...stepProps}>
                        <div className="space-y-6">
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
                          
                          {/* Location Assignment Section */}
                          {renderLocationFields()}
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