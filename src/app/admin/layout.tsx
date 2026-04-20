import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Kidbrook Admin",
  description: "Kidbrook Homes content management",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body > header,
        body > footer {
          display: none !important;
        }
        body {
          background: #FAFAF5;
        }
      `}</style>
      <AdminShell>{children}</AdminShell>
    </>
  );
}
