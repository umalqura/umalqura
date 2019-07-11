import UmAlQura from '../src/UmAlQura';
import UmAlQuraStatic from '../src/UmAlQuraStatic';

describe('constructor', () => {
    it('constructor() - Initializes using current date', () => {
        const now = new Date();
        const uq = new UmAlQura();
        const diff = Math.abs(uq.date.getTime() - now.getTime());
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(now);

        expect(diff).toBeLessThan(30 * 1000);
        expect(uq.hy).toBe(hy);
        expect(uq.hm).toBe(hm);
        expect(uq.hd).toBe(hd);
    });

    it('constructor(date) - Initializes using given date', () => {
        const d = new Date(2019, 6, 3);
        const uq = new UmAlQura(d);

        expect(uq.date).toEqual(d);
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });

    it('constructor(hy, hm, hd) - Initializes using given Hijri date', () => {
        const uq = new UmAlQura(1440, 10, 30);

        expect(uq.date).toEqual(new Date(2019, 6, 3));
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });

    it('constructor(hy, hm, hd, hour, minute, second, millisecond) - Initializes using given Hijri date and time', () => {
        const uq = new UmAlQura(1440, 10, 30, 19, 1, 15, 200);

        expect(uq.date).toEqual(new Date(2019, 6, 3, 19, 1, 15, 200));
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });
});

describe('Properties', () => {
    it('Forwards all props calls to UmAlQuraStatic', () => {
        const d = new Date(2019, 6, 3);
        const uq = new UmAlQura(d);

        expect(uq.dayOfYear).toBe(UmAlQuraStatic.getDayOfYear(d));
        expect(uq.dayOfMonth).toBe(UmAlQuraStatic.getDayOfMonth(d));
        expect(uq.dayOfWeek).toBe(UmAlQuraStatic.getDayOfWeek(d));
        expect(uq.weekOfYear).toBe(UmAlQuraStatic.getWeekOfYear(d));
        expect(uq.daysInYear).toBe(UmAlQuraStatic.getDaysInYear(uq.hy));
        expect(uq.daysInMonth).toBe(UmAlQuraStatic.getDaysInMonth(uq.hy, uq.hm));
        expect(uq.isLeapYear).toBe(UmAlQuraStatic.isLeapYear(uq.hy));
        expect(uq.monthArray).toEqual(UmAlQuraStatic.getMonthArray(d));
    });
});

describe('Methods', () => {
    it('Forwards all method calls to UmAlQuraStatic', () => {
        const d = new Date(2019, 6, 3);
        const uq = new UmAlQura(d);

        expect(uq.add(5, 'year').date).toEqual(UmAlQuraStatic.addYears(d, 5));
        expect(uq.add(5, 'month').date).toEqual(UmAlQuraStatic.addMonths(d, 5));
        expect(uq.add(5, 'week').date).toEqual(UmAlQuraStatic.addWeeks(d, 5));
        expect(uq.add(5, 'day').date).toEqual(UmAlQuraStatic.addDays(d, 5));
        expect(uq.subtract(5, 'year').date).toEqual(UmAlQuraStatic.addYears(d, -5));
        expect(uq.subtract(5, 'month').date).toEqual(UmAlQuraStatic.addMonths(d, -5));
        expect(uq.subtract(5, 'week').date).toEqual(UmAlQuraStatic.addWeeks(d, -5));
        expect(uq.subtract(5, 'day').date).toEqual(UmAlQuraStatic.addDays(d, -5));

        expect(uq.startOf('year').date).toEqual(UmAlQuraStatic.startOf(d, 'year'));
        expect(uq.startOf('month').date).toEqual(UmAlQuraStatic.startOf(d, 'month'));
        expect(uq.startOf('week').date).toEqual(UmAlQuraStatic.startOf(d, 'week'));
        expect(uq.startOf('day').date).toEqual(UmAlQuraStatic.startOf(d, 'day'));
        expect(uq.startOf('hour').date).toEqual(UmAlQuraStatic.startOf(d, 'hour'));
        expect(uq.startOf('minute').date).toEqual(UmAlQuraStatic.startOf(d, 'minute'));
        expect(uq.startOf('second').date).toEqual(UmAlQuraStatic.startOf(d, 'second'));
        expect(uq.endOf('year').date).toEqual(UmAlQuraStatic.endOf(d, 'year'));
        expect(uq.endOf('month').date).toEqual(UmAlQuraStatic.endOf(d, 'month'));
        expect(uq.endOf('week').date).toEqual(UmAlQuraStatic.endOf(d, 'week'));
        expect(uq.endOf('day').date).toEqual(UmAlQuraStatic.endOf(d, 'day'));
        expect(uq.endOf('hour').date).toEqual(UmAlQuraStatic.endOf(d, 'hour'));
        expect(uq.endOf('minute').date).toEqual(UmAlQuraStatic.endOf(d, 'minute'));
        expect(uq.endOf('second').date).toEqual(UmAlQuraStatic.endOf(d, 'second'));

        expect(uq.format('dd MM yyyy')).toBe(UmAlQuraStatic.format(d, 'dd MM yyyy'));
    });
});

describe('Immutability', () => {
    it('Manipulation methods are immutable', () => {
        const d = new Date(2019, 6, 3);
        const uq = new UmAlQura(d);

        let newUq = uq.add(1, 'year');
        expect(newUq === uq).toBeFalsy();

        newUq = uq.subtract(1, 'year');
        expect(newUq === uq).toBeFalsy();
    });
});

describe('Formatting', () => {
    it('Uses the supplied locale if present', () => {
        const d = new Date(2019, 6, 3);
        const locale = 'ar';
        expect(new UmAlQura(d).format('dd MM yyyy', locale)).toBe(UmAlQuraStatic.format(d, 'dd MM yyyy', locale));
    });
});

describe('Input validation', () => {
    // @ts-ignore
    it('add() throws for invalid unit', () => expect(() => new UmAlQura().add(1, 'invalid')).toThrow('Invalid value for `unit`'));
    // @ts-ignore
    it('subtract() throws for invalid unit', () => expect(() => new UmAlQura().subtract(1, 'invalid')).toThrow('Invalid value for `unit`'));
});
