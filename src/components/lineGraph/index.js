import { h, Component } from 'preact';
import style from './style.css';
import util from '../../lib/util';
// import tc from 'fast-type-check';

const widgetName = 'simpleGraph';
const debug = false;

function getTicks(count, min, max, prefix = '', postfix = '') {
    const loop = Array.from(Array(count).keys());
    const range = Math.ceil(max) - Math.floor(min);
    return loop.map(d => `${prefix}${parseInt((range / (count - 1) * d), 10) + Math.floor(min)}${postfix}`);
}

function parseTicks(ticks) {
    if (ticks) {
        return JSON.parse(ticks);
    }
    return undefined;
}

function transformXTick(tick) {
    if (typeof tick === 'string') {
        if (tick.match(/\d+h/)) {
            const msDiff = tick.replace(/h/g, '') * 3600 * 1000;
            const now = util.epoch();
            const then = now - msDiff;
            return util.isoDate(then);
        }
    }
    return tick;
}

function normalizeRange(val, min, max, newMin, newMax) {
    return newMin + (val - min) * (newMax - newMin) / (max - min);
}

function makePath({ data, yMin, yMax, width, height, yRangeMin, yRangeMax, offsetY = 0 }) {
    if (data && data.length) {
        const maxX = Math.max(...data.map(d => d.x));
        const minY = util.isNumber(yMin) ? Math.min(yMin, ...data.map(d => d.y)) : Math.min(...data.map(d => d.y));
        const maxY = util.isNumber(yMax) ? Math.max(yMax, ...data.map(d => d.y)) : Math.max(...data.map(d => d.y));
        const realHeight = height - offsetY;
        const fnX = val => val / maxX * width;
        const fnY = (val) => {
            let dataVal = val;
            if (util.isNumber(yRangeMin) && util.isNumber(yRangeMax)) {
                dataVal = normalizeRange(dataVal, minY, maxY, yRangeMin, yRangeMax);
                return realHeight - normalizeRange(dataVal, yRangeMin, yRangeMax, offsetY, height);
            }
            dataVal = normalizeRange(dataVal, minY, maxY, minY, maxY);
            return realHeight - normalizeRange(dataVal, minY, maxY, offsetY, height);
        };

        const d = `M-100 ${realHeight + offsetY} L${fnX(data[0].x)} ${fnY(data[0].y)} 
            ${data.slice(1).map(p => `L${fnX(p.x)} ${fnY(p.y)}`).join(' ')}
            L${fnX(maxX) + 100} ${realHeight + offsetY}
        `;
        const dCold = [];
        const dWarm = [];
        for (let i = 0, l = data.length; i < l; i += 1) {
            const pPrev = i > 0 ? data[i - 1] : { x: 0, y: 0};
            const p = data[i];
            if (p.y < 0 && pPrev.y < 0) {
                dCold.push([
                    { x: fnX(pPrev.x), y: fnY(pPrev.y) },
                    { x: fnX(p.x), y: fnY(p.y) },
                ]);
            }
            if (p.y > 12 && pPrev.y > 12) {
                dWarm.push([
                    { x: fnX(pPrev.x), y: fnY(pPrev.y) },
                    { x: fnX(p.x), y: fnY(p.y) },
                ]);
            }
        }
        return { d, dCold, dWarm, maxX, maxY, minY };
    }
    return {};
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.setState({
            jsonData: JSON.parse(props.jsonData || '[]'),
            jsonDataB: JSON.parse(props.jsonDataB || '[]'),
            jsonData2: JSON.parse(props.jsonData2 || '[]'),
            jsonData2B: JSON.parse(props.jsonData2B || '[]'),
            jsonData2C: JSON.parse(props.jsonData2C || '[]'),
            jsonData3: JSON.parse(props.jsonData3 || '[]'),
        })
        this.loadData(props.apiUrl, 'jsonData', randomIntFromInterval(1, 5));
        this.loadData(props.apiUrlB, 'jsonDataB', randomIntFromInterval(1, 5));
        this.loadData(props.apiUrl2, 'jsonData2', randomIntFromInterval(1, 5));
        this.loadData(props.apiUrl2B, 'jsonData2B', randomIntFromInterval(1, 5));
        this.loadData(props.apiUrl2C, 'jsonData2C', randomIntFromInterval(1, 5));
        this.loadData(props.apiUrl3, 'jsonData3', randomIntFromInterval(1, 5));
        this.loadDataJsonDataTimer = {};
    }

    async loadData(apiurl, dataKey, timeoutMin = 5) {
        if (apiurl) {
            try {
                const data = await util.fetchApi(apiurl);
                if (data.length > 0) {
                    this.setState({
                        [dataKey]: data,
                    });
                }
                clearTimeout(this.loadDataJsonDataTimer[apiurl]);
                this.loadDataJsonDataTimer[apiurl] = setTimeout(() => this.loadData(apiurl, dataKey), timeoutMin * 60 * 1000);
                // console.log(apiurl, data);
            } catch (err) {
                console.log(`Could not get iot data ${apiurl}: ${err}`);
            }
        }
    }

    // - - - [ Functions ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    componentCleanup() {
        if (debug) {
            console.log(widgetName, 'componentCleanup');
        }
        const apiUrls = Object.keys(this.loadDataJsonDataTimer);
        apiUrls.forEach(apiUrl => clearInterval(this.loadDataJsonDataTimer[apiUrl]));
    }

    // - - - [ Component events from Preact it self: ] - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // componentWillMount() {
    //     if (debug) {
    //         console.log(widgetName, 'componentWillMount');
    //     }
    // }

    componentDidMount() {
        if (debug) {
            console.log(widgetName, 'componentDidMount');
        }
        window.addEventListener('pagehide', () => this.componentCleanup());
    }

    // componentWillUnmount() {
    //     if (debug) {
    //         console.log(widgetName, 'componentWillUnmount');
    //     }
    // }

    // Every time something happens:
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (debug) {
    //         console.log(widgetName, 'shouldComponentUpdate');
    //     }
    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (debug) {
    //         console.log(widgetName, 'componentDidUpdate');
    //     }
    // }

    render() {
        const {
            width = 600,
            height = 200,
            offsetY = 0,
            paddingLeft = 0, // Make room for yTicks.
            paddingBottom = 0, // Make room for xTicks.
            tickCount = 5, // Number of ticks to show
            showXTicks, // Show X ticks
            showYTicks, // Show Y ticks
            xTicks, // xTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicks, // yTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicksPrefix,
            yTicksPostfix = '°C',

            yMax, // Y max value to use for yTicks
            yMin, // Y min value to use for yTicks

            showYTicks2, // Show Y ticks
            yTicks2, // yTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicks2Prefix,
            yTicks2Postfix = '°C',
            yMax2, // Y max value to use for yTicks2
            yMin2,

            yMax2B, // Y max value to use for yTicks2B
            yMin2B, // Y max value to use for yTicks2B
            range2bMin = 0,
            range2bMax = 100,

            yMax2C, // Y max value to use for yTicks2C
            yMin2C, // Y max value to use for yTicks2C
            range2cMin = 0,
            range2cMax = 100,
            
            yMax3, // Y max value to use for yTicks3
            yMin3,

            legend,
            legendB,
            legend2,
            legend2B,
            legend2C,
            legend3,
        } = this.props;

        const { 
            jsonData,
            jsonDataB,
            jsonData2,
            jsonData2B,
            jsonData2C,
            jsonData3,
        } = this.state;

        const PADDING_LEFT = paddingLeft || (showYTicks ? 20 : 0);
        const PADDING_BOTTOM = paddingBottom || (showXTicks ? 20 : 0);

        const data = jsonData;
        const dataB = jsonDataB;
        const data2 = jsonData2;
        const data2B = jsonData2B;
        const data2C = jsonData2C;
        const data3 = jsonData3;

        const common = {
            width,
            height,
            offsetY,
        };

        // console.table(xTicks);
        // console.table(yTicks);
        const {
            d,
            dCold,
            dWarm,
            maxX: MAX_X = 0,
            minY: MIN_Y = 0,
            maxY: MAX_Y = 0,
        } = makePath({
            ...common,
            data,
            yMax,
            yMin,
        });

        const { d: dB } = makePath({
            ...common,
            data: dataB,
            yMin: MIN_Y,
            yMax: MAX_Y,
        });

        const {
            d: d2,
            minY: MIN_Y2 = 0,
            maxY: MAX_Y2 = 0,
        } = makePath({
            ...common,
            data: data2,
            yMin: yMin2,
            yMax: yMax2,
        });

        const { d: d2B } = makePath({
            ...common,
            data: data2B,
            yMin: yMin2B,
            yMax: yMax2B,
            yRangeMin: range2bMin,
            yRangeMax: range2bMax,
        });

        const { d: d2C } = makePath({
            ...common,
            data: data2C,
            yMin: yMin2C,
            yMax: yMax2C,
            yRangeMin: range2cMin,
            yRangeMax: range2cMax,
        });

        const { d: d3 } = makePath({
            ...common,
            data: data3,
            yMin: yMin3,
            yMax: yMax3,
            yRangeMin: MIN_Y2,
            yRangeMax: MAX_Y2,
        });

        const X_TICKS = parseTicks(xTicks) || getTicks(tickCount, 0, MAX_X);
        const Y_TICKS = parseTicks(yTicks) || getTicks(tickCount, MIN_Y, MAX_Y, yTicksPrefix, yTicksPostfix).reverse();
        const Y_TICKS2 = parseTicks(yTicks2) || getTicks(tickCount, MIN_Y2, MAX_Y2, yTicks2Prefix, yTicks2Postfix).reverse();

        return (
            <div class={style.lineChart}>
                <svg class={style.svg} viewBox={`0 0 ${width} ${height}`}
                    style={{
                        'padding-left': `${PADDING_LEFT}px`,
                        'padding-bottom': `${PADDING_BOTTOM}px`,
                        width: `calc(100% - ${PADDING_LEFT}px)`,
                    }}
                >
                    {d3 && <path d={d3} class={style.path3} />}
                    {d2C && <path d={d2C} class={style.path2C} />}
                    {d2B && <path d={d2B} class={style.path2B} />}
                    {d2 && <path d={d2} class={style.path2} />}
                    {dB && <path d={dB} class={style.pathB} />}
                    {d && <path d={d} class={style.path} />}

                    {dCold && dCold.map(o => <line x1={o[0].x} y1={o[0].y} x2={o[1].x} y2={o[1].y} class={style.pathCold} />)};
                    {dWarm && dWarm.map(o => <line x1={o[0].x} y1={o[0].y} x2={o[1].x} y2={o[1].y} class={style.pathWarm} />)};

                    {legend && <line x1='10' y1='5' x2='30' y2='5' class={style.path} />}
                    {legend && <text x='35' y='10' font-size='10px' class={style.pathText}>{legend}</text>}

                    {legend2 && <line x1='10' y1='15' x2='30' y2='15' class={style.path2} />}
                    {legend2 && <text x='35' y='20' font-size='10px' class={style.pathText}>{legend2}</text>}

                    {legend3 && <line x1='10' y1='25' x2='30' y2='25' class={style.path3} />}
                    {legend3 && <text x='35' y='30' font-size='10px' class={style.pathText}>{legend3}</text>}

                    {legendB && <line x1='10' y1='35' x2='30' y2='35' class={style.pathB} />}
                    {legendB && <text x='35' y='40' font-size='10px' class={style.pathText}>{legendB}</text>}

                    {legend2B && <line x1='10' y1='45' x2='30' y2='45' class={style.path2B} />}
                    {legend2B && <text x='35' y='50' font-size='10px' class={style.pathText}>{legend2B}</text>}

                    {legend2C && <line x1='10' y1='55' x2='30' y2='55' class={style.path2C} />}
                    {legend2C && <text x='35' y='60' font-size='10px' class={style.pathText}>{legend2C}</text>}

                </svg>
                {showXTicks && (
                    <div class={style['x-axis']}
                        style={{
                            left: `${PADDING_LEFT}px`,
                            width: `calc(100% - ${PADDING_LEFT}px)`,
                        }}
                    >
                        {X_TICKS.map(v => <div data-value={transformXTick(v)} />)}
                    </div>
                )}
                {showYTicks && (
                    <div
                        class={style['y-axis']}
                        style={{
                            bottom: `${PADDING_BOTTOM}px`,
                        }}
                    >
                        {Y_TICKS.map(v => <div data-value={v} />)}
                    </div>
                )}
                {showYTicks2 && (
                    <div
                        class={style['y-axis2']}
                        style={{
                            bottom: `${PADDING_BOTTOM}px`,
                        }}
                    >
                        {Y_TICKS2.map(v => <div data-value={v} />)}
                    </div>
                )}
            </div>
        );
    }
}

export default LineChart;
