import { Circle } from '../DrawnItem/Circle';
import { Point } from '../Geometry/Point';
import { ClickAndDragTool } from './ClickAndDragTool';

export class CircleTool extends ClickAndDragTool<Circle> {
	public beginShape(event: MouseEvent) {
		const { x, y } = event;
		const item = new Circle(this.context, new Point(x, y), new Point(x, y));

		return item;
	}

	public drag(event: MouseEvent) {
		const { x, y } = event;
		const point = new Point(x, y);

		this.item!.bottomRight = point;
		this.context.canvas.requestRedraw();
	}
}
