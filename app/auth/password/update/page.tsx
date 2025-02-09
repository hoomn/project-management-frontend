import Link from "next/link";

import SetPasswordForm from "@/components/auth/set-password-form";
import PageHeader from "@/components/ui/page-header";

export default async function Page() {
  return (
    <>
      <PageHeader title="Change Password" />
      <div className="max-25 mx-auto">
        <div className="text-center mb-4">
          <i className="bi bi-person-lock auth-icon"></i>
        </div>
        <SetPasswordForm />
        <Link href="/auth/profile" className="btn btn-outline-danger w-100 mt-2">
          Go back to profile
        </Link>
      </div>
    </>
  );
}
