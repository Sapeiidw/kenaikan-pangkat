import { SignIn } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
