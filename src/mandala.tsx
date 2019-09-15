import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComponent } from './Components/AppComponent';
import { Context } from './Context';
import { RadialRepeatModifier } from './RadialRepeatModifier';
import { LineTool } from './Tool/LineTool';
import { StrokeTool } from './Tool/StrokeTool';

export interface IColours {
	stroke: string;
	fill: string;
}

class App {
	private readonly context: Context;

	constructor(canvas: HTMLCanvasElement) {
		this.context = new Context(canvas);

		this.context.canvas.modifiers.push(new RadialRepeatModifier(this.context, { repetitions: 9 }));
		this.initTools();
		this.initUndo();
		this.initToolbarHotkeys();
	}

	protected initTools() {
		this.context.tools.addTool(new StrokeTool(this.context));
		this.context.tools.addTool(new LineTool(this.context));
	}

	protected initUndo() {
		this.context.command.register('edit.undo', () => this.context.undo.undo());
		this.context.command.register('edit.redo', () => this.context.undo.redo());

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

			this.context.shortcut.register(`${i + 1}`, `tool.activate.${i + 1}`);
		}
	}
}

ReactDOM.render(<AppComponent />, document.getElementsByClassName('app-container')[0]);

const canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
new App(canvas);
