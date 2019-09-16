import { Context } from '../Context';
import { Point } from '../Geometry/Point';
import { DrawnItem } from './DrawnItem';

export class Square extends DrawnItem {
	public constructor(context: Context, public topLeft: Point, public bottomRight: Point) {
		super(context);
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.colours.stroke;
		ctx.fillStyle = this.colours.fill;

		const [w, h] = this.bottomRight.sub(this.topLeft).xy();

		ctx.strokeRect(this.topLeft.x, this.topLeft.y, w, h);
	}
}
