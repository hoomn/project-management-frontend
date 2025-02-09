"use client";

import { useReCaptcha } from "next-recaptcha-v3";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { SubmitHandler, UseFormSetError, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import api from "@/lib/api";
import { resetPasswordSchema } from "@/lib/zod";

import { Alert, Form } from "react-bootstrap";

import AuthButton from "./auth-button";
import FloatingInput from "./floating-input";

type FormFields = z.infer<typeof resetPasswordSchema>;

type ResetPasswordConfirmFormProps = {
  uid: string;
  token: string;
};

export default function ResetPasswordConfirmForm({ uid, token }: ResetPasswordConfirmFormProps) {
  const { executeRecaptcha } = useReCaptcha();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(resetPasswordSchema),
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
      const recaptchaToken = await executeRecaptcha("reset_password_confirm");

      await api.post("/auth/users/reset_password_confirm/", {
        ...data,
        uid: uid,
        token: token,
        recaptcha: recaptchaToken,
      });

      toast.success("Your password has been successfully reset. You can now log in with your new password.");

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
      <FloatingInput
        type="password"
        label="New Password"
        register={register("new_password")}
        error={errors.new_password}
      />
      <FloatingInput
        type="password"
        label="Confirm New Password"
        register={register("re_new_password")}
        error={errors.re_new_password}
      />
      {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
      <AuthButton title="Reset password" isLoading={isSubmitting} />
    </Form>
  );
}
