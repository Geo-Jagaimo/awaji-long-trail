import DOMPurify from 'dompurify';

/**
 * HTML文字列をサニタイズする関数
 * @param html - サニタイズ対象のHTML文字列
 * @returns サニタイズ後の安全なHTML文字列
 */
export function sanitizeHtml(html: string): string {
	return DOMPurify.sanitize(html, {
		USE_PROFILES: { html: true }
	});
}
