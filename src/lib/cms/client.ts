import { createClient, type MicroCMSQueries } from 'microcms-js-sdk';
import type { Post, Response, News } from './types';

import { MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY } from '$env/static/private';

export const client = createClient({
	serviceDomain: MICROCMS_SERVICE_DOMAIN,
	apiKey: MICROCMS_API_KEY
});

const getList = async (queries?: MicroCMSQueries) => {
	return await client.get<Response>({ endpoint: 'posts', queries });
};

const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
	return await client.getListDetail<Post>({
		endpoint: 'posts',
		contentId,
		queries
	});
};

const getNewsList = async (): Promise<News[]> => {
	const data = await client.getList<News>({
		endpoint: 'news'
	});

	return data.contents;
};

export { getList, getDetail, getNewsList };
