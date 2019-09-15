import { Undo } from './Undo';
import { Context, IDrawnItem } from '../mandala';
export class DrawItemUndo extends Undo {
	public constructor(context: Context, item: IDrawnItem) {
		super(
			() => context.canvas.remove(item),
			() => context.canvas.add(item)
		);
	}
}
