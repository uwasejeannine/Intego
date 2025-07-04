import React, { useState } from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendVerificationCode } from "@/lib/api/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { passwordResetFormSchema } from "@/lib/validation/schema";

type FormData = z.infer<typeof passwordResetFormSchema>;

interface PasswordResetFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onBackToLoginClick: () => void;
  onSendVerificationCodeClick: () => void;
}

export function PasswordResetForm({
  className,
  onBackToLoginClick,
  onSendVerificationCodeClick,
  ...props
}: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form: UseFormReturn<FormData> = useForm<FormData>({
    resolver: zodResolver(passwordResetFormSchema), // Using Zod schema for validation
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setIsLoading(true);

    try {
      await sendVerificationCode(data.email);
      setIsLoading(false);
      onSendVerificationCodeClick();
      toast({
        title: "Success",
        description: "Verification code sent successfully",
        icon: <Icons.EMailSentSuccess className="w-10 h-10 text-green-600" />,
      });
    } catch (error: any) {
      setIsLoading(false);
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error.response?.status === 400) {
      // Code already sent
      toast({
        title: "Code Already Sent",
        description: "A verification code has already been sent to   email.",
        icon: <Icons.EmailAlreadySent className="w-10 h-10 text-gray-600" />,
      });
    } else if (error.response?.status === 404) {
      // User not found
      toast({
        title: "User Not Found",
        description: "The email address you entered does not exist.",
        icon: <Icons.UserNotFound className="w-10 h-10 text-gray-600" />,
      });
    } else if (error.response?.status === 429) {
      // Account locked
      toast({
        title: "Account Locked",
        description:
          "  account has been locked due to multiple failed attempts. Please contact support to unlock   account.",
        icon: <Icons.AccountLockedIcon className="w-10 h-10 text-red-600" />,
      });
    } else if (error.response?.status >= 500) {
      // Server error
      toast({
        title: "Server Error",
        description:
          "An unexpected error occurred on the server. Please try again later or contact support for assistance.",
        icon: <Icons.ServerErrorIcon className="w-10 h-10 text-red-600" />,
      });
    } else {
      // Other error
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        icon: <Icons.EmailSentFail className="w-10 h-10 text-red-600" />,
      });
    }
  };

  return (
    <div className={className} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <div className="grid gap-1 pb-2">
            <Label htmlFor="email">Email</Label>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. someone@minagri.gov.rw"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="hover:opacity-70 w-full"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Verification Code
          </Button>
        </form>
      </Form>

      <a
        onClick={onBackToLoginClick}
        className="text-primary hover:underline mt-2 flex justify-center items-center"
      >
        Back to Login
      </a>
    </div>
  );
}
