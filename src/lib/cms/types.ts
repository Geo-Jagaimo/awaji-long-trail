type MicrocmsImage = {
	url: string;
	height: number;
	width: number;
};

export type Category = {
	id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	revisedAt: string;
	name: string;
};

export type Post = {
	id: string;
	title: string;
	category: {
		id: string;
		name: string;
	}[];
	member?: string;
	content: string;
	eyecatch?: MicrocmsImage;
	createdAt: string;
	publishedAt: string;
	revisedAt?: string;
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
