// eslint-disable-next-line
import { h, Component } from 'preact';
import Main from '../main';
import util from '../../lib/util';

class StartPage extends Component {
    constructor(props) {
        super(props);

        const apiServer = props.apiServer || `${window.location.protocol}//${window.location.host}`;
        util.setApiServer(apiServer);
    }

    getContent = () => (<Main {...this.props} />);

    render(props) {
        // console.log(props, this.props);
        return this.getContent();
    }
}

export default StartPage;
