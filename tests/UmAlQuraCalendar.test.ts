import { ar, en } from '../src/locale';
import UmAlQuraCalendar from '../src/UmAlQuraCalendar';

describe('Date conversion', () => {
    it('gregorianToHijri() - direct map match', () => {
        const d = new Date(1901, 3, 19);
        const { hy, hm, hd } = UmAlQuraCalendar.gregorianToHijri(d);

        expect(hy).toBe(1319);
        expect(hm).toBe(1);
        expect(hd).toBe(1);
    });

    it('gregorianToHijri()', () => {
        const d = new Date(2019, 6, 3);
        const { hy, hm, hd } = UmAlQuraCalendar.gregorianToHijri(d);

        expect(hy).toBe(1440);
        expect(hm).toBe(10);
        expect(hd).toBe(30);
    });

    it('hijriToGregorian()', () => {
        const { gy, gm, gd } = UmAlQuraCalendar.hijriToGregorian(1440, 10, 30);

        expect(gy).toBe(2019);
        expect(gm).toBe(6);
        expect(gd).toBe(3);
    });

    it('toDate()', () => {
        const r = UmAlQuraCalendar.toDate(1440, 10, 30, 1, 5, 10, 20);
        expect(r.getTime()).toBe(new Date(2019, 6, 3, 1, 5, 10, 20).getTime());
    });
});

describe('Date manipulation', () => {
    it('addYears()', () => {
        const d = UmAlQuraCalendar.addYears(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2024);
        expect(d.getMonth()).toBe(4);
        expect(d.getDate()).toBe(8);
    });

    it('addMonths()', () => {
        const d = UmAlQuraCalendar.addMonths(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(10);
        expect(d.getDate()).toBe(27);
    });

    it('addMonths() - negative', () => {
        const d = UmAlQuraCalendar.addMonths(new Date(2019, 6, 3), -10);

        expect(d.getFullYear()).toBe(2018);
        expect(d.getMonth()).toBe(8);
        expect(d.getDate()).toBe(10);
    });

    it('addMonths() - before 29th of month', () => {
        const d = UmAlQuraCalendar.addMonths(new Date(2019, 6, 1), 1);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(6);
        expect(d.getDate()).toBe(31);
    });

    it('addWeeks()', () => {
        const d = UmAlQuraCalendar.addWeeks(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(7);
        expect(d.getDate()).toBe(7);
    });

    it('addDays()', () => {
        const d = UmAlQuraCalendar.addDays(new Date(2019, 6, 3), 5);

        expect(d.getFullYear()).toBe(2019);
        expect(d.getMonth()).toBe(6);
        expect(d.getDate()).toBe(8);
    });
});

describe('Date part retreival', () => {
    it('getDayOfYear()', () => {
        const doy = UmAlQuraCalendar.getDayOfYear(new Date(2019, 6, 3));
        expect(doy).toBe(296);
    });

    it('gGetDayOfMonth()', () => {
        const dom = UmAlQuraCalendar.getDayOfMonth(new Date(2019, 6, 3));
        expect(dom).toBe(30);
    });

    it('getDayOfWeek()', () => {
        const dow = UmAlQuraCalendar.getDayOfWeek(new Date(2019, 6, 3));
        expect(dow).toBe(3); // Wednesday
    });

    it('getWeekOfYear()', () => {
        const woy = UmAlQuraCalendar.getWeekOfYear(new Date(2019, 6, 3));
        expect(woy).toBe(43); // Wednesday
    });

    it('getDaysInYear()', () => {
        const r1 = UmAlQuraCalendar.getDaysInYear(1440);
        expect(r1).toBe(354);

        const r2 = UmAlQuraCalendar.getDaysInYear(1441);
        expect(r2).toBe(355);
    });

    it('getDaysInMonth()', () => {
        const r = UmAlQuraCalendar.getDaysInMonth(1440, 10);
        expect(r).toBe(30);
    });

    it('getYear()', () => {
        const r = UmAlQuraCalendar.getYear(new Date(2019, 6, 3));
        expect(r).toBe(1440);
    });

    it('getMonth()', () => {
        const r = UmAlQuraCalendar.getMonth(new Date(2019, 6, 3));
        expect(r).toBe(10);
    });

    it('getMonthArray()', () => {
        const arr = UmAlQuraCalendar.getMonthArray(new Date(2019, 6, 3));
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
        const startOfYear = UmAlQuraCalendar.startOf(d, 'year');
        const startOfMonth = UmAlQuraCalendar.startOf(d, 'month');
        const startOfWeek = UmAlQuraCalendar.startOf(d, 'week');
        const startOfDay = UmAlQuraCalendar.startOf(d, 'day');
        const startOfHour = UmAlQuraCalendar.startOf(d, 'hour');
        const startOfMinute = UmAlQuraCalendar.startOf(d, 'minute');
        const startOfSecond = UmAlQuraCalendar.startOf(d, 'second');

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
        const endOfYear = UmAlQuraCalendar.endOf(d, 'year');
        const endOfMonth = UmAlQuraCalendar.endOf(d, 'month');
        const endOfWeek = UmAlQuraCalendar.endOf(d, 'week');
        const endOfDay = UmAlQuraCalendar.endOf(d, 'day');
        const endOfHour = UmAlQuraCalendar.endOf(d, 'hour');
        const endOfMinute = UmAlQuraCalendar.endOf(d, 'minute');
        const endOfSecond = UmAlQuraCalendar.endOf(d, 'second');

        expect(endOfYear).toEqual(new Date(2019, 7, 30, 23, 59, 59, 999));
        expect(endOfMonth).toEqual(new Date(2019, 6, 3, 23, 59, 59, 999));
        expect(endOfWeek).toEqual(new Date(2019, 6, 6, 23, 59, 59, 999));
        expect(endOfDay).toEqual(new Date(2019, 6, 3, 23, 59, 59, 999));
        expect(endOfHour).toEqual(new Date(2019, 6, 3, 14, 59, 59, 999));
        expect(endOfMinute).toEqual(new Date(2019, 6, 3, 14, 47, 59, 999));
        expect(endOfSecond).toEqual(new Date(2019, 6, 3, 14, 47, 35, 999));
    });

    it('isLeapYear()', () => {
        const r = UmAlQuraCalendar.isLeapYear(1440);
        expect(r).toBeFalsy();
    });
});

describe('Locale', () => {
    it('sets locale and uses it for formatting', () => {
        UmAlQuraCalendar.setLocale(ar);
        const f = UmAlQuraCalendar.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/mm/yyyy HH:mm:ss.l');
        expect(f).toBe('٣٠/١٠/١٤٤٠ ٠٢:١٠:١٥.٢٠٠');

        // Put the locale back to its original state
        UmAlQuraCalendar.setLocale(en);
    });
});

describe('Formatting', () => {
    it('formats correctly with default locale as English', () => {
        const f = UmAlQuraCalendar.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/mm/yyyy HH:mm:ss.l');
        expect(f).toBe('30/10/1440 02:10:15.200');
    });

    it('can override global locale', () => {
        const f = UmAlQuraCalendar.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/mm/yyyy HH:mm:ss.l', ar);
        expect(f).toBe('٣٠/١٠/١٤٤٠ ٠٢:١٠:١٥.٢٠٠');
    });
});

describe('Input validation', () => {
    it('hijriToGregorian() throws for out of range year', () => {
        expect(() => UmAlQuraCalendar.hijriToGregorian(1300, 1, 1)).toThrow('Invalid value for year. Must be between 1318 and 1500.');
    });

    it('hijriToGregorian() throws for out of range month', () => {
        expect(() => UmAlQuraCalendar.hijriToGregorian(1440, -1, 1)).toThrow('Invalid value for month. Must be between 1 and 12.');
    });

    it('hijriToGregorian() throws for out of range day', () => {
        expect(() => UmAlQuraCalendar.hijriToGregorian(1440, 1, -1)).toThrow('Invalid value for day. Must be between 1 and 30.');
    });

    it('gregorianToHijri() throws for out of range date', () => {
        expect(() => UmAlQuraCalendar.gregorianToHijri(new Date(100, 1, 1))).toThrow('Invalid value for epoch. Must be between -2198718412000 and 3404321999999.');
    });

    it('startOf() throws for invalid unit', () => {
        // @ts-ignore
        expect(() => UmAlQuraCalendar.startOf(new Date(), 'invalid')).toThrow('Invalid value for `unit` param');
    });

    it('endOf() throws for invalid unit', () => {
        // @ts-ignore
        expect(() => UmAlQuraCalendar.endOf(new Date(), 'invalid')).toThrow('Invalid value for `unit` param');
    });

    it('toDate() throws for invalid month end day', () => {
        // Ramadan 1440 is 29 days only
        expect(() => UmAlQuraCalendar.toDate(1440, 9, 30)).toThrow('Invalid value for day for the given year/month. Day must be between 1 and 29.');
    });

    it('toDate() throws for invalid hour, minute, second and millisecond', () => {
        // Ramadan 1440 is 29 days only
        expect(() => UmAlQuraCalendar.toDate(1440, 1, 1, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraCalendar.toDate(1440, 1, 1, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraCalendar.toDate(1440, 1, 1, 0, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
        expect(() => UmAlQuraCalendar.toDate(1440, 1, 1, 0, 0, 0, -1)).toThrow('Invalid value for hour, minute, second or millisecond.');
    });
});
