import { MouseState } from './MouseState';
export class MyMouseEvent extends MouseState {
	public altKey = false;
	public ctrlKey = false;
	public shiftKey = false;
	constructor(public readonly inner: MouseEvent) {
		super();
	}
}
