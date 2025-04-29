type MicrocmsImage = {
	url: string;
	height: number;
	width: number;
};

export type Post = {
	id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	revisedAt: string;
	title: string;
	content: string;
	selectField: string;
	eyecatch: MicrocmsImage;
};

export type News = {
	id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	revisedAt: string;
	title: string;
	content: string;
};

export type Response = {
	totalCount: number;
	offset: number;
	limit: number;
	contents: Post[];
};
