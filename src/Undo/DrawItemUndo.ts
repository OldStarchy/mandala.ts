import { Context } from '../Context';
import { IDrawnItem } from '../DrawnItem/IDrawnItem';
import { Undo } from './Undo';

export class DrawItemUndo extends Undo {
	public constructor(context: Context, item: IDrawnItem) {
		super(() => context.canvas.remove(item), () => context.canvas.add(item));
	}
}
