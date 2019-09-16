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
		const item = this.item!;
		const topLeft = item.topLeft;
		let point = new Point(x, y);

		if (event.shiftKey) {
			const size = point.sub(topLeft);

			if (size.x > size.y) {
				point = topLeft.add(new Point(Math.abs(size.y) * Math.sign(size.x), size.y));
			} else {
				point = topLeft.add(new Point(size.x, Math.abs(size.x) * Math.sign(size.y)));
			}
		}

		item.bottomRight = point;
		this.context.canvas.requestRedraw();
	}

	public getName() {
		return 'Circle Tool';
	}
}
