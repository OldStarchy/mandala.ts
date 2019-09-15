import { Mouse } from './Input/Mouse';
import { Keyboard } from './Input/Keyboard';
import { UndoHistory } from './Undo/UndoHistory';
import { ToolManager } from './Tool/ToolManager';
import { CommandManager } from './Command/CommandManager';
import { ShortcutManager } from './Shortcut/ShortcutManager';
import { IRepetitionSettings, IColours } from './mandala';
import { Canvas } from './Canvas';
export class Context {
	public readonly mouse: Mouse;
	public readonly keyboard: Keyboard;
	public readonly repetitionSettings: IRepetitionSettings;
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
		this.canvas = new Canvas(ctx);
		this.mouse = new Mouse(canvas);
		this.keyboard = new Keyboard();
		this.repetitionSettings = { repetitions: 9 };
		this.colours = { stroke: 'black', fill: 'black' };
		this.undo = new UndoHistory();
		this.tools = new ToolManager();
		this.command = new CommandManager(this);
		//Must come after keyboard
		this.shortcut = new ShortcutManager(this);
	}
}
