import DOMPurify from 'universal-dompurify';
import { client } from '$lib/cms/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const data = await client.get({
		endpoint: 'blogs',
		contentId: params.id
	});

	const sanitizedContent = DOMPurify.sanitize(data.content);
	return {
		...data,
		content: sanitizedContent
	};
};

export const prerender = true;
