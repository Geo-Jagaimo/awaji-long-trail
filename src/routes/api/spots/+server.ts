import { json } from '@sveltejs/kit';
import { getSpotList, createSpot } from '$lib/cms/client';
import { ADMIN_PASSWORD } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const spots = await getSpotList();
	return json(spots);
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { password, ...spotData } = body;

	if (password !== ADMIN_PASSWORD) {
		return json({ error: '認証に失敗しました。' }, { status: 401 });
	}

	const { title, date, description, image, lat, lng } = spotData;

	if (!title || !date || !description || lat == null || lng == null) {
		return json({ error: '必須フィールドが不足しています。' }, { status: 400 });
	}

	const spot = { title, date, description, image, lat, lng };
	const result = await createSpot(spot);
	return json(result, { status: 201 });
};
