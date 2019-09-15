import { Context } from '../Context';
export abstract class Tool {
	public constructor(protected readonly context: Context) {}
	public onActivate(): void {}
	public onDeactivate(): void {}
}
