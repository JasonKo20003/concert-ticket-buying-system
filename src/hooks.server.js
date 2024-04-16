import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle = async ({ event, resolve }) => {
	const token = event.cookies.get('csrf-token');
	if (token) {
		try {
			// Decode the JWT
			const decoded = jwt.verify(token, JWT_SECRET);

			const user = {
				id: decoded['id'],
				role: decoded['role'],
				email: decoded['email']
			};
			// console.log(user);
			if (user.role && user.id) {
				// If all claims are present, set the user
				event.locals.user = user;
			} else {
				// If any claim is missing, consider the token invalid
				throw new Error('Invalid token');
			}
		} catch (error) {
			// Clear the token if there's any error (including invalid JWT structure)
			event.cookies.delete('csrf-token', { path: '/' });
		}
	}

	// Resolve the request
	const response = await resolve(event);
	return response;
};
