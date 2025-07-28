import React, { useState } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { loginFormSchema } from "@/lib/validation/schema";

import { useAuthStore } from "@/stores/authStore";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onForgotPasswordClick: () => void;
}

// Define the type for form data
type FormData = z.infer<typeof loginFormSchema>;

// Component for user authentication form
export function UserAuthForm({ onForgotPasswordClick }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Hook for displaying toast messages
  const { toast } = useToast();

  // Hook for managing form state and validation
  const form = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const { resetPassword } = await login(data.email, data.password);
      setIsLoading(false);

      if (resetPassword) {
        navigate("/auth/force-password-change");
      } else {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in. Welcome back!",
          icon: <Icons.LoginSuccessIcon className="w-10 h-10 text-green-900" />,
        });
      }
    } catch (error: any) {
      setIsLoading(false);

      if (error.name === 'ZodError') {
        toast({
          title: "Validation Error",
          description: "Please check your email and password format.",
          icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
        });
        return;
      }

      if (error.response?.status === 401) {
        toast({
          title: "Wrong Email or Password",
          description: "Please check your credentials and try again.",
          icon: <Icons.UnauthorizedAccessIcon className="w-10 h-10 text-red-600" />,
        });
      } else if (error.response?.status >= 500) {
        toast({
          title: "Server Error",
          description: "An unexpected error occurred. Please try again later.",
          icon: <Icons.ServerErrorIcon className="w-10 h-10 text-red-600" />,
        });
      } else if (error.response?.status === 403) {
        toast({
          title: "Account Locked",
          description: "Your account has been locked. Please check your email for instructions.",
          icon: <Icons.AccountLockedIcon className="w-10 h-10 text-red-600" />,
        });
      } else if (error.response?.status === 404) {
        toast({
          title: "User Not Found",
          description: "No account found with this email address.",
          icon: <Icons.ServerErrorIcon className="w-10 h-10 text-red-600" />,
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          icon: <Icons.OtherErrorIcon className="w-10 h-10 text-red-600" />,
        });
      }
    }
  };

  // Render the form
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email Input Field */}
        <div className="grid gap-1 p-1">
          <Label htmlFor="email" className="text-primary">Email</Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    disabled={isLoading}
                    placeholder="eg. email@gmail.com"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/* Password Input Field */}
        <div className="grid gap-1 p-1">
          <Label htmlFor="password" className="text-primary">Password</Label>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    disabled={isLoading}
                    placeholder="Enter   password"
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex justify-between items-center p-1">
          <div className="flex justify-between items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-primary">Remember me</Label>
          </div>
          <button
            onClick={onForgotPasswordClick}
            className="text-primary hover:underline text-sm"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="hover:opacity-70 w-full"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>
  );
}
