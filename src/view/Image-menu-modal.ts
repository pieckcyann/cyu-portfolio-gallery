import { App, Menu, Modal } from "obsidian";

export class ImageMenuModal {
	private app: App;
	private imageElem: HTMLImageElement | null = null;

	constructor(app: App) {
		this.app = app;
	}

	// 设置目标图片元素
	setImageElem(elem: HTMLImageElement) {
		this.imageElem = elem;
		return this;
	}

	// 打开空白 Modal
	openModal() {
		if (!this.imageElem) return;

		const modal = new Modal(this.app);
		modal.onOpen = () => {
			modal.contentEl.createEl("h3", { text: "这是一个空白 Modal" });
			modal.contentEl.createEl("p", {
				text: `图片 src: ${this.imageElem!.src}`,
			});
		};
		modal.onClose = () => {
			modal.contentEl.empty();
		};
		modal.open();
	}

	// 打开右键菜单
	openMenu(evt: MouseEvent) {
		if (!this.imageElem) return;

		const menu = new Menu();
		menu.addItem((item) => {
			item.setTitle("Open Modal")
				.setIcon("document")
				.onClick(() => this.openModal());
		});
		menu.showAtMouseEvent(evt);
	}
}
