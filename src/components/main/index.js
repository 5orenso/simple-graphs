// eslint-disable-next-line
import { h, Component } from 'preact';
import Router from 'preact-router';
import { createHashHistory } from 'history';

import Progress from '../progress';
import LineGraph from '../lineGraph';

class Main extends Component {
    handleRoute = (event) => {
        const currentNav = event.url.replace(/^\/([^/?]+).*/g, '$1');
        this.setState({
            currentNav,
        });
    };

    render() {
        return (
            <div class='container-fluid'>
                <Router onChange={this.handleRoute} history={createHashHistory()}>
                    <LineGraph {...this.props} path='/line' />
                    <LineGraph {...this.props} default />
                </Router>
            </div>
        );
    }
}

export default Main;
