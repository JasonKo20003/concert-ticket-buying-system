import { getUserTickets } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals }) {
	if (!locals.user) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	const page = Number(url.searchParams.get('page') || '1');
	const limit = 10;
	const offset = (page - 1) * limit;

	const { tickets, total } = getUserTickets(locals.user.id, limit, offset);
	const totalPages = Math.ceil(total / limit);

	return {
		tickets,
		page,
		totalPages
	};
}
