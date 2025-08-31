import { WorkItem, WorksContent } from "./page-data";

export interface ImageData {
	caption_text: string;
	thumb_link: string;
	origin_link: string;
}

export interface VideoData {
	caption_text: string;
	poster_link: string;
	video_link: string;
}

export interface SrcMediaData {
	is_placeholder?: boolean;
	is_image: boolean;
	comment_text: string | null;
	image_data: ImageData | null;
	video_data: VideoData | null;
}

export class MediaData {
	mediaList: SrcMediaData[] = [];

	constructor(mediaList: SrcMediaData[] = []) {
		this.mediaList = mediaList;
	}

	static fromWorksContent(
		content: WorksContent | WorkItem[] | undefined
	): SrcMediaData[] {
		if (!content) return [];

		const mediaList: SrcMediaData[] = [];
		const cloudfareCDN = "https://image-proxy.cyuhaonan.workers.dev";

		// 判断 content 是数组还是对象
		const items: WorkItem[] = Array.isArray(content)
			? content
			: content.items || [];

		items.forEach((item: WorkItem) => {
			switch (item.type) {
				case "image":
					mediaList.push({
						is_image: true,
						comment_text: item.comment || null,
						image_data: {
							caption_text: item.caption || "",
							thumb_link: MediaData.getThumbUrl(
								item.url,
								cloudfareCDN
							),
							origin_link: MediaData.getOrigiUrl(
								item.url,
								cloudfareCDN
							),
						},
						video_data: null,
					});
					break;
				case "card":
					mediaList.push({
						is_image: true,
						comment_text: null,
						image_data: {
							caption_text: "Card side A",
							thumb_link: item.front,
							origin_link: item.front,
						},
						video_data: null,
					});
					mediaList.push({
						is_image: true,
						comment_text: null,
						image_data: {
							caption_text: "Card side B",
							thumb_link: item.back,
							origin_link: item.back,
						},
						video_data: null,
					});
					break;
				case "video":
					mediaList.push({
						is_image: false,
						comment_text: null,
						image_data: null,
						video_data: {
							caption_text: "",
							poster_link: "",
							video_link: item.url,
						},
					});
					break;
				case "comic":
					item.urls.forEach((url) => {
						mediaList.push({
							is_image: true,
							comment_text: null,
							image_data: {
								caption_text: "Comic page",
								thumb_link: url,
								origin_link: url,
							},
							video_data: null,
						});
					});
					break;
			}
		});

		return new MediaData(mediaList).mediaList;
	}

	private static isImgbox = (url: string): boolean => {
		return url.includes("s2.imgbox.com/");
	};

	// 不管什么类型的链接，直接传
	private static getOrigiUrl = (
		url: string,
		cloudfareCDN: string
	): string => {
		return url
			.split("|")
			.map((l) => {
				l = this.isImgbox(url)
					? l.replace(/thumbs2/g, "images2").replace(/_t\./g, "_o.")
					: l.replace(/th\./g, "").replace(/md\./g, "");

				return this.isImgbox(url)
					? `${cloudfareCDN}?url=${encodeURIComponent(l)}`
					: l;
			})
			.join("|");
	};

	private static getThumbUrl = (
		url: string,
		cloudfareCDN: string
	): string => {
		return url
			.split("|")
			.map((l) => {
				return this.isImgbox(url)
					? `${cloudfareCDN}?url=${encodeURIComponent(l)}`
					: l;
			})
			.join("|");
	};
}
