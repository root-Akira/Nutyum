import { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up | Nutyum",
  description: "Create your Nutyum account.",
};

export default function SignUpPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7EE] px-6 py-20">
      <SignUpForm />
    </main>
  );
}
