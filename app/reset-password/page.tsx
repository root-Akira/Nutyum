import { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Nutyum",
  description: "Set a new password for your Nutyum account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7EE] px-6 py-20">
      <ResetPasswordForm />
    </main>
  );
}
