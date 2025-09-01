import { Block, IntroContent, WorksContent } from "src/data/page-data";
import { renderMD } from "src/util/utils";
import { text } from "stream/consumers";
import { ProGalleryView } from "./portfolio-gallery";
import { MediaData, SrcMediaData } from "src/data/work-dsata";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { Notice } from "obsidian";
import { ImageMenuModal } from "./Image-menu-modal";

export const createIntroBlock = (
	block: Block,
	blockEl: HTMLDivElement,
	view: ProGalleryView
) => {
	const container = blockEl;
	const id = block.id;
	const intro: IntroContent = block.content as IntroContent;

	// 父容器
	container.setAttribute("id", id);
	container.addClass("Intro");

	// 头图
	container
		.createDiv("banner")
		.setAttribute(
			"style",
			`background: url('${intro.banner[0]}') center/cover no-repeat;`
		);

	// 头像
	const avatarEl = container.createDiv("avatar");
	for (const avatar of intro.avatars) {
		avatarEl.createEl("img").setAttribute("src", avatar);
	}

	// 名字
	for (const name of intro.name) {
		container.createSpan({ cls: "cpb", text: name });
	}

	const officialLinkEl = container.createDiv("official-link");
	officialLinkEl.createSpan("name");

	const unofficialLinkEl = container.createDiv("unofficial-link");
};

export const createMdBlock = (
	block: Block,
	blockEl: HTMLDivElement,
	view: ProGalleryView
) => {
	const mdContent = block.content as string;
	const mdElement = blockEl.createDiv("ProGallery-MD");
	renderMD(mdContent, mdElement, view);
};

export const createWorksBlock = (
	block: Block,
	blockEl: HTMLDivElement,
	view: ProGalleryView
) => {
	const container = blockEl;
	const id = block.id;
	const intro: WorksContent = block.content as WorksContent;

	// 父容器
	container.setAttribute("id", id);
	container.addClass("Works");
	container.addClass(
		intro.config?.masonry === "col" ? "msnry-col" : "msnry-row"
	);

	// MediaData.fromWorksContent(intro).forEach((srcData) => {
	// 	const item = createImage(srcData, container);
	// 	if (!item) return;

	// 	imagesLoaded(item, () => {
	// 		item.classList.remove("loading-mask");
	// 		item.classList.add("is-visible");
	// 		msnry.appended([item]);
	// 		msnry.layout();
	// 	});
	// });

	const items: HTMLDivElement[] = [];

	// 先创建所有图片 DOM
	MediaData.fromWorksContent(intro, view.app).forEach((srcData) => {
		const item = createImage(srcData, container, view);
		if (item) items.push(item);
	});

	// 初始化 Masonry
	const msnry = new Masonry(container, {
		itemSelector: ".item",
		columnWidth: ".item",
		gutter: 8,
		transitionDuration: "0.8s",
		horizontalOrder: true, // 保证按 DOM 顺序布局
	});

	// 等待所有图片加载完成
	imagesLoaded(container, () => {
		items.forEach((item) => {
			item.classList.remove("loading-mask");
			item.classList.add("is-visible");
		});

		msnry.layout();
	});

	// imagesLoaded(container, () => {
	// 	const msnry = new Masonry(container, {
	// 		itemSelector: ".item",
	// 		columnWidth: ".item",
	// 		gutter: 8,
	// 		transitionDuration: "0.8s",
	// 		horizontalOrder: intro.config?.masonry === "row",
	// 	});

	// 	container.querySelectorAll(".item").forEach((item) => {
	// 		item.removeClass("loading-mask"); // 移除所有加载遮罩
	// 		item.classList.add("is-visible");
	// 		msnry.appended([item]);
	// 	});

	// 	msnry.layout();

	// 	new Notice("图片加载完成，Masonry 初始化完成");
	// 	console.log("图片加载完成，Masonry 初始化完成");
	// });
};

const createImage = (
	itemData: SrcMediaData,
	blockEl: HTMLDivElement,
	view: ProGalleryView
): HTMLDivElement | undefined => {
	const container = blockEl.createDiv("item");
	const image_elem = container.createEl("img");

	const image_data = itemData.image_data;
	if (!image_data) return;

	const oriSrc = image_data.thumb_link;
	const fontSrc = oriSrc.split("|")[0];
	const backSrc = oriSrc.split("|")[1];
	const captionText = image_data.caption_text;

	container.addClass("grid-item");
	container.addClass("loading-mask"); // 还未加载完成
	container.setAttribute("data-src", fontSrc);
	container.setAttribute("data-thumb", fontSrc);
	container.setAttribute("data-sub-html", captionText);
	// container.setAttribute("data-name", itemData.name);
	// container.setAttribute("data-folder", itemData.name);

	image_elem.addClass("image");
	image_elem.setAttribute("data-src", fontSrc); // 懒加载
	// imageElem.addEventListener("contextmenu", setContextMenuEventListener);
	// imageElem.setAttribute("src", "placeholder.jpg"); // 可设置占位图片
	image_elem.setAttribute("src", image_data.thumb_link);
	image_elem.setAttribute("loading", "lazy");

	const menuModal = new ImageMenuModal(view.app);
	image_elem.addEventListener("contextmenu", (evt: MouseEvent) => {
		evt.preventDefault();
		menuModal.setImageElem(image_elem).openMenu(evt);
	});

	// 卡片
	if (oriSrc.includes("|")) {
		container.createEl("div", { attr: { id: "card-corner-mark" } });
		// setFlipCardEventListener(imageElem, fontSrc, backSrc);
	}

	// 未托管
	// if (nothosted === "true" && checkIsNotHosted(fontSrc)) {
	// 	container.createEl("div", { attr: { id: "unhosted" } });
	// }

	// setConfigInfo(itemData.commentText, container);

	// preloadImage(fontSrc);

	// preloadItems.push({ el: image, url: fontSrc });
	// preloadItems.push({ el: image, url: backSrc });
	// imgEle.setAttribute("style", `background-image: url('${fontSrc}');`);
	// if (!isImageLoadedFromCache(oriSrc)) return;

	return container;
};
