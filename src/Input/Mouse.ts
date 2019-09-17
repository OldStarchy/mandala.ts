import { EventEmitter } from '../EventEmitter/EventEmitter';
import { ButtonState } from './ButtonState';
import { MouseButton } from './MouseButton';
import { MouseState } from './MouseState';
import { MyMouseEvent } from './MyMouseEvent';

type AttachableObject = HTMLElement;

export class Mouse extends EventEmitter {
	public x = 0;
	public y = 0;
	public xPrevious = -1;
	public yPrevious = 0;
	public xSpeed = 0;
	public ySpeed = 0;
	public event: MouseEvent | null = null;
	public leftButton = 0;
	public middleButton = 0;
	public rightButton = 0;
	public downX: Array<number> = [];
	public downY: Array<number> = [];
	public over = false;
	public scroll = 0;
	public scrolled = false;
	public hadInput = false;
	public buttons: { [propName: number]: ButtonState } = {};
	public preventDrag = false;
	public preventContextMenu = false;
	public preventClickDefault = false;
	public element: AttachableObject | null = null;

	private attach: () => void;
	private detach: () => void;

	private convertCoordinates(event: MouseEvent) {
		if (this.element === null || this.element instanceof Document) {
			return { x: event.x, y: event.y };
		}

		let x, y;
		const offsetLeft = this.element.offsetLeft || 0;
		const offsetTop = this.element.offsetTop || 0;

		if (typeof event.pageX !== 'undefined') {
			x = event.pageX;
			y = event.pageY;
		} else {
			const bodyScrollLeft = document.body.scrollLeft;
			const elementScrollLeft = document.documentElement.scrollLeft;
			const bodyScrollTop = document.body.scrollTop;
			const elementScrollTop = document.documentElement.scrollTop;

			x = event.clientX + bodyScrollLeft + elementScrollLeft;
			y = event.clientY + bodyScrollTop + elementScrollTop;
		}

		x -= offsetLeft;
		y -= offsetTop;

		if (this.element instanceof HTMLCanvasElement && this.element.clientWidth) {
			x *= this.element.width / this.element.clientWidth;
			y *= this.element.height / this.element.clientHeight;
		}

		return {
			x: x,
			y: y,
		};
	}

	private _trigger(event: MouseEvent) {
		const evt = new MyMouseEvent(event);
		evt.altKey = event.altKey;
		evt.ctrlKey = event.ctrlKey;
		evt.shiftKey = event.shiftKey;

		this.assignTo(evt);
		this.trigger(event.type, evt);
	}

	constructor(element?: AttachableObject) {
		super();

		const mouseMove = (event: MouseEvent) => {
			const pos = this.convertCoordinates(event);

			this.hadInput = true;
			this.over = true;
			this.x = pos.x;
			this.y = pos.y;
			this.event = event;

			this._trigger(event);
		};

		const mouseButton = (event: MouseEvent) => {
			if (this.preventClickDefault) event.preventDefault();
			const down = event.type == 'mousedown' ? 1 : 0;

			// Don't trigger repeat events (eg. mousedown while mouse is already down)
			if (this.getButton(event.which) == 2 * down + 1) return;

			const pos = this.convertCoordinates(event);

			this.hadInput = true;
			this.over = true;
			this.x = pos.x;
			this.y = pos.y;
			switch (event.which) {
				case 1:
					this.leftButton = 2 * down;
					break;
				case 2:
					this.middleButton = 2 * down;
					break;
				case 3:
					this.rightButton = 2 * down;
					break;
			}
			if (down) {
				this.downX[event.which] = this.x;
				this.downY[event.which] = this.y;
			}
			this.buttons[event.which] = 2 * down;
			this.event = event;

			this._trigger(event);
		};

		const mouseinout = (event: MouseEvent) => {
			this.hadInput = true;
			this.leftButton = ButtonState.UP;
			this.middleButton = ButtonState.UP;
			this.rightButton = ButtonState.UP;

			this.buttons = {};

			this.over = event.type == 'mouseover';
			this.event = event;

			this._trigger(event);
		};

		const mouseScroll = (event: WheelEvent) => {
			if (event.deltaY > 0) this.scroll++;
			else this.scroll--;
			this.scrolled = true;
			this.event = event;

			this._trigger(event);
		};

		const mouseDrag = (event: MouseEvent) => {
			if (this.preventDrag) event.preventDefault();
			this.event = event;

			this._trigger(event);
		};

		const contextMenu = (event: MouseEvent) => {
			this.event = event;
			if (this.preventContextMenu) {
				event.preventDefault();
			} else {
				this._trigger(event);
			}
			return !this.preventContextMenu;
		};

		this.attach = function() {
			this.element!.addEventListener('mousemove', mouseMove, false);
			this.element!.addEventListener('mousedown', mouseButton, false);
			this.element!.addEventListener('mouseup', mouseButton, false);

			this.element!.addEventListener('mouseover', mouseinout, false);
			this.element!.addEventListener('mouseout', mouseinout, false);

			this.element!.addEventListener('wheel', mouseScroll, false);

			this.element!.addEventListener('dragstart', mouseDrag, false);

			this.element!.addEventListener('contextmenu', contextMenu, false);
		};

		this.detach = function() {
			this.element!.removeEventListener('mousemove', mouseMove, false);
			this.element!.removeEventListener('mousedown', mouseButton, false);
			this.element!.removeEventListener('mouseup', mouseButton, false);

			this.element!.removeEventListener('mouseover', mouseinout, false);
			this.element!.removeEventListener('mouseout', mouseinout, false);

			this.element!.removeEventListener('wheel', mouseScroll, false);

			this.element!.removeEventListener('dragstart', mouseDrag, false);

			this.element!.removeEventListener('contextmenu', contextMenu, false);
		};

		if (element) this.setElement(element);
	}

	public setElement(element: AttachableObject | null) {
		if (this.element !== null) this.detach();

		this.element = element;

		if (this.element !== null) this.attach();
	}

	clear() {
		this.buttons = {};
		this.leftButton = 1;
		this.middleButton = 1;
		this.rightButton = 1;
	}

	getButton(code: MouseButton) {
		if (typeof this.buttons[code] == 'number') return this.buttons[code];
		else return ButtonState.UP;
	}

	update() {
		this.leftButton |= 1;
		this.middleButton |= 1;
		this.rightButton |= 1;

		for (const key in this.buttons) {
			if (this.buttons.hasOwnProperty(key)) {
				this.buttons[key] |= 1;
			}
		}

		this.scroll = 0;
		this.scrolled = false;
		this.hadInput = false;

		if (this.xPrevious != -1) {
			this.xSpeed = this.x - this.xPrevious;
			this.ySpeed = this.y - this.yPrevious;
		}

		this.xPrevious = this.x;
		this.yPrevious = this.y;
	}

	public getState() {
		const state = new MouseState();
		this.assignTo(state);
		return state;
	}

	private assignTo(state: MouseState): void {
		state.buttons = {};
		for (const key in this.buttons) {
			if (this.buttons.hasOwnProperty(key)) {
				if (this.buttons[key] != 1) state.buttons[key] = this.buttons[key];
			}
		}

		state.x = this.x;
		state.y = this.y;
		state.xPrevious = this.xPrevious;
		state.yPrevious = this.yPrevious;
		state.xSpeed = this.xSpeed;
		state.ySpeed = this.ySpeed;
		state.event = this.event;
		state.leftButton = this.leftButton;
		state.middleButton = this.middleButton;
		state.rightButton = this.rightButton;
		state.downX = this.downX.slice(0);
		state.downY = this.downY.slice(0);
		state.over = this.over;
		state.scroll = this.scroll;
	}
}
