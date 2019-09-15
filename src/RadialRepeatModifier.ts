import { Context } from './Context';
import { DrawnItemDecorator } from './DrawnItem/DrawnItemDecorator';
import { IDrawnItem } from './DrawnItem/IDrawnItem';
import { Modifier } from './Modifier';

export interface IRadialRepeatSettings {
	repetitions: number;
}

export class DrawnItemRadialRepeatDecorator<T extends IDrawnItem> extends DrawnItemDecorator<T> {
	public constructor(protected settings: IRadialRepeatSettings, inner: T) {
		super(inner);
	}

	public draw(ctx: CanvasRenderingContext2D) {
		let reps = this.settings.repetitions;

		if (reps > 1) {
			let angle = 0;
			const step = (Math.PI * 2) / reps;
			while (reps-- > 0) {
				ctx.save();
				ctx.translate(400, 400);
				ctx.rotate(angle);
				ctx.translate(-400, -400);
				this.inner.draw(ctx);
				ctx.restore();
				angle += step;
			}
		} else {
			this.inner.draw(ctx);
		}
	}
}

export class RadialRepeatModifier extends Modifier {
	public constructor(protected readonly context: Context, public settings: IRadialRepeatSettings) {
		super();
	}

	public modify(item: IDrawnItem) {
		return new DrawnItemRadialRepeatDecorator(this.settings, item);
	}
}
