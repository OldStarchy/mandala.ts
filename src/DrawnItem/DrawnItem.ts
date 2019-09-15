import { Context } from '../Context';
import { IColours } from '../mandala';
import { IDrawnItem } from './IDrawnItem';
export abstract class DrawnItem implements IDrawnItem {
	protected colours: IColours;
	public constructor(protected readonly context: Context) {
		this.colours = context.colours;
	}

	public abstract draw(): void;
}
