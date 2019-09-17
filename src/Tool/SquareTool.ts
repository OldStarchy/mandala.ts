import { Square } from '../DrawnItem/Square';
import { Point } from '../Geometry/Point';
import { MyMouseEvent } from '../Input/MyMouseEvent';
import { ClickAndDragTool } from './ClickAndDragTool';

export class SquareTool extends ClickAndDragTool<Square> {
	public beginShape(event: MyMouseEvent) {
		const { x, y } = event;
		const item = new Square(this.context, new Point(x, y), new Point(x, y));

		return item;
	}

	public drag(event: MyMouseEvent) {
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
		return 'Square Tool';
	}
}
