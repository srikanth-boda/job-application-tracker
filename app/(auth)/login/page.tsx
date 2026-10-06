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
import { signInWithEmail, signInWithGoogle } from "@/features/auth";
import { getAuthErrorMessage } from "@/lib/auth/auth-errors";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";

function LoginForm() {
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
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);
      await signInWithEmail(data);
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your JobTrack account</p>
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
        text="Continue with Google"
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
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          disabled={isSubmitting || isGoogleLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <Link
              href={ROUTES.forgotPassword}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isSubmitting || isGoogleLoading}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className="w-full py-2.5 font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Create account
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md mx-auto p-8 border-slate-200 flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
