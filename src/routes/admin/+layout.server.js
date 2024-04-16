import { redirect, error } from '@sveltejs/kit';

export async function load({ locals, url, cookies }) {
	if (locals.user.role !== 'admin') {
		throw error(401, 'Unauthorized Access');
	}
}
