import { getShowDetails, updateShow } from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ url, locals, params, depends }) {
	depends('edit-show');
	const showId = Number(params.id);
	const details = getShowDetails(showId);
	return details;
}

export const actions = {
	update: async ({ request }) => {
		const formData = await request.formData();

		// Extract values from formData
		const showId = formData.get('id');
		const name = formData.get('name');
		const seatings = parseInt(formData.get('seatings'), 10);
		const start_time = formData.get('start_time');
		const description = formData.get('description');
		const duration = parseInt(formData.get('duration'), 10);
		const location = formData.get('location');
		const price_per_ticket = parseFloat(formData.get('price_per_ticket'));
		const enabled = formData.get('enabled') === 'true' ? 1 : 0; // Convert to integer (1 for true, 0 for false)

		try {
			updateShow(
				showId,
				name,
				seatings,
				start_time,
				description,
				duration,
				location,
				price_per_ticket,
				enabled
			);
		} catch (error) {
			console.error('Failed to update show:', error);
			return fail(401, { incorrect: true });
		}
		return { success: true };
	}
};
