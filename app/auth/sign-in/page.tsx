import Link from "next/link";
import { redirect } from "next/navigation";

import SignInForm from "@/components/auth/sign-in-form";

import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="max-25 mx-auto">
      <div className="text-center mb-4">
        <i className="bi bi-person auth-icon"></i>
      </div>
      <div className="text-center mb-4">
        <h4 className="g2-text-blue fw-normal">Sign in</h4>
      </div>
      <SignInForm />
      <div className="mt-4">
        <div className="text-center">
          <p className="text-muted mb-2">
            Forgot password? <Link href={"/auth/password/reset"}>Reset</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
