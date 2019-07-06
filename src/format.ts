// Parts of this file are (c) 2007-2009 Steven Levithan <stevenlevithan.com>
// https://github.com/felixge/node-dateformat/blob/master/lib/dateformat.js

import Locale from './locale/interfaces';

const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LlSWN]|"[^"]*"|'[^']*'/g;

function pad(val: string | number, locale: Locale, len?: number) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
        val = '0' + val;
    }
    return locale.localizeNum(val);
}

export function format(date: Date, mask: string, locale: Locale, hy: number, hm: number, hd: number, woy: number, dow: number) {
    mask = String(locale.masks[mask] || mask || locale.masks.default);

    const _ = 'get';
    const d = hd;
    const D = date[_ + 'Day']();
    const m = hm;
    const y = hy;
    const H = date[_ + 'Hours']();
    const M = date[_ + 'Minutes']();
    const s = date[_ + 'Seconds']();
    const L = date[_ + 'Milliseconds']();
    const W = woy;
    const N = dow;
    const flags = {
        d: locale.localizeNum(d),
        dd: pad(d, locale),
        ddd: locale.dayNamesShort[D],
        dddd: locale.dayNames[D],
        m: locale.localizeNum(m),
        mm: pad(m, locale),
        mmm: locale.monthNamesShort[m - 1],
        mmmm: locale.monthNames[m - 1],
        yy: locale.localizeNum(String(y).slice(2)),
        yyyy: locale.localizeNum(y),
        h: locale.localizeNum(H % 12 || 12),
        hh: pad(H % 12 || 12, locale),
        H: locale.localizeNum(H),
        HH: pad(H, locale),
        M: locale.localizeNum(M),
        MM: pad(M, locale),
        s: locale.localizeNum(s),
        ss: pad(s, locale),
        l: pad(L, locale, 3),
        L: pad(Math.round(L / 10), locale),
        t: H < 12 ? locale.timeNames[0] : locale.timeNames[1],
        tt: H < 12 ? locale.timeNames[2] : locale.timeNames[3],
        T: H < 12 ? locale.timeNames[4] : locale.timeNames[5],
        TT: H < 12 ? locale.timeNames[6] : locale.timeNames[7],
        S: locale.localizeDayNum(d),
        W: locale.localizeNum(W),
        N: locale.localizeNum(N),
    };

    return mask.replace(token, (match) => flags[match]);
}
