interface IRepetitionSettings {
	repetitions: number;
}
interface IColours {
	stroke: string;
	fill: string;
}

interface IDrawnItem {
	draw();
}

abstract class DrawnItemDecorator<T extends IDrawnItem> implements IDrawnItem {
	public constructor(
		public readonly context: Context,
		public readonly inner: T
	) {}

	public draw() {
		this.inner.draw();
	}

	// and other functions
}
abstract class DrawnItem implements IDrawnItem {
	protected colours: IColours;

	public constructor(protected readonly context: Context) {
		this.colours = context.colours;
	}

	public abstract draw();
}

class DrawnItemRadialRepeatDecorator<
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

class Point {
	public constructor(public readonly x: number, public readonly y: number) {}

	public sub(other: Point) {
		return new Point(this.x - other.x, this.y - other.y);
	}

	public magnitudeSqr() {
		return this.x ** 2 + this.y ** 2;
	}

	public xy(): [number, number] {
		return [this.x, this.y];
	}
}

class Stroke extends DrawnItem {
	protected points: Point[] = [];
	public constructor(context: Context) {
		super(context);
	}

	public addPoint(point: Point) {
		this.points.push(point);
		this.context.canvas.redraw();
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

	public getPoint(index: number) {
		if (index < 0) index += this.points.length;
		return this.points[index];
	}
}

abstract class Tool {
	public constructor(protected readonly context: Context) {}
	public onActivate(): void {}
	public onDeactivate(): void {}
}

interface IUndo {
	undo: () => void;
	redo: () => void;
}

class Undo implements IUndo {
	public constructor(
		public readonly undo: () => void,
		public readonly redo: () => void
	) {}
}

class DrawItemUndo extends Undo {
	public constructor(context: Context, item: IDrawnItem) {
		super(
			() => context.canvas.remove(item),
			() => context.canvas.add(item)
		);
	}
}

class StrokeTool extends Tool {
	private stroke: DrawnItemRadialRepeatDecorator<Stroke>;

	private onMouseDownHandler: EventHandler;
	private onMouseUpHandler: EventHandler;
	private onMouseMoveHandler: EventHandler;
	private onKeyPressHandler: EventHandler;

	public constructor(context: Context) {
		super(context);
	}

	public onMouseDown(event: MouseEvent) {
		const { x, y } = event;

		this.stroke = new DrawnItemRadialRepeatDecorator(
			this.context,
			new Stroke(this.context)
		);
		this.stroke.inner.addPoint(new Point(x, y));
		this.context.canvas.add(this.stroke);
	}

	public onMouseUp(event: MouseEvent) {
		if (this.stroke) {
			this.context.undo.push(new DrawItemUndo(this.context, this.stroke));
		}

		this.stroke = null;
	}

	public onMouseMove(event: MouseEvent) {
		if (this.stroke) {
			const { x, y } = event;
			const point = new Point(x, y);

			if (point.sub(this.stroke.inner.getPoint(-1)).magnitudeSqr() > 5) {
				this.stroke.inner.addPoint(point);
			}
		}
	}

	public onKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.cancel();
		}
	}

	public cancel() {
		if (this.stroke) {
			this.context.canvas.remove(this.stroke);
			this.stroke = null;
		}
	}

	public onActivate() {
		this.onDeactivate();

		this.onMouseDownHandler = this.onMouseDown.bind(this);
		this.onMouseUpHandler = this.onMouseUp.bind(this);
		this.onMouseMoveHandler = this.onMouseMove.bind(this);
		this.onKeyPressHandler = this.onKeyPress.bind(this);

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
class UndoTool extends Tool {
	private onKeyPressHandler: EventHandler;

	public constructor(context: Context) {
		super(context);

		this.onKeyPressHandler = this.onKeyPress.bind(this);
		this.context.keyboard.on('keydown', this.onKeyPressHandler);
	}

	public onKeyPress(event: KeyboardEvent) {
		if (event.ctrlKey) {
			switch (event.key) {
				case 'z':
					this.context.undo.undo();
					break;
				case 'y':
					this.context.undo.redo();
			}
		}
	}

	public onActivate() {
		this.onDeactivate();
	}
}

class FillTool extends Tool {
	private onMouseDownHandler: EventHandler;

	public constructor(context: Context) {
		super(context);
	}

	private onMouseDown(event: MouseEvent) {
		this.fill(event.x, event.y);
	}

	public fill(x: number, y: number) {
		const ctx = this.context.canvas.ctx;
		const data = ctx.getImageData(
			0,
			0,
			ctx.canvas.width,
			ctx.canvas.height
		);
		//TODO: this
	}

	public onActivate() {
		this.onDeactivate();

		this.onMouseDownHandler = this.onMouseDown.bind(this);

		this.context.mouse.on('mousedown', this.onMouseDownHandler);
	}

	public onDeactivate() {
		this.context.mouse.off('mousedown', this.onMouseDownHandler);
	}
}

class Canvas {
	private items: IDrawnItem[] = [];
	public constructor(public readonly ctx: CanvasRenderingContext2D) {}

	public add(item: IDrawnItem) {
		this.items.push(item);
		this.redraw();
	}

	public remove(item: IDrawnItem) {
		const index = this.items.indexOf(item);
		if (index !== -1) {
			this.items.splice(index, 1);
			this.redraw();
		}
	}

	public redraw() {
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.items.forEach(item => item.draw());
	}
}

class Context {
	public mouse: Mouse;
	public keyboard: Keyboard;
	public repetitionSettings: IRepetitionSettings;
	public colours: IColours;
	public canvas: Canvas;
	public undo: UndoHistory;

	public constructor(canvas: HTMLCanvasElement) {
		this.canvas = new Canvas(canvas.getContext('2d'));
		this.mouse = new Mouse(canvas);
		this.keyboard = new Keyboard();
		this.repetitionSettings = { repetitions: 9 };
		this.colours = { stroke: 'black', fill: 'black' };
		this.undo = new UndoHistory();
	}
}

interface IEventEmitter {
	on(type: string, handler: EventHandler): void;
	off(type: string, handler: EventHandler): void;
	one(type: string, handler: EventHandler): void;
}

type EventHandler<T = any> = (event: T) => void;

class EventEmitter implements IEventEmitter {
	private _handlers: { [propName: string]: EventHandler<unknown>[] } = {};

	public one(type: string, handler: EventHandler) {
		this.on(type, function once(event: unknown) {
			handler(event);
			this.off(once);
		});
	}

	public on(type: string, handler: EventHandler) {
		(this._handlers[type] || (this._handlers[type] = [])).push(handler);
	}

	public off(type: string, handler: EventHandler) {
		let index;
		if (
			this._handlers[type] &&
			(index = this._handlers[type].indexOf(handler)) !== -1
		) {
			this._handlers[type].splice(index, 1);
		}
	}

	public trigger<T = any>(type: string, event: T) {
		const handlers = (this._handlers[type] || []).slice();
		if (handlers.length > 0) {
			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
class Mouse extends EventEmitter {
	public constructor(element: HTMLElement) {
		super();

		const events: Array<keyof HTMLElementEventMap> = [
			'mousedown',
			'mouseup',
			'mousemove'
		];

		for (const eventType of events) {
			element.addEventListener(eventType, e => this.trigger(e.type, e));
		}
	}
}
class Keyboard extends EventEmitter {
	public constructor() {
		super();

		const events: Array<keyof HTMLElementEventMap> = ['keydown', 'keyup'];

		for (const eventType of events) {
			document.addEventListener(eventType, e => this.trigger(e.type, e));
		}
	}
}

class UndoHistory extends EventEmitter {
	protected readonly history: IUndo[] = [];
	protected readonly future: IUndo[] = [];

	public push(undo: IUndo) {
		this.history.push(undo);
		this.future.splice(0);
	}

	public undo() {
		if (this.history.length > 0) {
			const undo = this.history.pop();
			undo.undo();
			this.future.push(undo);
			this.trigger('undo', { undo });
		}
	}

	public redo() {
		if (this.future.length > 0) {
			const undo = this.future.pop();
			undo.redo();
			this.history.push(undo);
			this.trigger('redo', { undo });
		}
	}
}

const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
const ctx = new Context(canvas);
const tool = new StrokeTool(ctx);
const undoTool = new UndoTool(ctx);
tool.onActivate();

// function step() {
// 	ctx.canvas.redraw();

// 	setTimeout(step, 50);
// }

// step();
