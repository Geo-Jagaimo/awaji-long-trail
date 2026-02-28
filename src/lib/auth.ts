/**
 * タイミング攻撃を防ぐ定数時間の文字列比較
 */
export function timingSafeEqual(a: string, b: string): boolean {
	const encoder = new TextEncoder();
	const bufA = encoder.encode(a);
	const bufB = encoder.encode(b);

	const len = Math.max(bufA.byteLength, bufB.byteLength);
	const paddedA = new Uint8Array(len);
	const paddedB = new Uint8Array(len);
	paddedA.set(bufA);
	paddedB.set(bufB);

	let mismatch = bufA.byteLength ^ bufB.byteLength;
	for (let i = 0; i < len; i++) {
		mismatch |= paddedA[i] ^ paddedB[i];
	}
	return mismatch === 0;
}
