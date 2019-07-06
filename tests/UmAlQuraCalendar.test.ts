import { en } from '../src/locale';
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
});

describe('Date part retreival', () => {
    it('getDayOfYear()', () => {
        const doy = UmAlQuraCalendar.getDayOfYear(new Date(2019, 6, 3));
        expect(doy).toBe(296);
    });

    it('gGetDayOfMonth()', () => {
        const dom = UmAlQuraCalendar.gGetDayOfMonth(new Date(2019, 6, 3));
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

    it('isLeapYear()', () => {
        const r = UmAlQuraCalendar.isLeapYear(1440);
        expect(r).toBeFalsy();
    });
});

describe('Formatting', () => {
    it('formats correctly', () => {
        const f = UmAlQuraCalendar.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/mm/yyyy HH:mm:ss.l', en);
        expect(f).toBe('30/10/1440 02:10:15.200');
    });

    it('formats english locale when no locale is given', () => {
        const f = UmAlQuraCalendar.format(new Date(2019, 6, 3, 2, 37, 15, 200), 'dd/mm/yyyy HH:mm:ss.l');
        expect(f).toBe('30/10/1440 02:10:15.200');
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
