import { EventEmitter } from '../EventEmitter/EventEmitter';
import { IUndo } from './Undo';
export class UndoHistory extends EventEmitter {
	protected readonly history: IUndo[] = [];
	protected readonly future: IUndo[] = [];
	public push(undo: IUndo) {
		this.history.push(undo);
		this.future.splice(0);
	}

	public undo() {
		if (this.history.length > 0) {
			const undo = this.history.pop()!;
			undo.undo();
			this.future.push(undo);
			this.trigger('undo', { undo });
		}
	}

	public redo() {
		if (this.future.length > 0) {
			const undo = this.future.pop()!;
			undo.redo();
			this.history.push(undo);
			this.trigger('redo', { undo });
		}
	}
}
