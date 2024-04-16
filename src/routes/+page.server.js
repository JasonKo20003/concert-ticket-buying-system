import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
	return redirect(302, 'shows/?page=1');
}
