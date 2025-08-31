import { Component, MarkdownRenderer } from "obsidian";
import { ProGalleryView } from "src/view/portfolio-gallery";

export function generateBlockId(): string {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, "0");
	const timestamp =
		now.getFullYear().toString() +
		pad(now.getMonth() + 1) +
		pad(now.getDate()) +
		pad(now.getHours()) +
		pad(now.getMinutes()) +
		pad(now.getSeconds());
	return `blk-${timestamp}`;
}

export function renderMD(
	mdContent: string,
	mdElement: HTMLElement,
	component: Component
) {
	const view = component as ProGalleryView;
	MarkdownRenderer.render(
		view.app,
		mdContent,
		mdElement,
		view.file?.path ?? "",
		view
	);
}
