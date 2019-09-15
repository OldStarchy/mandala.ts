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

export type EventHandler<T = any> = (event: T) => void;

class ToolManager {
	private tools: Tool[] = [];
	private activeTool: number | null = null;

	public addTool(tool: Tool) {
		this.tools.push(tool);
	}

	public deactivateTool() {
		if (this.activeTool !== null) {
			this.tools[this.activeTool].onDeactivate();
			this.activeTool = null;
		}
	}

	public activateTool(tool: number) {
		this.deactivateTool();
		this.activeTool = tool;
		this.tools[this.activeTool].onActivate();
	}

	public allTools() {
		return this.tools.slice();
	}
}

type Command = (context: Context) => void;

class CommandManager {
	private readonly commands: { [id: string]: Command } = {};

	public constructor(private readonly context: Context) {}

	public register(id: string, command: Command) {
		if (this.commands[id]) {
			throw `Duplicate command id "${id}"`;
		}

		this.commands[id] = command;
	}

	public run(id: string) {
		if (!this.commands[id]) {
			throw `Command "${id}" does not exist`;
		}

		this.commands[id](this.context);
	}
}

interface IShortcut {
	matches(event: KeyboardEvent): boolean;
	equals(other: IShortcut): boolean;
}

class ShortcutStroke implements IShortcut {
	public constructor(
		public readonly key: string,
		public readonly ctrl: boolean = false,
		public readonly shift: boolean = false,
		public readonly alt: boolean = false
	) {}

	public equals(other: IShortcut): boolean {
		if (other instanceof ShortcutStroke) {
			return (
				this.key === other.key &&
				this.ctrl === other.ctrl &&
				this.shift === other.shift &&
				this.alt === other.alt
			);
		}

		return false;
	}

	public matches(event: KeyboardEvent) {
		if (this.key !== event.key) return false;
		if (this.ctrl && !event.ctrlKey) return false;
		if (this.shift && !event.shiftKey) return false;
		if (this.alt && !event.altKey) return false;

		return true;
	}

	public toString() {
		return [
			this.alt ? 'alt' : null,
			this.ctrl ? 'ctrl' : null,
			this.shift ? 'shift' : null,
			this.key
		]
			.filter(v => v !== null)
			.join(' + ');
	}
}

type Shortcut = ShortcutStroke; //No chorded shortcuts yet

const initUndo = (context: Context) => {
	context.command.register('edit.undo', () => context.undo.undo());
	context.command.register('edit.redo', () => context.undo.redo());

	context.shortcut.register(new ShortcutStroke('z', true), 'edit.undo');
	context.shortcut.register(new ShortcutStroke('y', true), 'edit.redo');
};

class ShortcutManager {
	private readonly shortcuts: {
		input: Shortcut;
		command: string;
	}[] = [];

	private onKeyDownHandler: EventHandler;

	public constructor(private context: Context) {
		this.onKeyDownHandler = this.onKeyDown.bind(this);

		context.keyboard.on('keydown', this.onKeyDownHandler);
	}

	private onKeyDown(event: KeyboardEvent) {
		const sc = this.getShortcutForEvent(event);

		if (sc) {
			this.context.command.run(sc.command);
		}
	}

	public register(input: Shortcut, command: string) {
		for (const sc of this.shortcuts) {
			if (sc.input.equals(input)) {
				throw `Duplicate shortcut input "${input.toString()}"`;
			}
		}

		this.shortcuts.push({
			input,
			command
		});
	}

	public getShortcutForEvent(event: KeyboardEvent) {
		return this.shortcuts.find(sc => sc.input.matches(event)) || null;
	}
}

const initToolbarHotkeys = (context: Context) => {
	for (let i = 0; i < 9; i++) {
		context.command.register(`tool.activate.${i + 1}`, () => {
			if (i < context.tools.allTools().length) {
				context.tools.activateTool(i);
			} else {
				context.tools.deactivateTool();
			}
		});

		context.shortcut.register(
			new ShortcutStroke(`${i + 1}`),
			`tool.activate.${i + 1}`
		);
	}
};

const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
const ctx = new Context(canvas);
ctx.tools.addTool(new StrokeTool(ctx));
initUndo(ctx);
initToolbarHotkeys(ctx);
