import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './Components/App';

export interface IColours {
	stroke: string;
	fill: string;
}

ReactDOM.render(<App />, document.getElementsByClassName('app-container')[0]);
