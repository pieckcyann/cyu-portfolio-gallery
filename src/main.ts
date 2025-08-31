import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
	WorkspaceLeaf,
} from "obsidian";
import {
	ProGalleryView,
	VIEW_TYPE_PRO_GALLERY,
} from "./view/portfolio-gallery";

// Remember to rename these classes and interfaces!

interface ProGalleryPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ProGalleryPluginSettings = {
	mySetting: "default",
};

export default class ProGalleryPlugin extends Plugin {
	settings: ProGalleryPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ProGallerySettingTab(this.app, this));

		await this.registerView(
			VIEW_TYPE_PRO_GALLERY,
			(leaf: WorkspaceLeaf) => new ProGalleryView(leaf, this)
		);

		window.setTimeout(() => {
			this.registerEvent(
				this.app.workspace.on("file-open", async (file) => {
					await this.handleFileOpen(file);
				})
			);

			// 插件加载完成后，检查一次当前文件
			this.handleFileOpen(this.app.workspace.getActiveFile());
		}, 0);
	}

	private async handleFileOpen(file: TFile | null) {
		if (!file) return;
		if (!file.basename.endsWith(".cyu") || file.extension !== "md") return;

		const leaf = this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf;
		if (!leaf) return;

		await leaf.setViewState({
			type: VIEW_TYPE_PRO_GALLERY,
			state: { file: file.path },
			active: true,
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ProGallerySettingTab extends PluginSettingTab {
	plugin: ProGalleryPlugin;

	constructor(app: App, plugin: ProGalleryPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
