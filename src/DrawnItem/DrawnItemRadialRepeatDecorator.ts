import { IDrawnItem } from './IDrawnItem';
import { DrawnItemDecorator } from './DrawnItemDecorator';
import { IRepetitionSettings } from '../mandala';
import { Context } from '../Context';
export class DrawnItemRadialRepeatDecorator<
	T extends IDrawnItem
> extends DrawnItemDecorator<T> {
	private repetitionSettings: IRepetitionSettings;
	public constructor(context: Context, inner: T) {
		super(context, inner);
		this.repetitionSettings = context.repetitionSettings;
	}
	public draw() {
		const ctx = this.context.canvas.ctx;
		let reps = this.repetitionSettings.repetitions;
		if (reps > 1) {
			let angle = 0;
			const step = (Math.PI * 2) / reps;
			while (reps-- > 0) {
				ctx.save();
				ctx.translate(400, 400);
				ctx.rotate(angle);
				ctx.translate(-400, -400);
				this.inner.draw();
				ctx.restore();
				angle += step;
			}
		} else {
			this.inner.draw();
		}
	}
}
