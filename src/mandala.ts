import { StrokeTool } from './Tool/StrokeTool';
import { UndoTool } from './Tool/UndoTool';
import { LineTool } from './Tool/LineTool';
import { ShortcutStroke } from './ShortcutStroke';
import { Context } from './Context';

export interface IRepetitionSettings {
	repetitions: number;
}
export interface IColours {
	stroke: string;
	fill: string;
}

export type EventHandler<T = any> = (event: T) => void;

class App {
	private readonly context: Context;

	constructor(canvas: HTMLCanvasElement) {
		this.context = new Context(canvas);

		this.initTools();
		this.initUndo();
		this.initToolbarHotkeys();
	}

	protected initTools() {
		this.context.tools.addTool(new StrokeTool(this.context));
		this.context.tools.addTool(new LineTool(this.context));
	}

	protected initUndo() {
		this.context.command.register('edit.undo', () =>
			this.context.undo.undo()
		);
		this.context.command.register('edit.redo', () =>
			this.context.undo.redo()
		);

		this.context.shortcut.register('ctrl+z', 'edit.undo');
		this.context.shortcut.register('ctrl+y', 'edit.redo');
	}

	protected initToolbarHotkeys() {
		for (let i = 0; i < 9; i++) {
			this.context.command.register(`tool.activate.${i + 1}`, () => {
				if (i < this.context.tools.allTools().length) {
					this.context.tools.activateTool(i);
				} else {
					this.context.tools.activateTool(null);
				}
			});

			this.context.shortcut.register(
				`${i + 1}`,
				`tool.activate.${i + 1}`
			);
		}
	}
}

const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
new App(canvas);
