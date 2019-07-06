import { format } from '../src/format';
import en from '../src/locale/en';
import UmAlQuraCalendar from '../src/UmAlQuraCalendar';

const expects = {
    default: 'Wed Dhū-Q 01 1440 13:19:44',
    shortDate: '11/1/40',
    mediumDate: 'Dhū-Q 1, 1440',
    longDate: 'Dhū al-Qa‘dah 1, 1440',
    fullDate: 'Wednesday, Dhū al-Qa‘dah 1, 1440',
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
            const { hy, hm, hd } = UmAlQuraCalendar.gregorianToHijri(d);
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
