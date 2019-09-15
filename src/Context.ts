import { Canvas } from './Canvas';
import { CommandManager } from './Command/CommandManager';
import { Keyboard } from './Input/Keyboard';
import { Mouse } from './Input/Mouse';
import { IColours } from './mandala';
import { ShortcutManager } from './Shortcut/ShortcutManager';
import { ToolManager } from './Tool/ToolManager';
import { UndoHistory } from './Undo/UndoHistory';

export class Context {
	public readonly mouse: Mouse;
	public readonly keyboard: Keyboard;
	public readonly colours: IColours;
	public readonly canvas: Canvas;
	public readonly undo: UndoHistory;
	public readonly tools: ToolManager;
	public readonly command: CommandManager;
	public readonly shortcut: ShortcutManager;

	public constructor(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d');
		if (ctx === null) {
			throw 'Could not create context 2d';
		}
		this.canvas = new Canvas(this, ctx);
		this.mouse = new Mouse(canvas);
		this.keyboard = new Keyboard();
		this.colours = { stroke: 'black', fill: 'black' };
		this.undo = new UndoHistory();
		this.tools = new ToolManager();
		this.command = new CommandManager(this);
		//Must come after keyboard
		this.shortcut = new ShortcutManager(this);
	}
}
