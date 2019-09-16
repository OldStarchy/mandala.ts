import { App } from '../Components/App';

export abstract class Tool {
	public constructor(protected readonly context: App) {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onActivate(): void {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public onDeactivate(): void {}

	public abstract getName(): string;
}
