import { listEnabledShows } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals }) {
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 10;
	const offset = (page - 1) * limit;

	const { shows, total } = listEnabledShows(limit, offset);
	const totalPages = Math.ceil(total / limit);

	return {
		shows,
		page,
		totalPages
	};
}
