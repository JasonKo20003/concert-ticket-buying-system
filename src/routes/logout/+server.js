import { redirect } from '@sveltejs/kit';

export function POST({ cookies }) {
	cookies.delete('csrf-token', { path: '/' });
	throw redirect(302, '/');
}
