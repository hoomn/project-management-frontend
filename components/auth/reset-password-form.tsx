"use client";

import { useReCaptcha } from "next-recaptcha-v3";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { SubmitHandler, UseFormSetError, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import api from "@/lib/api";
import { emailSchema } from "@/lib/zod";

import { Alert, Form } from "react-bootstrap";

import AuthButton from "./auth-button";
import FloatingInput from "./floating-input";

type FormFields = z.infer<typeof emailSchema>;

export default function ResetPasswordForm() {
  const { executeRecaptcha } = useReCaptcha();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(emailSchema),
  });

  const mapFieldError = (key: string): keyof FormFields | "root" => {
    if (key === "non_field_errors" || key === "recaptcha") return "root";
    return key as keyof FormFields;
  };

  const handleApiError = (error: AxiosError<Record<string, string[]>>, setError: UseFormSetError<FormFields>) => {
    if (error.response?.status === 400 && error.response.data) {
      Object.entries(error.response.data).forEach(([key, messages]) => {
        const field = mapFieldError(key);
        setError(field, {
          type: "manual",
          message: messages[0],
        });
      });
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!executeRecaptcha) {
      setError("root", {
        type: "manual",
        message: "reCAPTCHA not ready or failed to load.",
      });
      return;
    }

    try {
      const token = await executeRecaptcha("reset_password");

      await api.post("/auth/users/reset_password/", {
        ...data,
        recaptcha: token,
      });

      toast.success(
        "If we have an account associated with the provided email address, we will send password reset instructions shortly. Please check your email and follow the instructions to reset your password.",
      );
      toast.success(
        "If you don't see the email, check your spam or junk folder. Ensure the email address you entered is correct.",
      );

      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        handleApiError(error, setError);
      } else {
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred while validating the reCAPTCHA. Please try again later.",
        });
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FloatingInput type="email" label="Email Address" register={register("email")} error={errors.email} />
      {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
      <AuthButton title="Reset password" isLoading={isSubmitting} />
    </Form>
  );
}
