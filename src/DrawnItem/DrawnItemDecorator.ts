import { IDrawnItem } from './IDrawnItem';

export abstract class DrawnItemDecorator<T extends IDrawnItem> implements IDrawnItem {
	public constructor(public readonly inner: T) {}

	public draw(ctx: CanvasRenderingContext2D) {
		this.inner.draw(ctx);
	}
}
