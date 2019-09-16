import * as React from 'react';
import { ToolManager } from '../Tool/ToolManager';
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

export const Toolbar = (props: { tools: ToolManager }) => (
	<div style={div} className="toolbar">
		<ol style={ol}>
			{props.tools.allTools().map((tool, i) => (
				<li style={li} key={i}>
					<ToolbarButton style={button} tool={tool} onClick={() => props.tools.activateTool(i)} />
				</li>
			))}
		</ol>
	</div>
);
