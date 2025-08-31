/* eslint-disable no-mixed-spaces-and-tabs */
// 简介块
export type IntroContent = {
	name: string[];
	avatars: string[];
	theme: number;
	banner: string[];
	official_socials: string[];
	unofficial_socials: { platform: string; url: string }[];
};

// 作品块
export type WorksContent = {
	config?: GalleryConfig;
	items: WorkItem[];
};

// 每个作品项的类型
export type WorkItem =
	| {
			type: "image";
			url: string;
			origin?: string;
			caption?: string;
			comment?: string;
	  }
	| { type: "card"; front: string; back: string }
	| { type: "video"; url: string }
	| { type: "comic"; urls: string[] }; // 漫画多张图片

type GalleryConfig = {
	masonry: "col" | "row";
	col_num?: number;
	row_num?: number;
};

// 一整个块
export type Block = {
	id: string;
	type: "intro" | "md" | "works";
	content: IntroContent | string | WorksContent;
};

export interface PageSettings {
	layout: "grid" | "list"; // 画廊布局方式
	columns: number; // 网格列数
	showAvatars: boolean; // 是否显示艺术家头像
	background?: string; // 背景色
	theme?: "light" | "dark"; // 自定义主题
	[key: string]: any; // 以后扩展
}

export class PageData {
	settings: PageSettings;
	page: Block[];

	constructor(page: Block[] = [], settings?: Partial<PageSettings>) {
		this.page = page;
		this.settings = {
			layout: "grid",
			columns: 3,
			showAvatars: true,
			...settings, // 覆盖默认
		};
	}

	// 生成唯一 ID（时间戳）
	private generateId(): string {
		const ts = new Date()
			.toISOString()
			.replace(/[-:.TZ]/g, "")
			.slice(0, 14); // YYYYMMDDHHMMSS
		return `blk-${ts}`;
		// return `blk-${ts}-${Math.random().toString(36).slice(2, 6)}`;
	}

	// 添加一个块
	addBlock(
		type: Block["type"],
		content: Block["content"],
		index?: number
	): Block {
		const block: Block = {
			id: this.generateId(),
			type,
			content,
		};

		if (index !== undefined && index >= 0 && index <= this.page.length) {
			this.page.splice(index, 0, block);
		} else {
			this.page.push(block);
		}
		return block;
	}

	// 删除块
	removeBlock(id: string): boolean {
		const idx = this.page.findIndex((b) => b.id === id);
		if (idx !== -1) {
			this.page.splice(idx, 1);
			return true;
		}
		return false;
	}

	// 查找块
	getBlock(id: string): Block | undefined {
		return this.page.find((b) => b.id === id);
	}

	// 导出 JSON
	toJSON(): string {
		return JSON.stringify(
			{ settings: this.settings, page: this.page },
			null,
			2
		);
	}

	// 从 JSON 创建实例
	static fromJSON(data: any): PageData {
		if (!data.page || !Array.isArray(data.page)) {
			throw new Error("Invalid PageData JSON");
		}
		return new PageData(data.page);
	}
}
