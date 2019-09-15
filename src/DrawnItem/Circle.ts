import { Context } from '../Context';
import { Point } from '../Geometry/Point';
import { DrawnItem } from './DrawnItem';

export class Circle extends DrawnItem {
	public constructor(context: Context, public topLeft: Point, public bottomRight: Point) {
		super(context);
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = this.colours.stroke;
		ctx.fillStyle = this.colours.fill;

		const size = this.bottomRight.sub(this.topLeft).abs();
		const [w, h] = size.xy();
		const cx = (this.topLeft.x + this.bottomRight.x) / 2;
		const cy = (this.topLeft.y + this.bottomRight.y) / 2;

		ctx.beginPath();
		ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
		ctx.stroke();
	}
}
