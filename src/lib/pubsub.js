import PubSub from 'pubsub-js';

const topics = {
    LOG_OUT: 'logOut',

    // to show progress when running long-living tasks. Should be [0-100]
    LOADING_PROGRESS: 'simpleGraphLoadingProgress',

    // when user has authenticated, this is used to update to the new token
    JWT_TOKEN_CHANGED: 'simpleGraphJwtTokenChanged',

    ERROR_MESSAGE: 'simpleGraphErrorMessage',
    STATUS_MESSAGE: 'simpleGraphStatusMessage',
};

const ps = {
    publish: (topic, message) => {
        PubSub.publish(topic, message);
    },

    subscribe: (topic, callback) => {
        PubSub.subscribe(topic, (_, message) => {
            callback(message);
        });
    },
};

export default ps;
export { topics };
