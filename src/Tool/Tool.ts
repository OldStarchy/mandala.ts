import { Context } from '../mandala';
export abstract class Tool {
	public constructor(protected readonly context: Context) {}
	public onActivate(): void {}
	public onDeactivate(): void {}
}
