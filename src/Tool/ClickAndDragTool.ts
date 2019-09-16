import { App } from '../Components/App';
import { IDrawnItem } from '../DrawnItem/IDrawnItem';
import { EventHandler } from '../EventEmitter/EventEmitter';
import { Tool } from './Tool';

export abstract class ClickAndDragTool<T extends IDrawnItem> extends Tool {
	protected item: T | null = null;
	protected onMouseDownHandler: EventHandler<MouseEvent>;
	protected onMouseUpHandler: EventHandler<MouseEvent>;
	protected onMouseMoveHandler: EventHandler<MouseEvent>;
	protected onKeyPressHandler: EventHandler<KeyboardEvent>;

	public constructor(context: App) {
		super(context);
		this.onMouseDownHandler = this.onMouseDown.bind(this);
		this.onMouseUpHandler = this.onMouseUp.bind(this);
		this.onMouseMoveHandler = this.onMouseMove.bind(this);
		this.onKeyPressHandler = this.onKeyPress.bind(this);
	}

	public abstract beginShape(event: MouseEvent): T;
	public abstract drag(event: MouseEvent): void;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public endShape(event: MouseEvent) {}

	public cancel() {
		if (this.item) {
			this.context.canvas.drop();
			this.item = null;
		}
	}

	public onMouseDown(event: MouseEvent) {
		this.item = this.beginShape(event);
		this.context.canvas.stage(this.item);
	}

	public onMouseUp(event: MouseEvent) {
		if (this.item) {
			this.endShape(event);
			this.context.canvas.commit();
			this.item = null;
		}
	}

	public onMouseMove(event: MouseEvent) {
		if (this.item) {
			this.drag(event);
		}
	}

	public onKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.cancel();
		}
	}

	public onActivate() {
		this.onDeactivate();
		this.context.mouse.on('mousedown', this.onMouseDownHandler);
		this.context.mouse.on('mouseup', this.onMouseUpHandler);
		this.context.mouse.on('mousemove', this.onMouseMoveHandler);
		this.context.keyboard.on('keydown', this.onKeyPressHandler);
	}

	public onDeactivate() {
		this.cancel();
		this.context.mouse.off('mousedown', this.onMouseDownHandler);
		this.context.mouse.off('mouseup', this.onMouseUpHandler);
		this.context.mouse.off('mousemove', this.onMouseMoveHandler);
		this.context.keyboard.off('keydown', this.onKeyPressHandler);
	}
}
