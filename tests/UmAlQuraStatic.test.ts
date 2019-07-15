import { en } from '../src/locale';
import UmAlQuraStatic from '../src/UmAlQuraStatic';

describe('Date conversion', () => {
    it('gregorianToHijri() - direct map match', () => {
        const d = new Date(1901, 3, 19);
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(d);

        expect(hy).toBe(1319);
        expect(hm).toBe(1);
        expect(hd).toBe(1);
    });

    it('gregorianToHijri()', () => {
        const d = new Date(2019, 6, 3);
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(d);

        expect(hy).toBe(1440);
        expect(hm).toBe(10);
        expect(hd).toBe(30);
    });

    it('hijriToGregorian()', () => {
        const { gy, gm, gd } = UmAlQuraStatic.hijriToGregorian(1440, 10, 30);

        expect(gy).toBe(2019);
        expect(gm).toBe(6);
        expect(gd).toBe(3);
    });

    it('toDate()', () => {
        const r = UmAlQuraStatic.toDate(1440, 10, 30, 1, 5, 10, 20);
        expect(r.getTime()).toBe(new Date(2019, 6, 3, 1, 5, 10, 20).getTime());
    });
});

describe('Date manipulation', () => {
    it('addYears()', () => {
        const d = UmAlQuraStatic.addYears(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2024);
        expect(d.getMonth()).toBe(4);
        expect(d.getDate()).toBe(8);
    });

    it('addMonths()', () => {
        const d = UmAlQuraStatic.addMonths(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(10);
        expect(d.getDate()).toBe(27);
    });

    it('addMonths() - negative', () => {
        const d = UmAlQuraStatic.addMonths(new Date(2019, 6, 3), -10);

        expect(d.getFullYear()).toBe(2018);
        expect(d.getMonth()).toBe(8);
        expect(d.getDate()).toBe(10);
    });

    it('addMonths() - before 29th of month', () => {
        const d = UmAlQuraStatic.addMonths(new Date(2019, 6, 1), 1);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(6);
        expect(d.getDate()).toBe(31);
    });

    it('addWeeks()', () => {
        const d = UmAlQuraStatic.addWeeks(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(7);
        expect(d.getDate()).toBe(7);
    });

    it('addDays()', () => {
        const d = UmAlQuraStatic.addDays(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(6);
        expect(d.getDate()).toBe(8);
    });

    it('addTime()', () => {
        const d = new Date(2019, 6, 3, 12, 30, 30, 500);

        expect(UmAlQuraStatic.addTime(d, 13, 'hour')).toEqual(new Date(2019, 6, 4, 1, 30, 30, 500));
        expect(UmAlQuraStatic.addTime(d, 35, 'minute')).toEqual(new Date(2019, 6, 3, 13, 5, 30, 500));
        expect(UmAlQuraStatic.addTime(d, 35, 'second')).toEqual(new Date(2019, 6, 3, 12, 31, 5, 500));
        expect(UmAlQuraStatic.addTime(d, 600, 'millisecond')).toEqual(new Date(2019, 6, 3, 12, 30, 31, 100));
    });
});

describe('Date part retreival', () => {
    it('getDayOfYear()', () => {
        const doy = UmAlQuraStatic.getDayOfYear(new Date(2019, 6, 3));
        expect(doy).toBe(296);
    });

    it('gGetDayOfMonth()', () => {
        const dom = UmAlQuraStatic.getDayOfMonth(new Date(2019, 6, 3));
        expect(dom).toBe(30);
    });

    it('getDayOfWeek()', () => {
        const dow = UmAlQuraStatic.getDayOfWeek(new Date(2019, 6, 3));
        expect(dow).toBe(3); // Wednesday
    });

    it('getWeekOfYear()', () => {
        const woy = UmAlQuraStatic.getWeekOfYear(new Date(2019, 6, 3));
        expect(woy).toBe(43); // Wednesday
    });

    it('getDaysInYear()', () => {
        const r1 = UmAlQuraStatic.getDaysInYear(1440);
        expect(r1).toBe(354);

        const r2 = UmAlQuraStatic.getDaysInYear(1441);
        expect(r2).toBe(355);
    });

    it('getDaysInMonth()', () => {
        const r = UmAlQuraStatic.getDaysInMonth(1440, 10);
        expect(r).toBe(30);
    });

    it('getYear()', () => {
        const r = UmAlQuraStatic.getYear(new Date(2019, 6, 3));
        expect(r).toBe(1440);
    });

    it('getMonth()', () => {
        const r = UmAlQuraStatic.getMonth(new Date(2019, 6, 3));
        expect(r).toBe(10);
    });

    it('getMonthArray()', () => {
        const arr = UmAlQuraStatic.getMonthArray(new Date(2019, 6, 3));
        const startOfMonth = new Date(2019, 5, 4);

        for (let w = 0; w < 5; w++) {
            for (let d = 0; d < 7; d++) {
                let expected: Date | null;
                if ((w === 0 && d < 2) || (w === 4 && d > 3)) {
                    expected = null;
                } else {
                    const increment = w * 7 + d - 2;
                    expected = new Date(startOfMonth);
                    expected.setDate(expected.getDate() + increment);
                }

                expect(arr[w][d]).toEqual(expected);
            }
        }
    });

    it('startOf()', () => {
        const d = new Date(2019, 6, 3, 14, 47, 35, 200);
        const startOfYear = UmAlQuraStatic.startOf(d, 'year');
        const startOfMonth = UmAlQuraStatic.startOf(d, 'month');
        const startOfWeek = UmAlQuraStatic.startOf(d, 'week');
        const startOfDay = UmAlQuraStatic.startOf(d, 'day');
        const startOfHour = UmAlQuraStatic.startOf(d, 'hour');
        const startOfMinute = UmAlQuraStatic.startOf(d, 'minute');
        const startOfSecond = UmAlQuraStatic.startOf(d, 'second');

        expect(startOfYear).toEqual(new Date(2018, 8, 11, 0, 0, 0, 0));
        expect(startOfMonth).toEqual(new Date(2019, 5, 4, 0, 0, 0, 0));
        expect(startOfWeek).toEqual(new Date(2019, 5, 30, 0, 0, 0, 0));
        expect(startOfDay).toEqual(new Date(2019, 6, 3, 0, 0, 0, 0));
        expect(startOfHour).toEqual(new Date(2019, 6, 3, 14, 0, 0, 0));
        expect(startOfMinute).toEqual(new Date(2019, 6, 3, 14, 47, 0, 0));
        expect(startOfSecond).toEqual(new Date(2019, 6, 3, 14, 47, 35, 0));
    });

    it('endOf()', () => {
        const d = new Date(2019, 6, 3, 14, 47, 35, 200);
        const endOfYear = UmAlQuraStatic.endOf(d, 'year');
        const endOfMonth = UmAlQuraStatic.endOf(d, 'month');
        const endOfWeek = UmAlQuraStatic.endOf(d, 'week');
        const endOfDay = UmAlQuraStatic.endOf(d, 'day');
        const endOfHour = UmAlQuraStatic.endOf(d, 'hour');
        const endOfMinute = UmAlQuraStatic.endOf(d, 'minute');
        const endOfSecond = UmAlQuraStatic.endOf(d, 'second');

        expect(endOfYear).toEqual(new Date(2019, 7, 30, 23, 59, 59, 999));
        expect(endOfMonth).toEqual(new Date(2019, 6, 3, 23, 59, 59, 999));
        expect(endOfWeek).toEqual(new Date(2019, 6, 6, 23, 59, 59, 999));
        expect(endOfDay).toEqual(new Date(2019, 6, 3, 23, 59, 59, 999));
        expect(endOfHour).toEqual(new Date(2019, 6, 3, 14, 59, 59, 999));
        expect(endOfMinute).toEqual(new Date(2019, 6, 3, 14, 47, 59, 999));
        expect(endOfSecond).toEqual(new Date(2019, 6, 3, 14, 47, 35, 999));
    });

    it('isLeapYear()', () => {
        const r = UmAlQuraStatic.isLeapYear(1440);
        expect(r).toBeFalsy();
    });
});

describe('Formatting', () => {
    it('formats correctly', () => {
        const f = UmAlQuraStatic.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/MM/yyyy HH:mm:ss.l', 'en');
        expect(f).toBe('30/10/1440 02:37:15.200');
    });

    it('Uses default locale when not defined', () => {
        const f = UmAlQuraStatic.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/MM/yyyy HH:mm:ss.l');
        expect(f).toBe('30/10/1440 02:37:15.200');
    });

    it('Uses default locale when supplied locale does not exist', () => {
        const f = UmAlQuraStatic.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/MM/yyyy HH:mm:ss.l', 'doesnt exist');
        expect(f).toBe('30/10/1440 02:37:15.200');
    });
});

describe('Locales', () => {
    it('Can set global locale and is used for formatting', () => {
        UmAlQuraStatic.setLocale('ar');
        const f = UmAlQuraStatic.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/MM/yyyy');
        expect(f).toBe('٣٠/١٠/١٤٤٠');
    });

    it('Throws when registering a locale with empty name', () => {
        // @ts-ignore
        expect(() => UmAlQuraStatic.registerLocale({ name: '' })).toThrow(`The locale's 'name' property must not be empty.`);
    });

    it('Throws when registering a locale that already exists', () => {
        // @ts-ignore
        expect(() => UmAlQuraStatic.registerLocale({ name: 'en' })).toThrow(`A locale with the same name 'en' is already registered.`);
    });

    it('Can register new locale', () => {
        UmAlQuraStatic.registerLocale(testLocale);
        const f = UmAlQuraStatic.format(new Date(2019, 6, 3), 'default', testLocale.name);
        expect(f).toBe('Wednesday');
    });
});

describe('Input validation', () => {
    it('hijriToGregorian() throws for out of range year', () => {
        expect(() => UmAlQuraStatic.hijriToGregorian(1300, 1, 1)).toThrow('Invalid value for year. Must be between 1318 and 1500.');
    });

    it('hijriToGregorian() throws for out of range month', () => {
        expect(() => UmAlQuraStatic.hijriToGregorian(1440, -1, 1)).toThrow('Invalid value for month. Must be between 1 and 12.');
    });

    it('hijriToGregorian() throws for out of range day', () => {
        expect(() => UmAlQuraStatic.hijriToGregorian(1440, 1, -1)).toThrow('Invalid value for day. Must be between 1 and 30.');
    });

    it('gregorianToHijri() throws for out of range date', () => {
        expect(() => UmAlQuraStatic.gregorianToHijri(new Date(100, 1, 1))).toThrow(`Invalid value for epoch. Must be between ${UmAlQuraStatic['minDate'].getTime()} and ${UmAlQuraStatic['maxDate'].getTime()}.`);
    });

    it('addTime() throws for invalid unit', () => {
        // @ts-ignore
        expect(() => UmAlQuraStatic.addTime(new Date(), 5, 'invalid')).toThrow('Invalid value for `unit` param');
    });

    it('startOf() throws for invalid unit', () => {
        // @ts-ignore
        expect(() => UmAlQuraStatic.startOf(new Date(), 'invalid')).toThrow('Invalid value for `unit` param');
    });

    it('endOf() throws for invalid unit', () => {
        // @ts-ignore
        expect(() => UmAlQuraStatic.endOf(new Date(), 'invalid')).toThrow('Invalid value for `unit` param');
    });

    it('toDate() throws for invalid month end day', () => {
        // Ramadan 1440 is 29 days only
        expect(() => UmAlQuraStatic.toDate(1440, 9, 30)).toThrow('Invalid value for day for the given year/month. Day must be between 1 and 29.');
    });

    it('toDate() throws for invalid hour, minute, second and millisecond', () => {
        // Ramadan 1440 is 29 days only
        expect(() => UmAlQuraStatic.toDate(1440, 1, 1, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraStatic.toDate(1440, 1, 1, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraStatic.toDate(1440, 1, 1, 0, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraStatic.toDate(1440, 1, 1, 0, 0, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
    });
});

// Change the default mask so we can test locale registration
const testLocale = en;
testLocale.name = 'test-locale';
testLocale.masks.default = 'dddd';
