import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { db } from "$lib/server/db";
import { users, sessions, accounts } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "$env/dynamic/private";

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    sessionsTable: sessions,
    accountsTable: accounts,
  }),
  providers: [
    // Google OAuth Provider
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // GitHub OAuth Provider
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    // Credentials Provider (existing email/password login)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before logging in");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated. Please contact support");
        }

        const valid = await bcrypt.compare(password, user.password as string);
        if (!valid) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, email: user.email, name: user.name } as any;
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Custom account linking - we handle it manually in signIn callback
  // Additional OAuth configuration
  events: {
    async linkAccount({ user, account, profile }) {
      console.log(
        `🔗 Account linked: ${account.provider} for user ${user.email}`
      );
    },
    async createUser({ user }) {
      console.log(`👤 New user created via OAuth: ${user.email}`);
    },
  },
  callbacks: {
    // Handle account linking and user creation for OAuth
    async signIn({ user, account, profile }) {
      console.log(
        `SignIn callback - Provider: ${account?.provider}, Email: ${user?.email}`
      );

      // Allow OAuth sign-ins (Google & GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        if (user?.email) {
          try {
            const existingUser = await db.query.users.findFirst({
              where: eq(users.email, user.email),
            });

            if (existingUser) {
              // Check if this OAuth account is already linked
              const existingAccount = await db.query.accounts.findFirst({
                where: (accountsTable, { and, eq }) =>
                  and(
                    eq(accountsTable.userId, existingUser.id),
                    eq(accountsTable.provider, account.provider)
                  ),
              });

              if (!existingAccount) {
                // Link the OAuth account to the existing user
                await db.insert(accounts).values({
                  userId: existingUser.id,
                  type: String(account.type || "oauth"),
                  provider: String(account.provider || ""),
                  providerAccountId: String(account.providerAccountId || ""),
                  refresh_token: account.refresh_token
                    ? String(account.refresh_token)
                    : null,
                  access_token: account.access_token
                    ? String(account.access_token)
                    : null,
                  expires_at:
                    typeof account.expires_at === "number"
                      ? account.expires_at
                      : null,
                  token_type: account.token_type
                    ? String(account.token_type)
                    : null,
                  scope: account.scope ? String(account.scope) : null,
                  id_token: account.id_token ? String(account.id_token) : null,
                  session_state: account.session_state
                    ? String(account.session_state)
                    : null,
                });
                console.log(
                  `🔗 Manually linked ${account.provider} account to existing user: ${user.email}`
                );
              }

              // Update existing user with OAuth info and verify email
              await db
                .update(users)
                .set({
                  emailVerified: new Date(),
                  updatedAt: new Date(),
                  // Update name and image from OAuth if not already set
                  name: existingUser.name || user.name,
                  image: user.image || existingUser.image,
                })
                .where(eq(users.email, user.email));

              console.log(
                `✅ Successfully updated existing user: ${user.email}`
              );
            } else {
              console.log(
                `📝 New ${account.provider} user will be created: ${user.email}`
              );
            }
          } catch (error) {
            console.error(
              `❌ Error in signIn callback for ${account.provider}:`,
              error
            );
            // Still allow the sign-in to proceed
          }
        }
        // Always return true for OAuth providers to allow account linking
        return true;
      }

      // For credentials provider, use existing logic
      if (account?.provider === "credentials") {
        return true;
      }

      console.log(`❌ Rejected sign-in for provider: ${account?.provider}`);
      return false;
    },

    // Enhance session with user data from database
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, session.user.email),
        });
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).role = dbUser.role;
          (session.user as any).isActive = dbUser.isActive;
        }
      }
      return session;
    },
  },
  secret: env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  // Security configuration
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.callback-url"
          : "authjs.callback-url",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-authjs.csrf-token"
          : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
