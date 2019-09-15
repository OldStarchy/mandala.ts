export interface IUndo {
	undo: () => void;
	redo: () => void;
}

export class Undo implements IUndo {
	public constructor(public readonly undo: () => void, public readonly redo: () => void) {}
}
