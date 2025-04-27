import { getList } from '$lib/cms/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return await getList();
};

export const prerender = true;
