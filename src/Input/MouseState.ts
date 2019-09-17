import { ButtonState } from './ButtonState';
import { MouseButton } from './MouseButton';

export class MouseState {
	public buttons: {
		[propName: number]: ButtonState;
	} = {};

	public x = 0;
	public y = 0;
	public xPrevious = 0;
	public yPrevious = 0;
	public xSpeed = 0;
	public ySpeed = 0;
	public event: MouseEvent | null = null;
	public leftButton: ButtonState | null = null;
	public middleButton: ButtonState | null = null;
	public rightButton: ButtonState | null = null;
	public downX: Array<number> | null = null;
	public downY: Array<number> | null = null;
	public over = false;
	public scroll = 0;

	getButton(code: MouseButton) {
		if (typeof this.buttons[code] == 'number') return this.buttons[code];
		else return ButtonState.UP;
	}
}
