import { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Nutyum",
  description: "Sign in to your Nutyum account.",
};

export default function SignInPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7EE] px-6 py-20">
      <SignInForm />
    </main>
  );
}
