import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect if already authenticated
	if (locals.auth?.user) {
		throw redirect(303, '/dashboard');
	}
	
	return {};
};
