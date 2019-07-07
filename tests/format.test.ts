import { format } from '../src/format';
import en from '../src/locale/en';
import UmAlQuraStatic from '../src/UmAlQuraStatic';

const expects = {
    default: 'Wed Shw 30 1440 13:19:44',
    shortDate: '10/30/40',
    mediumDate: 'Shw 30, 1440',
    longDate: 'Shawwāl 30, 1440',
    fullDate: 'Wednesday, Shawwāl 30, 1440',
    shortTime: '1:19 PM',
    mediumTime: '1:19:44 PM',
    longTime: '1:19:44.000 PM',
};

describe('Formatting', () => {
    it('should use `default` mask, when `mask` is empty', () => {
        const now = new Date();
        expect(format(now, '', en, 1440, 1, 1, 1, 1)).toBe(format(now, en.masks.default, en, 1440, 1, 1, 1, 1));
    });

    for (const key in en.masks) {
        if (!en.masks.hasOwnProperty(key)) {
            continue;
        }

        it('should format `' + key + '` mask', () => {
            const d = new Date(2019, 6, 3, 13, 19, 44);
            const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(d);
            const expected = expects[key];
            const actual = format(d, key, en, hy, hm, hd, 0, 0);
            expect(actual).toBe(expected);
        });
    }

    it('does not mod 12 hours', () => {
        const d = new Date(); d.setHours(12);
        expect(format(d, 'h', en, 0, 0, 0, 0, 0)).toBe('12');
    });
});
