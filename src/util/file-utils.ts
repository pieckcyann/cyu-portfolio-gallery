import { App, TFile, Notice } from "obsidian";
import { PageData } from "src/data/page-data";
import matter from "gray-matter";

export class FileUtil {
	/**
	 * 从 TFile 读取并解析 PageData（保留 YAML frontmatter）
	 */
	static async loadPageData(app: App, file: TFile): Promise<PageData> {
		try {
			const data = await app.vault.read(file);
			const { content } = matter(data); // 自动提取 frontmatter
			const json = JSON.parse(content.trim()); // content 已经是正文部分
			return PageData.fromJSON(json);
		} catch (e) {
			new Notice("❌ 无法解析画廊文件，已返回空页面");
			console.error("FileUtil.loadPageData error:", e);
			return new PageData([]);
		}
	}

	/**
	 * 将 PageData 保存到 TFile（保留 YAML frontmatter）
	 */
	static async savePageData(
		app: App,
		file: TFile,
		pageData: PageData
	): Promise<void> {
		try {
			const data = await app.vault.read(file);
			const { content, data: frontmatter } = matter(data); // 读取原有 frontmatter
			const yaml = Object.keys(frontmatter).length
				? matter.stringify("", frontmatter).split("\n")[0] === "---"
					? matter.stringify("", frontmatter).replace(/^\n/, "")
					: matter.stringify("", frontmatter)
				: "";
			const jsonStr = JSON.stringify(pageData.toJSON(), null, 2);
			const newContent = yaml ? yaml + "\n" + jsonStr : jsonStr;
			await app.vault.modify(file, newContent);
			new Notice("✅ 画廊已保存");
		} catch (e) {
			new Notice("❌ 保存失败");
			console.error("FileUtil.savePageData error:", e);
		}
	}

	/**
	 * 创建一个新的空画廊文件
	 */
	static async createEmptyPage(app: App, path: string): Promise<TFile> {
		const emptyPage = new PageData([]);
		const content = JSON.stringify(emptyPage.toJSON(), null, 2);
		return await app.vault.create(path, content);
	}
}
