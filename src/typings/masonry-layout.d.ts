declare module "masonry-layout" {
	export default class Masonry {
		constructor(container: Element | string, options?: any);

		masonry(): void;
		masonry(eventName: string, listener: any): void;

		// layout
		layout(): void;
		layoutItems(items: any[], isStill?: boolean): void;
		stamp(elements: any[]): void;
		unstamp(elements: any[]): void;

		// add and remove items
		appended(elements: any[]): void;
		prepended(elements: any[]): void;
		addItems(elements: any[]): void;
		remove(elements: any[]): void;

		// events
		on(eventName: string, listener: any): void;
		off(eventName: string, listener: any): void;
		once(eventName: string, listener: any): void;

		// utilities
		reloadItems(): void;
		destroy(): void;
		getItemElements(): any[];
		data(element: Element): Masonry;
	}
}
