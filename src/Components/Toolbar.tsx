import * as React from 'react';
import { AppContext } from './AppContext';
import { ToolbarButton } from './ToolbarButton';

const div: React.CSSProperties = {
	border: '1px solid black',
};

const ol: React.CSSProperties = {
	listStyle: 'none',
	display: 'flex',
	padding: 10,
	margin: '0 -10px',
};

const li: React.CSSProperties = {
	flexGrow: 1,
	flexShrink: 0,
	margin: '0 10px',
};

const button: React.CSSProperties = {
	width: '100%',
};

export class Toolbar extends React.Component {
	static contextType = AppContext;
	context!: React.ContextType<typeof AppContext>;

	public render() {
		const app = this.context;

		return app == null ? (
			<div style={div} className="toolbar" />
		) : (
			<div style={div} className="toolbar">
				<ol style={ol}>
					{app.tools.allTools().map((tool, i) => (
						<li style={li} key={i}>
							<ToolbarButton
								style={button}
								text={tool.getName()}
								onClick={() => app.command.run(`tool.activate.${i + 1}`)}
							/>
						</li>
					))}
				</ol>
			</div>
		);
	}
}
