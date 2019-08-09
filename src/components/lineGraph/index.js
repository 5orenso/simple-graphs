import { h, Component } from 'preact';
import style from './style.css';
import util from '../../lib/util';

function getTicks(count, max) {
    const loop = Array.from(Array(count).keys());
    return loop.map(d => parseInt((max / (count - 1) * d), 10));
}

function parseTicks(ticks) {
    if (ticks) {
        return JSON.parse(ticks);
    }
    return undefined;
}

function transformXTick(tick) {
    if (tick.match(/\d+h/)) {
        const msDiff = tick.replace(/h/g, '') * 3600 * 1000;
        const now = util.epoch();
        const then = now - msDiff;
        return util.isoDate(then);
    }
    return tick;
}
class LineChart extends Component {
    render() {
        const {
            jsonData = '[]',
            jsonData2 = '[]',
            jsonData3 = '[]',
            width = 600,
            height = 200,
            paddingLeft = 0, // Make room for yTicks.
            paddingBottom = 0, // Make room for xTicks.
            tickCount = 5, // Number of ticks to show
            yMax, // Y max value to use for yTicks
            yMax2, // Y max value to use for yTicks2
            yMax3, // Y max value to use for yTicks3
            yMin3,
            showXTicks, // Show X ticks
            showYTicks, // Show Y ticks
            showYTicks2, // Show Y ticks
            xTicks, // xTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicks, // yTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicks2, // yTicks array to use instead of values. JSON.stringified and backslash escaped.
        } = this.props;

        const PADDING_LEFT = paddingLeft || (showYTicks ? 20 : 0);
        const PADDING_BOTTOM = paddingBottom || (showXTicks ? 20 : 0);

        const data = JSON.parse(jsonData);
        const data2 = JSON.parse(jsonData2);
        const data3 = JSON.parse(jsonData3);

        const MAX_X = Math.max(...data.map(d => d.x));
        const MAX_Y = yMax || Math.max(...data.map(d => d.y));
        const fnX = val => val / MAX_X * width;
        const fnY = val => height - val / MAX_Y * height;
        const X_TICKS = parseTicks(xTicks) || getTicks(tickCount, MAX_X);
        const Y_TICKS = parseTicks(yTicks) || getTicks(tickCount, MAX_Y).reverse();

        const MAX_X2 = Math.max(...data2.map(d => d.x));
        const MAX_Y2 = yMax2 || Math.max(...data2.map(d => d.y));
        const fnX2 = val => val / MAX_X2 * width;
        const fnY2 = val => height - val / MAX_Y2 * height;
        const Y_TICKS2 = parseTicks(yTicks2) || getTicks(tickCount, MAX_Y2).reverse();

        const MAX_X3 = Math.max(...data3.map(d => d.x));
        const MAX_Y3 = yMax3 || Math.max(...data3.map(d => d.y));
        const MIN_Y3 = yMin3 || Math.min(...data3.map(d => d.y));
        const fnX3 = val => val / MAX_X3 * width;
        const fnY3 = (val) => {
            const rMin = MIN_Y3;
            const rMax = MAX_Y3;
            const tMin = 0;
            const tMax = height;
            return height - ((((val - rMin) / (rMax - rMin)) * (tMax - tMin)) + tMin);
        };

        // console.table(xTicks);
        // console.table(yTicks);

        const d = `M${fnX(data[0].x)} ${fnY(data[0].y)} 
            ${data.slice(1).map(p => `L${fnX(p.x)} ${fnY(p.y)}`).join(' ')}
        `;
        const d2 = `M${fnX2(data2[0].x)} ${fnY2(data2[0].y)} 
            ${data2.slice(1).map(p => `L${fnX2(p.x)} ${fnY2(p.y)}`).join(' ')}
        `;
        const d3 = `M0 ${height} L${fnX3(data3[0].x)} ${fnY3(data3[0].y)} 
            ${data3.slice(1).map(p => `L${fnX3(p.x)} ${fnY3(p.y)}`).join(' ')}
            L${fnX3(MAX_X3)} ${height}
        `;
        // console.table(d3);

        return (
            <div class={style.lineChart}>
                <svg class={style.svg} viewBox='0 0 600 200'
                    style={{
                        'padding-left': `${PADDING_LEFT}px`,
                        'padding-bottom': `${PADDING_BOTTOM}px`,
                        width: `calc(100% - ${PADDING_LEFT}px)`,
                    }}
                >
                    <path d={d3} class={style.path3} />
                    <path d={d2} class={style.path2} />
                    <path d={d} class={style.path} />
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
