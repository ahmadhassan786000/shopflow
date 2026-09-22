import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountSubpageHeader } from "../AccountSubpageHeader";
import { ProfileForm } from "./ProfileForm";

export const metadata = {
  title: "Edit Profile",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="shop-account-page">
      <AccountSubpageHeader
        title="Edit Profile"
        description="Update your name and see the email linked to your account."
      />

      <ProfileForm name={user.name} email={user.email} />
    </div>
  );
}
