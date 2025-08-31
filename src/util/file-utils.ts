import { App, TFile, Notice } from "obsidian";
import { PageData } from "src/data/page-data";

export class FileUtil {
	/**
	 * 从 TFile 读取并解析 PageData（保留 YAML frontmatter）
	 */
	static async loadPageData(app: App, file: TFile): Promise<PageData> {
		try {
			const data = await app.vault.read(file);
			let content = data;
			// 提取 YAML frontmatter
			const yamlMatch = /^---\n([\s\S]*?)\n---\n?/.exec(data);
			if (yamlMatch) {
				content = data.slice(yamlMatch[0].length);
			}
			const json = JSON.parse(content);
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
			let yaml = "";
			// 提取 YAML frontmatter
			const yamlMatch = /^---\n([\s\S]*?)\n---\n?/.exec(data);
			if (yamlMatch) {
				yaml = yamlMatch[0]; // 包括前后的 ---
			}
			const jsonStr = pageData.toJSON();
			const newContent = yaml + "\n" + jsonStr;
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
