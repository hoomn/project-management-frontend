import { notFound, redirect } from "next/navigation";

import ResetPasswordConfirmForm from "@/components/auth/reset-password-confirm-form";

import { auth } from "@/auth";
import api from "@/lib/api";

export default async function Page({ params }: { params: Promise<{ uid: string; token: string }> }) {
  const { uid, token } = await params;

  const session = await auth();

  if (session) {
    redirect("/");
  }

  try {
    await api.post("/users/token/validation/password/reset/", {
      uid: uid,
      token: token,
    });
  } catch (error) {
    console.log(error);
    notFound();
  }

  return (
    <div className="max-25 mx-auto">
      <div className="text-center mb-4">
        <i className="bi bi-shield-fill-exclamation auth-icon"></i>
      </div>
      <div className="text-center mb-4">
        <h4 className="g2-text-blue fw-normal">Reset Password</h4>
      </div>
      <ResetPasswordConfirmForm uid={uid} token={token} />
    </div>
  );
}
