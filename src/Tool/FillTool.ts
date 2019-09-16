// import { Context } from '../Context';
// import { EventHandler } from '../EventEmitter/EventEmitter';
// import { Tool } from './Tool';

// class FillTool extends Tool {
// 	private onMouseDownHandler: EventHandler<MouseEvent>;

// 	public constructor(context: Context) {
// 		super(context);
// 		this.onMouseDownHandler = this.onMouseDown.bind(this);
// 	}

// 	private onMouseDown(event: MouseEvent) {
// 		this.fill(event.x, event.y);
// 	}

// 	public fill(x: number, y: number) {
// 		const ctx = this.context.canvas.ctx;
// 		const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
// 		//TODO: this
// 	}

// 	public onActivate() {
// 		this.onDeactivate();
// 		this.context.mouse.on('mousedown', this.onMouseDownHandler);
// 	}

// 	public onDeactivate() {
// 		this.context.mouse.off('mousedown', this.onMouseDownHandler);
// 	}

// 	public getName() {
// 		return 'Fill Tool';
// 	}
// }
