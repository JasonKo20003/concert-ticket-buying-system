import { cancelTicket, getAvailableSeats } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ url, locals, params, depends }) {
	if (!locals.user) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}
	depends('seatings');
	const showId = Number(params.id);
	const availableSeats = getAvailableSeats(showId);
	return {
		availableSeats
	};
}

export const actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const selected = formData.get('selected');

		const showId = Number(params.id);

		cancelTicket(showId, selected);

		return { success: true };
	}
};
