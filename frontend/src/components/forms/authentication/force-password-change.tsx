import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { changePasswordFormSchema } from "@/lib/validation/schema";
import { useAuthStore } from "@/stores/authStore";
import { changePassword } from "@/lib/api/api";
import { useNavigate } from "react-router-dom";

type FormData = z.infer<typeof changePasswordFormSchema>;

export function ForceChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { userEmail, userType } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      await changePassword(userEmail as string, data.newPassword);
      setIsLoading(false);
      toast({
        title: "Password Changed Successfully",
        description: "You will be redirected to the dashboard.",
        icon: <Icons.LoginSuccessIcon className="w-10 h-10 text-green-900" />,
      });
      let userPath = "";
      switch (userType) {
        case "sectorCoordinator":
          userPath = "/sector-coordinator/dashboard";
          break;
        case "districtAdministrator":
          userPath = "/district-admin/dashboard";
          break;
        case "admin":
          userPath = "/admin/dashboard";
          break;
        default:
          userPath = "/auth/login";
          break;
      }
      navigate(userPath);
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-1 p-1">
          <Label htmlFor="newPassword">New Password</Label>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="newPassword"
                    type="password"
                    {...field}
                    disabled={isLoading}
                    placeholder="Enter new password"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.newPassword?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-1 p-1">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...field}
                    disabled={isLoading}
                    placeholder="Confirm new password"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.confirmPassword?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="hover:opacity-70 w-full mt-4"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Change Password
        </Button>
      </form>
    </Form>
  );
}
