import { Context } from '../Context';
import { Point } from '../Geometry/Point';
import { DrawnItem } from './DrawnItem';

export class Stroke extends DrawnItem {
	protected points: Point[] = [];

	public constructor(context: Context) {
		super(context);
	}

	public addPoint(point: Point) {
		this.points.push(point);
		this.context.canvas.redraw();
	}

	public setPoint(index: number, point: Point) {
		if (index < 0) index += this.points.length;
		this.points[index] = point;
		this.context.canvas.redraw();
	}

	public getPoint(index: number) {
		if (index < 0) index += this.points.length;
		return this.points[index];
	}

	public draw() {
		const ctx = this.context.canvas.ctx;
		ctx.strokeStyle = this.colours.stroke;
		ctx.fillStyle = this.colours.fill;
		if (this.points.length == 1) {
			const p0 = this.points[0];
			ctx.fillRect(p0.x, p0.y, 1, 1);
			return;
		}
		ctx.beginPath();
		ctx.moveTo(...this.points[0].xy());
		for (let i = 1; i < this.points.length; i++) {
			ctx.lineTo(...this.points[i].xy());
		}
		ctx.stroke();
	}
}
