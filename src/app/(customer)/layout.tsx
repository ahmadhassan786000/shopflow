import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Container } from "react-bootstrap";
import { StorefrontNavbar } from "@/components/layout/StorefrontNavbar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <StorefrontNavbar isLoggedIn />

      <Container className="shop-customer-content">
        {children}
      </Container>
    </>
  );
}
