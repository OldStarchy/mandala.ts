import { Context } from './Context';
import { IDrawnItem } from './DrawnItem/IDrawnItem';
import { Modifier } from './Modifier';

export class Canvas {
	private items: IDrawnItem[] = [];
	private stagingItems: IDrawnItem[] = [];
	private redrawTimeout: number | null = null;
	public modifiers: Modifier[] = [];

	public constructor(private context: Context, public readonly ctx: CanvasRenderingContext2D) {}

	public stage(item: IDrawnItem) {
		this.stagingItems.push(this.modifiers.reduce((i, m) => m.modify(i), item));
		this.redraw();
	}

	public commit() {
		const items = this.stagingItems;
		const action = {
			undo: () => {
				items.forEach(item => this.remove(item));
				this.requestRedraw();
			},
			redo: () => {
				items.forEach(item => this.add(item));
				this.requestRedraw();
			},
		};
		action.redo();
		this.context.undo.push(action);

		this.stagingItems = [];
	}

	public drop() {
		this.stagingItems = [];
		this.requestRedraw();
	}

	public add(item: IDrawnItem) {
		this.items.push(item);
	}

	public remove(item: IDrawnItem) {
		const index = this.items.indexOf(item);

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	public requestRedraw() {
		if (this.redrawTimeout == null) {
			this.redrawTimeout = window.setTimeout(this.redraw.bind(this), 10);
		}
	}

	public redraw() {
		this.redrawTimeout = null;
		const t0 = performance.now();

		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.items.forEach(item => item.draw(this.ctx));
		this.stagingItems.forEach(item => item.draw(this.ctx));

		const t1 = performance.now();

		console.log(`Call to canvas.redraw took ${t1 - t0} milliseconds.`);
	}
}
