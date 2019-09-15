import { IDrawnItem } from './IDrawnItem';
import { Context } from '../Context';
export abstract class DrawnItemDecorator<T extends IDrawnItem>
	implements IDrawnItem {
	public constructor(
		public readonly context: Context,
		public readonly inner: T
	) {}
	public draw() {
		this.inner.draw();
	}
}
