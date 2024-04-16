import { buyTicket, getAvailableSeats } from '$lib/db';
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
	default: async ({ request, params, locals }) => {
		const formData = await request.formData();

		const selected = formData.get('selected');

		const showId = Number(params.id);

		buyTicket(locals.user.id, showId, selected);
		// const password = formData.get('password');

		// let user;
		// try {
		// 	user = await loginUser(username, password);
		// } catch (error) {
		// 	console.log('error');
		// 	return fail(401, { username, incorrect: true });
		// }

		// if (!user) {
		// 	return fail(401, { username, incorrect: true });
		// }
		// // Handle session/token storage here and then redirect
		// cookies.set('csrf-token', user.token, {
		// 	path: '/',
		// 	httpOnly: true,
		// 	sameSite: 'strict',
		// 	secure: process.env.NODE_ENV === 'production',
		// 	maxAge: 60 * 60 * 24 * 30
		// });

		// if (url.searchParams.has('redirectTo')) {
		// 	redirect(302, url.searchParams.get('redirectTo'));
		// }

		// redirect(302, '/');
		return { success: true };
	}
};
