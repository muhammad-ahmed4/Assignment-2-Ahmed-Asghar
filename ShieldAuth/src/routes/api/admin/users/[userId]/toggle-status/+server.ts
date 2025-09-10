import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db.js";
import { users } from "$lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types.js";

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  try {
    // Check if user is authenticated and is admin
    if (!locals.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (locals.user.role !== "admin") {
      return json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { isActive } = await request.json();
    const userId = params.userId;

    if (!userId) {
      return json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admin from deactivating themselves
    if (userId === locals.user.id && !isActive) {
      return json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    // Update user status
    await db
      .update(users)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
