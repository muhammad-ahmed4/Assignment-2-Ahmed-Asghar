import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/server/db';
import { users, sessions, accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		sessionsTable: sessions,
		accountsTable: accounts
	}),
	providers: [
		// No providers - we handle login manually
	],
	session: {
		strategy: 'database',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
	callbacks: {
		// Enhance session with user data from database
		async session({ session }) {
			if (session.user?.email) {
				const dbUser = await db.query.users.findFirst({ where: eq(users.email, session.user.email) });
				if (dbUser) {
					(session.user as any).id = dbUser.id;
					(session.user as any).role = dbUser.role;
					(session.user as any).isActive = dbUser.isActive;
				}
			}
			return session;
		}
	},
	secret: env.AUTH_SECRET,
	trustHost: true,
	pages: {
		signIn: '/login',
		error: '/login'
	},
	debug: process.env.NODE_ENV === 'development',
	// Security configuration
	cookies: {
		sessionToken: {
			name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
			options: {
				httpOnly: true,
				sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 30 * 24 * 60 * 60 // 30 days
			}
		},
		callbackUrl: {
			name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.callback-url' : 'authjs.callback-url',
			options: {
				httpOnly: true,
				sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production'
			}
		},
		csrfToken: {
			name: process.env.NODE_ENV === 'production' ? '__Host-authjs.csrf-token' : 'authjs.csrf-token',
			options: {
				httpOnly: true,
				sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production'
			}
		}
	}
});
