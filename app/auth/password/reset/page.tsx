import Link from "next/link";
import { redirect } from "next/navigation";

import ResetPasswordForm from "@/components/auth/reset-password-form";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="max-25 mx-auto">
      <div className="text-center mb-4">
        <i className="bi bi-shield-fill-exclamation auth-icon"></i>
      </div>
      <div className="text-center mb-4">
        <h4 className="g2-text-blue fw-normal">Reset Password</h4>
      </div>
      <ResetPasswordForm />
      <div className="text-center mt-4">
        <p className="text-muted mb-2">
          Already have an Account? <Link href="/auth/sign-in">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
