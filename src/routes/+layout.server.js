export const ssr = false;

export const load = ({ locals, depends }) => {
	depends('user');
	return {
		user: locals.user
	};
};
