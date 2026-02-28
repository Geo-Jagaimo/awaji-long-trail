import { json } from '@sveltejs/kit';
import { ADMIN_PASSWORD, MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY } from '$env/static/private';
import { timingSafeEqual } from '$lib/auth';
import type { RequestHandler } from './$types';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const password = formData.get('password') as string;
	const file = formData.get('file') as File;

	if (!timingSafeEqual(password ?? '', ADMIN_PASSWORD)) {
		return json({ error: '認証に失敗しました。' }, { status: 401 });
	}

	if (!file) {
		return json({ error: 'ファイルが必要です。' }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return json({ error: '許可されていないファイル形式です。' }, { status: 400 });
	}

	if (file.size > MAX_FILE_SIZE) {
		return json({ error: 'ファイルサイズが大きすぎます（上限10MB）。' }, { status: 400 });
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
		return json({ error: '画像アップロードに失敗しました。' }, { status: 500 });
	}

	const result = await response.json();
	return json(result);
};
