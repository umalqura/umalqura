import UmAlQura from '../src/UmAlQura';

// TODO: Rework these test cases.
// While line and branch coverage are at 100%. Those tests do not cover All cases.

describe('isBefore()', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeTruthy());
    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeFalsy());
    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 499))).toBeFalsy());
    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 501).date)).toBeTruthy());
    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date)).toBeFalsy());
    it('ms', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 499).date)).toBeFalsy());

    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 31, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 29, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 31, 500).date, 'second')).toBeTruthy());
    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 29, 500).date, 'second')).toBeFalsy());

    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 31, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 29, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 31, 30, 500).date, 'minute')).toBeTruthy());
    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 29, 30, 500).date, 'minute')).toBeFalsy());

    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 13, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 11, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 13, 30, 30, 500).date, 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 11, 30, 30, 500).date, 'hour')).toBeFalsy());

    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 26, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 24, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 26, 12, 30, 30, 500).date, 'day')).toBeTruthy());
    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'day')).toBeFalsy());
    it('day', () => expect(uq.isBefore(new UmAlQura(1440, 10, 24, 12, 30, 30, 500).date, 'day')).toBeFalsy());

    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 27, 12, 30, 30, 500), 'week')).toBeTruthy()); // 27th is next week
    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 20, 12, 30, 30, 500), 'week')).toBeFalsy());  // 20th is same week
    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 19, 12, 30, 30, 500), 'week')).toBeFalsy());  // 19th is prev week
    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 27, 12, 30, 30, 500).date, 'week')).toBeTruthy()); // 27th is next week
    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 20, 12, 30, 30, 500).date, 'week')).toBeFalsy());  // 20th is same week
    it('week', () => expect(uq.isBefore(new UmAlQura(1440, 10, 19, 12, 30, 30, 500).date, 'week')).toBeFalsy());  // 19th is prev week

    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 11, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 9, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 11, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());
    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());
    it('month', () => expect(uq.isBefore(new UmAlQura(1440, 9, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());

    it('year', () => expect(uq.isBefore(new UmAlQura(1441, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isBefore(new UmAlQura(1439, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isBefore(new UmAlQura(1441, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
    it('year', () => expect(uq.isBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
    it('year', () => expect(uq.isBefore(new UmAlQura(1439, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
});

describe('isAfter()', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeFalsy());
    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeFalsy());
    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 499))).toBeTruthy());
    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 501).date)).toBeFalsy());
    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date)).toBeFalsy());
    it('ms', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 499).date)).toBeTruthy());

    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 31, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 29, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 31, 500).date, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 29, 500).date, 'second')).toBeTruthy());

    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 31, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 29, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 31, 30, 500).date, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 29, 30, 500).date, 'minute')).toBeTruthy());

    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 13, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 11, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 13, 30, 30, 500).date, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 11, 30, 30, 500).date, 'hour')).toBeTruthy());

    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 26, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 24, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 26, 12, 30, 30, 500).date, 'day')).toBeFalsy());
    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'day')).toBeFalsy());
    it('day', () => expect(uq.isAfter(new UmAlQura(1440, 10, 24, 12, 30, 30, 500).date, 'day')).toBeTruthy());

    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 27, 12, 30, 30, 500), 'week')).toBeFalsy());  // 27th is next week
    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 20, 12, 30, 30, 500), 'week')).toBeFalsy());  // 20th is same week
    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 19, 12, 30, 30, 500), 'week')).toBeTruthy()); // 19th is prev week
    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 27, 12, 30, 30, 500).date, 'week')).toBeFalsy());  // 27th is next week
    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 20, 12, 30, 30, 500).date, 'week')).toBeFalsy());  // 20th is same week
    it('week', () => expect(uq.isAfter(new UmAlQura(1440, 10, 19, 12, 30, 30, 500).date, 'week')).toBeTruthy()); // 19th is prev week

    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 11, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 9, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 11, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());
    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());
    it('month', () => expect(uq.isAfter(new UmAlQura(1440, 9, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());

    it('year', () => expect(uq.isAfter(new UmAlQura(1441, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isAfter(new UmAlQura(1439, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isAfter(new UmAlQura(1441, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
    it('year', () => expect(uq.isAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
    it('year', () => expect(uq.isAfter(new UmAlQura(1439, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
});

describe('isSame()', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeFalsy());
    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeTruthy());
    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 499))).toBeFalsy());
    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 501).date)).toBeFalsy());
    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date)).toBeTruthy());
    it('ms', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 499).date)).toBeFalsy());

    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 31, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 29, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 31, 500).date, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 29, 500).date, 'second')).toBeFalsy());

    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 31, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 29, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 31, 30, 500).date, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 29, 30, 500).date, 'minute')).toBeFalsy());

    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 13, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 11, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 13, 30, 30, 500).date, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 11, 30, 30, 500).date, 'hour')).toBeFalsy());

    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 26, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 24, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 26, 12, 30, 30, 500).date, 'day')).toBeFalsy());
    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'day')).toBeTruthy());
    it('day', () => expect(uq.isSame(new UmAlQura(1440, 10, 24, 12, 30, 30, 500).date, 'day')).toBeFalsy());

    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 27, 12, 30, 30, 500), 'week')).toBeFalsy());   // 27th is next week
    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 20, 12, 30, 30, 500), 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 19, 12, 30, 30, 500), 'week')).toBeFalsy());   // 19th is prev week
    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 27, 12, 30, 30, 500).date, 'week')).toBeFalsy());   // 27th is next week
    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 20, 12, 30, 30, 500).date, 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSame(new UmAlQura(1440, 10, 19, 12, 30, 30, 500).date, 'week')).toBeFalsy());   // 19th is prev week

    it('month', () => expect(uq.isSame(new UmAlQura(1440, 11, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isSame(new UmAlQura(1440, 9, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isSame(new UmAlQura(1440, 11, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());
    it('month', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());
    it('month', () => expect(uq.isSame(new UmAlQura(1440, 9, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());

    it('year', () => expect(uq.isSame(new UmAlQura(1441, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isSame(new UmAlQura(1439, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isSame(new UmAlQura(1441, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
    it('year', () => expect(uq.isSame(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
    it('year', () => expect(uq.isSame(new UmAlQura(1439, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
});

describe('isSameOrBefore()', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeTruthy());
    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeTruthy());
    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 499))).toBeFalsy());
    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 501).date)).toBeTruthy());
    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date)).toBeTruthy());
    it('ms', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 499).date)).toBeFalsy());

    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 31, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 29, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 31, 500).date, 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 29, 500).date, 'second')).toBeFalsy());

    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 31, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 29, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 31, 30, 500).date, 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 29, 30, 500).date, 'minute')).toBeFalsy());

    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 13, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 11, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 13, 30, 30, 500).date, 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 11, 30, 30, 500).date, 'hour')).toBeFalsy());

    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 26, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 24, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 26, 12, 30, 30, 500).date, 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 24, 12, 30, 30, 500).date, 'day')).toBeFalsy());

    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 27, 12, 30, 30, 500), 'week')).toBeTruthy());  // 27th is next week
    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 20, 12, 30, 30, 500), 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 19, 12, 30, 30, 500), 'week')).toBeFalsy());   // 19th is prev week
    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 27, 12, 30, 30, 500).date, 'week')).toBeTruthy());  // 27th is next week
    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 20, 12, 30, 30, 500).date, 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 19, 12, 30, 30, 500).date, 'week')).toBeFalsy());   // 19th is prev week

    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 11, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 9, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 11, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 9, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());

    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1441, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1439, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1441, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrBefore(new UmAlQura(1439, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
});

describe('isSameOrAfter()', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeFalsy());
    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeTruthy());
    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 499))).toBeTruthy());
    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 501).date)).toBeFalsy());
    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date)).toBeTruthy());
    it('ms', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 499).date)).toBeTruthy());

    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 31, 500), 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 29, 500), 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 31, 500).date, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'second')).toBeTruthy());
    it('sec', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 29, 500).date, 'second')).toBeTruthy());

    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 31, 30, 500), 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 29, 30, 500), 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 31, 30, 500).date, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'minute')).toBeTruthy());
    it('min', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 29, 30, 500).date, 'minute')).toBeTruthy());

    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 13, 30, 30, 500), 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 11, 30, 30, 500), 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 13, 30, 30, 500).date, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'hour')).toBeTruthy());
    it('hour', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 11, 30, 30, 500).date, 'hour')).toBeTruthy());

    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 26, 12, 30, 30, 500), 'day')).toBeFalsy());
    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 24, 12, 30, 30, 500), 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 26, 12, 30, 30, 500).date, 'day')).toBeFalsy());
    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'day')).toBeTruthy());
    it('day', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 24, 12, 30, 30, 500).date, 'day')).toBeTruthy());

    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 27, 12, 30, 30, 500), 'week')).toBeFalsy());   // 27th is next week
    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 20, 12, 30, 30, 500), 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 19, 12, 30, 30, 500), 'week')).toBeTruthy());  // 19th is prev week
    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 27, 12, 30, 30, 500).date, 'week')).toBeFalsy());   // 27th is next week
    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 20, 12, 30, 30, 500).date, 'week')).toBeTruthy());  // 20th is same week
    it('week', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 19, 12, 30, 30, 500).date, 'week')).toBeTruthy());  // 19th is prev week

    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 11, 25, 12, 30, 30, 500), 'month')).toBeFalsy());
    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 9, 25, 12, 30, 30, 500), 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 11, 25, 12, 30, 30, 500).date, 'month')).toBeFalsy());
    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());
    it('month', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 9, 25, 12, 30, 30, 500).date, 'month')).toBeTruthy());

    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1441, 10, 25, 12, 30, 30, 500), 'year')).toBeFalsy());
    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1439, 10, 25, 12, 30, 30, 500), 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1441, 10, 25, 12, 30, 30, 500).date, 'year')).toBeFalsy());
    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1440, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
    it('year', () => expect(uq.isSameOrAfter(new UmAlQura(1439, 10, 25, 12, 30, 30, 500).date, 'year')).toBeTruthy());
});

describe('isBetween() exclusive from/to', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500))).toBeFalsy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeFalsy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501))).toBeTruthy());

    it('sec', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 29, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 31, 500), false, false, 'second')).toBeFalsy());
    it('sec', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 29, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 31, 500), false, false, 'second')).toBeTruthy());

    it('min', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 29, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 31, 30, 500), false, false, 'minute')).toBeFalsy());
    it('min', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 29, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 31, 30, 500), false, false, 'minute')).toBeTruthy());

    it('hour', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 11, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 13, 30, 30, 500), false, false, 'hour')).toBeFalsy());
    it('hour', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 11, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 14, 30, 30, 500), false, false, 'hour')).toBeTruthy());

    it('day', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 24, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'day')).toBeFalsy());
    it('day', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 26, 12, 30, 30, 500), false, false, 'day')).toBeFalsy());
    it('day', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 24, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 26, 12, 30, 30, 500), false, false, 'day')).toBeTruthy());

    // 19th is prev week
    // 20th is same week
    // 27th is next week
    it('week', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 19, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 20, 12, 30, 30, 500), false, false, 'week')).toBeFalsy());
    it('week', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 20, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 27, 12, 30, 30, 500), false, false, 'week')).toBeFalsy());
    it('week', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 19, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 27, 12, 30, 30, 500), false, false, 'week')).toBeTruthy());

    it('month', () => expect(uq.isBetween(
        new UmAlQura(1440, 9, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'month')).toBeFalsy());
    it('month', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 11, 25, 12, 30, 30, 500), false, false, 'month')).toBeFalsy());
    it('month', () => expect(uq.isBetween(
        new UmAlQura(1440, 9, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 11, 25, 12, 30, 30, 500), false, false, 'month')).toBeTruthy());

    it('year', () => expect(uq.isBetween(
        new UmAlQura(1439, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, false, 'year')).toBeFalsy());
    it('year', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1441, 10, 25, 12, 30, 30, 500), false, false, 'year')).toBeFalsy());
    it('year', () => expect(uq.isBetween(
        new UmAlQura(1439, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1441, 10, 25, 12, 30, 30, 500), false, false, 'year')).toBeTruthy());
});

describe('isBetween() inclusive from/to', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), true, true)).toBeTruthy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), true, true)).toBeTruthy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), true, true)).toBeTruthy());
});

describe('isBetween() exclusive from, inclusive to', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), false, true)).toBeTruthy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), false, true)).toBeFalsy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), false, true)).toBeTruthy());
});

describe('isBetween() inclusive from, exclusive to', () => {
    const uq = new UmAlQura(1440, 10, 25, 12, 30, 30, 500);

    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500), true, false)).toBeFalsy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 500),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), true, false)).toBeTruthy());
    it('ms', () => expect(uq.isBetween(
        new UmAlQura(1440, 10, 25, 12, 30, 30, 499),
        new UmAlQura(1440, 10, 25, 12, 30, 30, 501), true, false)).toBeTruthy());
});
