import { testTable } from "@/db/schema";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth();

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  const dataTest = await db.select().from(testTable);

  // Use `user` to render user details or create UI elements
  return (
    <div>
      <div>Welcome, {user?.firstName}!</div>
      <pre>{JSON.stringify(dataTest, null, 2)}</pre>
    </div>
  );
}
