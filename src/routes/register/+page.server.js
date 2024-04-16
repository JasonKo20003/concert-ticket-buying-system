import { registerUser } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export const actions = {
	register: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');
		console.log(formData);

		const result = await registerUser(username, password, email);
		return redirect(302, '/login'); // Redirect on successful registration
	}
};
