"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { registerWithEmail, signInWithGoogle } from "@/features/auth";
import { getAuthErrorMessage } from "@/lib/auth/auth-errors";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || ROUTES.dashboard;

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await registerWithEmail(data);
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      setIsGoogleLoading(true);
      await signInWithGoogle();
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setAuthError(getAuthErrorMessage(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 sm:p-8 border-slate-200 shadow-sm bg-white">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Start tracking your job search in one organized place
        </p>
      </div>

      {authError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <span className="flex-1 leading-snug">{authError}</span>
        </div>
      )}

      <GoogleButton
        onClick={handleGoogleSignIn}
        loading={isGoogleLoading}
        disabled={isSubmitting}
        text="Sign up with Google"
      />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400 font-medium">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          disabled={isSubmitting || isGoogleLoading}
          error={errors.displayName?.message}
          {...register("displayName")}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          disabled={isSubmitting || isGoogleLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={isSubmitting || isGoogleLoading}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          disabled={isSubmitting || isGoogleLoading}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="w-full py-2.5 font-medium flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md mx-auto p-8 border-slate-200 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </Card>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
