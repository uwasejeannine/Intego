import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/otp";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { VerificationCodeSchema } from "@/lib/validation/schema";
import { verifyCode } from "@/lib/api/api";
import { usePasswordResetStore } from "@/stores/passwordResetStore";

interface VerificationCodeFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onBackToLoginClick: () => void;
  onSubmit: () => void;
}

export function VerificationCodeForm({
  onBackToLoginClick,
  onSubmit,
}: VerificationCodeFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof VerificationCodeSchema>>({
    resolver: zodResolver(VerificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof VerificationCodeSchema>) {
    setIsLoading(true);

    try {
      const response = await verifyCode(data.code);
      if (
        response.status === 200 &&
        response.data.message === "Code is valid"
      ) {
        const { userId } = response.data;
        usePasswordResetStore.getState().setResetUserId(userId);
        onSubmit();
        toast({
          title: "Verification Success",
          icon: <Icons.VerifyCodeSuccess />,
          description: "The verification code is valid.",
        });
      } else {
        toast({
          title: "Invalid Verification Code",
          icon: <Icons.VerifyCodeFailed />,
          description: "The verification code you entered is invalid.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        icon: <Icons.VerifyCodeFailed />,
        description: "Failed to validate verification code. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center items-center gap-2">
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 flex flex-col items-center justify-center"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field} className="flex">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>

        <Button
          onClick={onBackToLoginClick}
          variant={"ghost"}
          className="text-primary hover:underline space-y-4"
        >
          Back to Login
        </Button>
      </div>
    </Form>
  );
}
