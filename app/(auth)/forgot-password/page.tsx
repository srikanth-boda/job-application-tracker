"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { sendPasswordReset } from "@/features/auth";
import { getAuthErrorMessage } from "@/lib/auth/auth-errors";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.schema";

export default function ForgotPasswordPage() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await sendPasswordReset(data);
      setIsSuccess(true);
    } catch (err) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 border-slate-200 shadow-sm bg-white">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset password</h1>
        <p className="mt-1 text-sm text-slate-500">
          We&apos;ll send you instructions to reset your password
        </p>
      </div>

      {isSuccess ? (
        <div className="space-y-6">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Reset email sent!</p>
              <p className="mt-1 text-emerald-700">
                If an account exists for <strong>{getValues("email")}</strong>, you will receive a
                password reset link shortly.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.login}
            className="flex items-center justify-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to sign in</span>
          </Link>
        </div>
      ) : (
        <>
          {authError && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span className="flex-1 leading-snug">{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Send reset instructions</span>
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </Card>
  );
}
