import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountSubpageHeader } from "../AccountSubpageHeader";
import { PasswordForm } from "./PasswordForm";

export const metadata = {
  title: "Change Password",
};

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="shop-account-page">
      <AccountSubpageHeader
        title="Change Password"
        description="Choose a strong new password to keep your account secure."
      />

      <PasswordForm />
    </div>
  );
}
