"use client";

import { signIn } from "next-auth/react";
import { useReCaptcha } from "next-recaptcha-v3";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { signInFormSchema } from "@/lib/zod";

import { Alert, Form } from "react-bootstrap";

import AuthButton from "./auth-button";
import FloatingInput from "./floating-input";

type FormFields = z.infer<typeof signInFormSchema>;

export default function SignInForm() {
  const { executeRecaptcha } = useReCaptcha();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Default to '/' if no callbackUrl
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const detail = searchParams.get("code");

  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!executeRecaptcha) {
      setError("root", {
        type: "manual",
        message: "reCAPTCHA not ready or failed to load.",
      });
      return;
    }

    try {
      const token = await executeRecaptcha("registration");

      const response = await signIn("credentials", {
        ...data,
        recaptcha: token,
        redirect: false,
      });

      if (response?.error) {
        setError("root", {
          message: response?.code || "An error occurred during sign in",
        });

        resetField("password");
        return;
      }

      // Successful login
      if (response?.ok) {
        toast.success("You have signed in successfully!");
        router.push(callbackUrl);
      }
    } catch (error) {
      console.log("Sign in error:", error);
      setError("root", {
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && <Alert variant="danger">{errors.root?.message}</Alert>}
      {detail && <Alert variant="danger">{detail}</Alert>}
      <FloatingInput type="email" label="Email Address" register={register("email")} error={errors.email} />
      <FloatingInput type="password" label="Password" register={register("password")} error={errors.password} />
      <AuthButton title="Sign in" isLoading={isSubmitting} />
    </Form>
  );
}
