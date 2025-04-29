import type { PageServerLoad } from './$types';
import { getNewsList } from '$lib/cms/client';

export const load: PageServerLoad = async () => {
	const newsList = await getNewsList();

	return {
		newsList
	};
};
