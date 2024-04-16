import { loginUser } from '$lib/db';
import { error, fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		let user;
		try {
			user = await loginUser(username, password);
		} catch (error) {
			console.log('error');
			return fail(401, { username, incorrect: true });
		}

		if (!user) {
			return fail(401, { username, incorrect: true });
		}
		// Handle session/token storage here and then redirect
		cookies.set('csrf-token', user.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30
		});

		if (url.searchParams.has('redirectTo')) {
			redirect(302, url.searchParams.get('redirectTo'));
		}

		redirect(302, '/');
	}
};
