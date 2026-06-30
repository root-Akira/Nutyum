import { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Nutyum",
  description: "Reset your Nutyum account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7EE] px-6 py-20">
      <ForgotPasswordForm />
    </main>
  );
}
