import habitat from 'preact-habitat';

import StartPage from './components/startpage';

const startPage = habitat(StartPage);

startPage.render({
    selector: '[data-widget-host="simpleGraph"]',
    clean: true,
});
