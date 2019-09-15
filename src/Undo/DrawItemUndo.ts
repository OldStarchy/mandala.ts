import { Undo } from './Undo';
import { Context } from '../Context';
import { IDrawnItem } from '../DrawnItem/IDrawnItem';
export class DrawItemUndo extends Undo {
	public constructor(context: Context, item: IDrawnItem) {
		super(
			() => context.canvas.remove(item),
			() => context.canvas.add(item)
		);
	}
}
