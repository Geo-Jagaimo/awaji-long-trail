import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getDetail } from '$lib/cms/client';
import type { Post } from '$lib/cms/types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	try {
		const post: Post = await getDetail(id);
		return { post };
	} catch {
		throw error(404, 'Post not found');
	}
};
