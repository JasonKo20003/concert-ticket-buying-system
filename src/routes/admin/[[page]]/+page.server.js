import { createShow, deleteShow, listAllShows } from '$lib/db';
import { redirect } from '@sveltejs/kit';
import moment from 'moment';

export async function load({ url, locals }) {
	const page = Number(url.searchParams.get('page') || '1');
	const limit = 10;
	const offset = (page - 1) * limit;

	const { shows, total } = listAllShows(limit, offset);
	const totalPages = Math.ceil(total / limit);

	return {
		shows,
		page,
		totalPages
	};
}

export const actions = {
	new: async ({ cookies, request, url }) => {
		const now = moment();
		const formattedDate = now.format('YYYY-MM-DD HH:mm');
		const showId = createShow('Untitled', 0, formattedDate, '', 0, '', 0);
		redirect(302, `/admin/edit/${showId}`);
	},

	delete: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const showId = formData.get('id');
		deleteShow(showId);
	}
};
