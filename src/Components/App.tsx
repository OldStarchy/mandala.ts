import * as React from 'react';
import { Canvas } from '../Canvas';
import { CommandManager } from '../Command/CommandManager';
import { Keyboard } from '../Input/Keyboard';
import { Mouse } from '../Input/Mouse';
import { IColours } from '../mandala';
import { RadialRepeatModifier } from '../RadialRepeatModifier';
import { ShortcutManager } from '../Shortcut/ShortcutManager';
import { CircleTool } from '../Tool/CircleTool';
import { SquareTool } from '../Tool/SquareTool';
import { StrokeTool } from '../Tool/StrokeTool';
import { ToolManager } from '../Tool/ToolManager';
import { UndoHistory } from '../Undo/UndoHistory';
import { AppContext } from './AppContext';
import { Toolbar } from './Toolbar';

const canvasStyle: React.CSSProperties = {
	border: '1px solid black',
};

export class App extends React.Component {
	public readonly mouse: Mouse;
	public readonly keyboard: Keyboard;
	public readonly colours: IColours;
	public readonly canvas: Canvas;
	public readonly undo: UndoHistory;
	public readonly tools: ToolManager;
	public readonly command: CommandManager;
	public readonly shortcut: ShortcutManager;

	constructor(props: {}) {
		super(props);
		this.canvas = new Canvas(this);
		this.mouse = new Mouse();
		this.keyboard = new Keyboard(document);
		this.colours = { stroke: 'black', fill: 'black' };
		this.undo = new UndoHistory();
		this.tools = new ToolManager();
		this.command = new CommandManager(this);
		//Must come after keyboard
		this.shortcut = new ShortcutManager(this);

		this.init();
	}

	private init() {
		this.canvas.modifiers.push(new RadialRepeatModifier(this, { repetitions: 9 }));
		this.initTools();
		this.initUndo();
		this.initToolbarHotkeys();
	}

	private onCanvasReady(canvas: HTMLCanvasElement) {
		this.mouse.setElement(canvas);
		this.canvas.setContext(canvas.getContext('2d')!);
	}

	public render() {
		return (
			<div className="mandala-app">
				<AppContext.Provider value={this}>
					<canvas style={canvasStyle} width={800} height={800} ref={this.onCanvasReady.bind(this)} />
					<Toolbar />
				</AppContext.Provider>
			</div>
		);
	}

	protected initTools() {
		this.tools.addTool(new StrokeTool(this));
		this.tools.addTool(new CircleTool(this));
		this.tools.addTool(new SquareTool(this));
	}

	protected initUndo() {
		this.command.register('edit.undo', () => this.undo.undo());
		this.command.register('edit.redo', () => this.undo.redo());
		this.shortcut.register('ctrl+z', 'edit.undo');
		this.shortcut.register('ctrl+y', 'edit.redo');
	}

	protected initToolbarHotkeys() {
		for (let i = 0; i < 9; i++) {
			this.command.register(`tool.activate.${i + 1}`, () => {
				if (i < this.tools.allTools().length) {
					this.tools.activateTool(i);
				} else {
					this.tools.activateTool(null);
				}
			});
			this.shortcut.register(`${i + 1}`, `tool.activate.${i + 1}`);
		}
	}
}
