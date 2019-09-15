import { Tool } from './Tool';
export class ToolManager {
	private tools: Tool[] = [];
	private activeTool: number | null = null;
	public addTool(tool: Tool) {
		this.tools.push(tool);
	}
	public activateTool(tool: number | null) {
		if (this.activeTool === tool) {
			return;
		}
		if (this.activeTool !== null) {
			this.tools[this.activeTool].onDeactivate();
			this.activeTool = null;
		}
		if (tool !== null) {
			this.activeTool = tool;
			this.tools[this.activeTool].onActivate();
			console.log(`Tool "${this.activeTool}" activated`);
		} else {
			console.log(`Tools deactivated`);
		}
	}
	public allTools() {
		return this.tools.slice();
	}
}
