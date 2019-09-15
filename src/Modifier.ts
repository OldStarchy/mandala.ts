import { IDrawnItem } from './DrawnItem/IDrawnItem';
export abstract class Modifier {
	public abstract modify(item: IDrawnItem): IDrawnItem;
}
