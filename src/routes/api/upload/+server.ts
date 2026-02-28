import { json } from '@sveltejs/kit';
import { ADMIN_PASSWORD, MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const password = formData.get('password') as string;
	const file = formData.get('file') as File;

	if (password !== ADMIN_PASSWORD) {
		return json({ error: '認証に失敗しました。' }, { status: 401 });
	}

	if (!file) {
		return json({ error: 'ファイルが必要です。' }, { status: 400 });
	}

	const uploadForm = new FormData();
	uploadForm.append('file', file);

	const response = await fetch(
		`https://${MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/media`,
		{
			method: 'POST',
			headers: {
				'X-MICROCMS-API-KEY': MICROCMS_API_KEY
			},
			body: uploadForm
		}
	);

	if (!response.ok) {
		const error = await response.text();
		return json({ error: `画像アップロードに失敗しました。: ${error}` }, { status: 500 });
	}

	const result = await response.json();
	return json(result);
};