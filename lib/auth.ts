import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded as { id: string; role: string };
  } catch (error: any) {
    console.error("getCurrentUser error:", error.message);
    return null;
  }
}