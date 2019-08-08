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
        console.log(tick, msDiff, now, then);
        return util.isoDate(then);
    }
    return tick;
}
class LineChart extends Component {
    render() {
        const {
            jsonData = '[]',
            width = 600,
            height = 200,
            paddingLeft = 0, // Make room for yTicks.
            paddingBottom = 0, // Make room for xTicks.
            tickCount = 5, // Number of ticks to show
            yMax, // Y max value to use for yTicks
            showXTicks, // Show X ticks
            showYTicks, // Show Y ticks
            xTicks, // xTicks array to use instead of values. JSON.stringified and backslash escaped.
            yTicks, // yTicks array to use instead of values. JSON.stringified and backslash escaped.
        } = this.props;

        const data = JSON.parse(jsonData);

        const MAX_X = Math.max(...data.map(d => d.x));
        const MAX_Y = yMax || Math.max(...data.map(d => d.y));

        const fnX = val => val / MAX_X * width;
        const fnY = val => height - val / MAX_Y * height;

        const X_TICKS = parseTicks(xTicks) || getTicks(tickCount, MAX_X);
        const Y_TICKS = parseTicks(yTicks) || getTicks(tickCount, MAX_Y).reverse();

        // console.table(xTicks);
        // console.table(yTicks);

        const d = `M${fnX(data[0].x)} ${fnY(data[0].y)} 
            ${data.slice(1).map(p => `L${fnX(p.x)} ${fnY(p.y)}`).join(' ')}
        `;
        // console.table(d);

        return (
            <div
                class={style.lineChart}
                // style={{
                //     'padding-left': `${paddingLeft}px`,
                //     'padding-bottom': `${paddingBottom}px`,
                // }}
            >
                <svg class={style.svg} viewBox='0 0 600 200'
                    style={{
                        'padding-left': `${paddingLeft}px`,
                        'padding-bottom': `${paddingBottom}px`,
                        width: `calc(100% - ${paddingLeft}px)`,
                    }}
                >
                    <path d={d} />
                </svg>
                {showXTicks && (
                    <div class={style['x-axis']}
                        style={{
                            left: `${paddingLeft}px`,
                            width: `calc(100% - ${paddingLeft}px)`,
                        }}
                    >
                        {X_TICKS.map(v => <div data-value={transformXTick(v)} />)}
                    </div>
                )}
                {showYTicks && (
                    <div
                        class={style['y-axis']}
                        style={{
                            bottom: `${paddingBottom}px`,
                        }}
                    >
                        {Y_TICKS.map(v => <div data-value={v} />)}
                    </div>
                )}
            </div>
        );
    }
}

export default LineChart;
