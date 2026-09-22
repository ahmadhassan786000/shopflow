import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountSubpageHeader } from "../AccountSubpageHeader";
import { AddressManager } from "../AddressManager";

export const metadata = {
  title: "Saved Addresses",
};

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="shop-account-page">
      <AccountSubpageHeader
        title="Saved Addresses"
        description="Manage the delivery addresses linked to your account."
      />

      <AddressManager addresses={addresses} />
    </div>
  );
}
