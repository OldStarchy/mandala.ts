import { Stroke } from '../DrawnItem/Stroke';
import { Point } from '../Geometry/Point';
import { ClickAndDragTool } from './ClickAndDragTool';

export class StrokeTool extends ClickAndDragTool<Stroke> {
	public beginShape(event: MouseEvent) {
		const { x, y } = event;
		const item = new Stroke(this.context);

		item.addPoint(new Point(x, y));
		return item;
	}

	public drag(event: MouseEvent) {
		const { x, y } = event;
		const item = this.item!;
		const point = new Point(x, y);

		if (item.getPoints().length <= 1) {
			item.addPoint(point);
			return;
		}

		if (event.shiftKey) {
			this.item!.setPoint(-1, point);
		} else {
			if (point.sub(this.item!.getPoint(-1)).magnitudeSqr() > 5) {
				this.item!.addPoint(point);
			}
		}
	}

	public getName() {
		return 'Stroke Tool';
	}
}
