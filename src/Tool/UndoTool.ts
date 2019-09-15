import { Tool } from './Tool';
import { EventHandler, Context } from '../mandala';
export class UndoTool extends Tool {
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
