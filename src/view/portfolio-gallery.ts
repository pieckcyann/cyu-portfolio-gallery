import {
	WorkspaceLeaf,
	TFile,
	Notice,
	TextFileView,
	MarkdownRenderer,
} from "obsidian";
import ProGalleryPlugin from "src/main";
import { IntroContent, PageData } from "src/data/page-data";
import { FileUtil } from "src/util/file-utils";
import {
	createIntroBlock,
	createMdBlock,
	createWorksBlock,
} from "./portfolio-intro";
import { renderMD } from "src/util/utils";

export const VIEW_TYPE_PRO_GALLERY = "gallery";

export class ProGalleryView extends TextFileView {
	plugin: ProGalleryPlugin;
	pageData: PageData;

	constructor(leaf: WorkspaceLeaf, plugin: ProGalleryPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.pageData = new PageData([]);
	}

	getIcon(): string {
		return "gallery";
	}

	getDisplayText() {
		return this.file?.basename || "Pro Gallery";
	}

	getViewType(): string {
		return VIEW_TYPE_PRO_GALLERY;
	}

	// 读取文件数据 -> PageData
	async setViewData(data: string, clear: boolean): Promise<void> {
		if (!this.file) return;

		try {
			this.pageData = await FileUtil.loadPageData(this.app, this.file);
		} catch (err) {
			new Notice("❌ 无法加载画廊文件");
			console.error(err);
			this.pageData = new PageData([]);
		}

		// 渲染
		const container = this.containerEl.children[1];
		container.empty();

		// 顶部工具栏
		const topBar = container.createDiv("ProGallery-TopBar");
		const addButton = topBar.createEl("button", {
			text: "添加艺术家块",
			cls: ["ProGallery-AddButton", "mod-cta"],
		});

		// 新建
		addButton.addEventListener("click", async () => {
			this.pageData.addBlock("intro", {
				name: ["新艺术家", "别名"],
				avatars: [],
				banner: [],
				theme: 0,
				official_socials: [],
				unofficial_socials: [],
			});

			if (this.file) {
				await FileUtil.savePageData(this.app, this.file, this.pageData);
				this.renderBlocks(container as HTMLElement);
			}
		});

		// 主容器
		const galleryContainer = container.createDiv("ProGallery-Container");
		this.renderBlocks(galleryContainer);
	}

	// 把 pageData 渲染出来
	private renderBlocks(container: HTMLElement) {
		container.empty();
		this.pageData.page.forEach((block) => {
			const blockEl = container.createDiv("ProGallery-Block");
			blockEl.setAttr("data-id", block.id);

			if (block.type === "intro") {
				createIntroBlock(block, blockEl, this);
			} else if (block.type === "md") {
				createMdBlock(block, blockEl, this);
			} else if (block.type === "works") {
				createWorksBlock(block, blockEl, this);
			}
		});
	}

	getViewData(): string {
		return JSON.stringify(this.pageData.toJSON(), null, 2);
	}

	clear(): void {
		this.containerEl.empty();
		this.file = null;
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
	}

	async onClose() {}
}
