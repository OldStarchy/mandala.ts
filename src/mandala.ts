import { IDrawnItem } from './DrawnItem/IDrawnItem';
import { StrokeTool } from './Tool/StrokeTool';
import { UndoTool } from './Tool/UndoTool';
import { Mouse } from './Input/Mouse';
import { Keyboard } from './Input/Keyboard';
import { UndoHistory } from './Undo/UndoHistory';
import { Tool } from './Tool/Tool';

export interface IRepetitionSettings {
	repetitions: number;
}
export interface IColours {
	stroke: string;
	fill: string;
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

export class Context {
	public readonly mouse: Mouse;
	public readonly keyboard: Keyboard;
	public readonly repetitionSettings: IRepetitionSettings;
	public readonly colours: IColours;
	public readonly canvas: Canvas;
	public readonly undo: UndoHistory;

	public constructor(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d');
		if (ctx === null) {
			throw 'Could not create context 2d';
		}
		this.canvas = new Canvas(ctx);
		this.mouse = new Mouse(canvas);
		this.keyboard = new Keyboard();
		this.repetitionSettings = { repetitions: 9 };
		this.colours = { stroke: 'black', fill: 'black' };
		this.undo = new UndoHistory();
	}
}

export type EventHandler<T = any> = (event: T) => void;

const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
const ctx = new Context(canvas);
const tool = new StrokeTool(ctx);
const undoTool = new UndoTool(ctx);
tool.onActivate();
