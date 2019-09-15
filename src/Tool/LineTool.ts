import { Stroke } from '../DrawnItem/Stroke';
import { Point } from '../Geometry/Point';
import { ClickAndDragTool } from './ClickAndDragTool';

export class LineTool extends ClickAndDragTool<Stroke> {
	public beginShape(event: MouseEvent) {
		const { x, y } = event;
		const item = new Stroke(this.context);

		item.addPoint(new Point(x, y));
		item.addPoint(new Point(x, y));

		return item;
	}

	public drag(event: MouseEvent) {
		const { x, y } = event;
		const point = new Point(x, y);

		this.item!.setPoint(-1, point);
		this.context.canvas.requestRedraw();
	}
}
