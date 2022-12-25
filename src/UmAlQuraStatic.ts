import DateMapping from './DateMapping';
import DatePart from './DatePart';
import { format } from './format';
import { ar, en, Locale } from './locale';
import { UnitOfTime } from './units';

/**
 * Modified by Abdullah Ali <abdullah.dev3@gmail.com> - 2022 - Add dates back to 1276/01/01 - 1859/07/30.
 * Based on jquery.calendars.ummalqura.js from http://keith-wood.name/calendars.html
 **/

/// Calendar support range:
///     Calendar    Minimum     Maximum
///     ==========  ==========  ==========
///     Gregorian   1859/07/30  2077/11/16
///     UmAlQura    1276/01/01  1500/12/30
class UmAlQuraStatic {
    // private static readonly maxSeconds = 9223372036854775807 / 10000000;
    // private static readonly minSeconds = -9223372036854775807 / 10000000;
    private static readonly millisPerSecond = 1000;
    private static readonly millisPerMinute = UmAlQuraStatic.millisPerSecond * 60;
    private static readonly millisPerHour = UmAlQuraStatic.millisPerMinute * 60;
    private static readonly millisPerDay = UmAlQuraStatic.millisPerHour * 24;

    private static readonly minDate = new Date(1859, 6, 30);
    private static readonly maxDate = new Date(2077, 10, 16, 23, 59, 59, 999);

    private static readonly hijriYearData = UmAlQuraStatic._initDateMapping();

    // Holds globally set locale
    private static locale = en;
    // Holds registered locales
    private static locales: { [name: string]: Locale } = {};

    private static readonly minCalendarYear = 1276;
    private static readonly maxCalendarYear = 1500;

    /**
     * Coverts the given Hijri date to Gregorian.
     * @param hy The Hijri year
     * @param hm The Hijri month
     * @param hd The Hijri day
     */
    public static hijriToGregorian(hy: number, hm: number, hd: number) {
        this._checkYearRange(hy);
        this._checkMonthRange(hm);
        this._checkDayRange(hd);

        let nDays = hd - 1;

        const index = hy - this.minCalendarYear;
        let dt = this.hijriYearData[index].gregorianDate;
        let b = this.hijriYearData[index].hijriMonthsLengthFlags;
        for (let m = 1; m < hm; m++) {
            nDays = nDays + 29 + (b & 1);
            b >>= 1;
        }

        dt = this.addDays(dt, nDays);

        return {
            gy: dt.getFullYear(),
            gm: dt.getMonth(),
            gd: dt.getDate(),
        };
    }

    /**
     * Coverts the given Gregorian date to Hijri year, month and day.
     * @param date The date to be converted
     */
    public static gregorianToHijri(date: Date) {
        this._checkMillsRange(date.getTime());

        // Find the index where we should start our search by quessing the Hijri year that we will be in HijriYearInfo.
        // A Hijri year is 354 or 355 days.  Use 355 days so that we will search from a lower index.

        let index = Math.trunc((date.getTime() - this.minDate.getTime()) / this.millisPerDay / 355);

        do {
        } while (date.getTime() > this.hijriYearData[++index].gregorianDate.getTime());

        if (date.getTime() !== this.hijriYearData[index].gregorianDate.getTime()) {
            index--;
        }

        let nDays = this._dayDiff(date, this.hijriYearData[index].gregorianDate);
        const yh1 = index + this.minCalendarYear;
        let mh1 = 1;
        let dh1 = 1;
        let b = this.hijriYearData[index].hijriMonthsLengthFlags;
        let daysPerThisMonth = 29 + (b & 1);

        while (nDays >= daysPerThisMonth) {
            nDays -= daysPerThisMonth;
            b >>= 1;
            daysPerThisMonth = 29 + (b & 1);
            mh1++;
        }
        dh1 += Math.trunc(nDays);

        return {
            hy: yh1,
            hm: mh1,
            hd: dh1,
        };
    }

    /**
     * Adds the specified amount of Hijri years to the given Gregorian date.
     * @param date The date
     * @param hys The Hijri years to be added
     */
    public static addYears(date: Date, hys: number) {
        return this.addMonths(date, hys * 12);
    }

    /**
     * Adds the specified amount of Hijri months to the given Gregorian date.
     * @param date The date
     * @param hms The Hijri months to be added
     */
    public static addMonths(date: Date, hms: number) {
        // Get the date in UmAlQura calendar.
        let y = this._getDatePart(date, DatePart.Year);
        let m = this._getDatePart(date, DatePart.Month);
        let d = this._getDatePart(date, DatePart.Day);
        const i = m - 1 + hms;

        if (i >= 0) {
            m = i % 12 + 1;
            y += Math.trunc(i / 12);
        } else {
            m = 12 + (i + 1) % 12;
            y += Math.trunc((i - 11) / 12);
        }

        if (d > 29) {
            const days = this.getDaysInMonth(y, m);
            if (d > days) {
                d = days;
            }
        }

        const { gy, gm, gd } = this.hijriToGregorian(y, m, d);
        return this._setTime(new Date(gy, gm, gd), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    /**
     * Adds the specified amount of weeks to the given Gregorian date.
     * @param date The date
     * @param wks The weeks to be added
     */
    public static addWeeks(date: Date, wks: number) {
        return this.addDays(date, wks * 7);
    }

    /**
     * Adds the specified amount of days to the given Gregorian date.
     * @param date The date
     * @param days The days to be added
     */
    public static addDays(date: Date, days: number) {
        const d = new Date(date.valueOf());
        d.setDate(d.getDate() + days);
        return d;
    }

    /**
     * Adds the specified amount of units to the given Gregorian date.
     * @param date The date
     * @param value The amount of `unit`s to add
     * @param unit The unit of time
     */
    public static addTime(date: Date, value: number, unit: 'hour' | 'minute' | 'second' | 'millisecond') {
        const d = new Date(date.valueOf());

        switch (unit) {
            case 'hour':
                d.setHours(d.getHours() + value);
                break;
            case 'minute':
                d.setMinutes(d.getMinutes() + value);
                break;
            case 'second':
                d.setSeconds(d.getSeconds() + value);
                break;
            case 'millisecond':
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            default:
                throw new Error('Invalid value for `unit` param');
        }

        return d;
    }

    /**
     * Returns the Hijri day of year for the specified Gregorian date.
     * @param date The date
     */
    public static getDayOfYear(date: Date) {
        return this._getDatePart(date, DatePart.DayOfYear);
    }

    /**
     * Returns the Hijri day of month for the specified Gregorian date.
     * @param date The date
     */
    public static getDayOfMonth(date: Date) {
        return this._getDatePart(date, DatePart.Day);
    }

    /**
     * Returns the day of week for the specified Gregorian date.
     * @param date The date
     */
    public static getDayOfWeek(date: Date) {
        return date.getDay();
    }

    /**
     * Returns the Hijri week of year for the specified Gregorian date.
     * @param date The date
     */
    public static getWeekOfYear(date: Date) {
        const firstDayOfYear = this.startOf(date, 'year').getDay();
        const daysToDayOfWeek = firstDayOfYear - date.getDay();

        const d = this.addDays(date, daysToDayOfWeek);
        return Math.ceil(this.getDayOfYear(d) / 7);
    }

    /**
     * Returns the number of days in the specified Hijri year.
     * @param hy The Hijri year
     */
    public static getDaysInYear(hy: number) {
        this._checkYearRange(hy);

        let days = 0;
        let b = this.hijriYearData[hy - this.minCalendarYear].hijriMonthsLengthFlags;

        for (let m = 1; m <= 12; m++) {
            days = days + 29 + (b & 1);
            b >>= 1;
        }

        if (days !== 354 && days !== 355) {
            throw new Error('Days in year assert error. This is possibly a bug.');
        }

        return days;
    }

    /**
     * Returns the number of days in the specified Hijri year and month.
     * @param hy The Hijri year
     * @param hm The Hijri month
     */
    public static getDaysInMonth(hy: number, hm: number) {
        this._checkYearRange(hy);
        this._checkMonthRange(hm);

        if ((this.hijriYearData[hy - this.minCalendarYear].hijriMonthsLengthFlags & (1 << hm - 1)) === 0) {
            return 29;
        } else {
            return 30;
        }
    }

    /**
     * Returns the Hijri year corresponding to the given Gregorian date.
     * @param date The date
     */
    public static getYear(date: Date) {
        return this._getDatePart(date, DatePart.Year);
    }

    /**
     * Returns the Hijri month corresponding to the given Gregorian date.
     * @param date The date
     */
    public static getMonth(date: Date) {
        return this._getDatePart(date, DatePart.Month);
    }

    /**
     * Returns the Hijri month array for the given Gregorian date.
     * @param date The date
     */
    public static getMonthArray(date: Date) {
        const weeks: Array<Array<Date | null>> = [];
        const month = this.getMonth(date);
        const start = this.startOf(this.startOf(date, 'month'), 'week');
        const end = this.endOf(this.endOf(date, 'month'), 'week');

        let i = 0;
        while (start < end) {
            const w = Math.floor(i / 7);
            const day = new Date(start.valueOf());

            weeks[w] = weeks[w] || [];
            weeks[w].push(this.getMonth(day) === month ? day : null);
            start.setDate(start.getDate() + 1);
            i++;
        }

        return weeks;
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date starting at the specified unit of time.
     * @param date: The date
     * @param unit: The unit of time
     */
    public static startOf(date: Date, unit: UnitOfTime) {
        let d = new Date(date);
        const { hy, hm } = this.gregorianToHijri(d);

        switch (unit) {
            case 'year':
                return this.toDate(hy, 1, 1, 0, 0, 0, 0);
            case 'month':
                return this.toDate(hy, hm, 1, 0, 0, 0, 0);
            case 'week':
                const dow = this.getDayOfWeek(d);
                d = this.addDays(d, -dow);
            case 'day':
                d.setHours(0);
            case 'hour':
                d.setMinutes(0);
            case 'minute':
                d.setSeconds(0);
            case 'second':
                d.setMilliseconds(0);
                break;
            default:
                throw new Error('Invalid value for `unit` param');
        }

        return d;
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date ending at the specified unit of time.
     * @param date: The date
     * @param unit: The unit of time
     */
    public static endOf(date: Date, unit: UnitOfTime) {
        let d = new Date(date);
        const { hy, hm } = this.gregorianToHijri(d);
        let daysInMonth;

        switch (unit) {
            case 'year':
                daysInMonth = this.getDaysInMonth(hy, 12);
                return this.toDate(hy, 12, daysInMonth, 23, 59, 59, 999);
            case 'month':
                daysInMonth = this.getDaysInMonth(hy, hm);
                return this.toDate(hy, hm, daysInMonth, 23, 59, 59, 999);
            case 'week':
                const dow = this.getDayOfWeek(d);
                d = this.addDays(d, 6 - dow);
            case 'day':
                d.setHours(23);
            case 'hour':
                d.setMinutes(59);
            case 'minute':
                d.setSeconds(59);
            case 'second':
                d.setMilliseconds(999);
                break;
            default:
                throw new Error('Invalid value for `unit` param');
        }

        return d;
    }

    /**
     * Returns whether or not the given Hijri year is a leap year.
     * A Hijri leap year is where the number of days in that year is 355.
     * @param hy The Hijri year
     */
    public static isLeapYear(hy: number) {
        return this.getDaysInYear(hy) === 355;
    }

    /**
     * Converts the specified Hijri date time to a Gregorian Date instance.
     * @param hy The Hijri year
     * @param hm The Hijri month
     * @param hd The Hijri day
     * @param hour The Hour component
     * @param minute The Minute component
     * @param second The Second component
     * @param millisecond The Millisecond component
     */
    public static toDate(hy: number, hm: number, hd: number, hour: number = 0, minute: number = 0, second: number = 0, millisecond: number = 0) {
        const daysInMonth = this.getDaysInMonth(hy, hm);

        if (hd < 1 || hd > daysInMonth) {
            throw new Error(`Invalid value for day for the given year/month. Day must be between 1 and ${daysInMonth}.`);
        }

        if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60 || second < 0 || second >= 60 || millisecond < 0 || millisecond >= this.millisPerSecond) {
            throw new Error('Invalid value for hour, minute, second or millisecond.');
        }

        const { gy, gm, gd } = this.hijriToGregorian(hy, hm, hd);
        return this._setTime(new Date(gy, gm, gd), hour, minute, second, millisecond);
    }

    /**
     * Formats the specified Gregorian Date instance in Hijri date.
     * @param date The date
     * @param mask The format mask
     * @param locale The locale to use. If omitted, uses the globally set locale or the default locale.
     */
    public static format(date: Date, mask: string, locale?: string) {
        const { hy, hm, hd } = this.gregorianToHijri(date);
        return format(date, mask,
            locale ? this._loadLocale(locale) : this.locale,
            hy, hm, hd,
            this.getWeekOfYear(date),
            this.getDayOfWeek(date));
    }

    /**
     * Sets global locale to be used for formatting.
     * @param locale The locale
     */
    public static setLocale(locale: string) {
        this.locale = this._loadLocale(locale);
    }

    /**
     * Registers the specified locale.
     * @param locale The locale
     */
    public static registerLocale(locale: Locale) {
        if (!locale.name) {
            throw new Error(`The locale's 'name' property must not be empty.`);
        }

        if (this.locales[locale.name]) {
            throw new Error(`A locale with the same name '${locale.name}' is already registered.`);
        }

        this.locales[locale.name] = locale;
    }

    private static _loadLocale(locale: string) {
        if (this.locales[locale]) {
            return this.locales[locale];
        }

        console.warn(`The requested locale '${locale}' could not be found. Using the default locale instead.`);
        return en;
    }

    private static _getDatePart(date: Date, part: DatePart) {
        const { hy, hm, hd } = this.gregorianToHijri(date);

        switch (part) {
            case DatePart.Year:
                return hy;
            case DatePart.Month:
                return hm;
            case DatePart.Day:
                return hd;
            case DatePart.DayOfYear:
                return Math.trunc(this._getAbsoluteDateUmAlQura(hy, hm, hd) - this._getAbsoluteDateUmAlQura(hy, 1, 1) + 1);
        }
    }

    private static _setTime(date: Date, hour: number, minute: number, second: number, millisecond: number) {
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(second);
        date.setMilliseconds(millisecond);
        return date;
    }

    private static _getAbsoluteDateUmAlQura(hy: number, hm: number, hd: number) {
        const { gy, gm, gd } = this.hijriToGregorian(hy, hm, hd);
        return new Date(gy, gm, gd).getTime() / this.millisPerDay;
    }

    private static _checkYearRange(hy: number) {
        if (hy < this.minCalendarYear || hy > this.maxCalendarYear) {
            throw new Error(`Invalid value for year. Must be between ${this.minCalendarYear} and ${this.maxCalendarYear}.`);
        }
    }

    private static _checkMonthRange(hm: number) {
        if (hm < 1 || hm > 12) {
            throw new Error(`Invalid value for month. Must be between 1 and 12.`);
        }
    }

    private static _checkDayRange(day: number) {
        if (day < 1 || day > 30) {
            throw new Error(`Invalid value for day. Must be between 1 and 30.`);
        }
    }

    private static _checkMillsRange(millis: number) {
        if (millis < this.minDate.getTime() || millis > this.maxDate.getTime()) {
            throw new Error(`Invalid value for epoch. Must be between ${this.minDate.getTime()} and ${this.maxDate.getTime()}.`);
        }
    }

    private static _dayDiff(date: Date, other: Date) {
        return (date.getTime() - other.getTime()) / (1000 * 60 * 60 * 24);
    }

    private static _initDateMapping() {
        const rawData = [
            // This data is auto generated from the .net BCL which seemed the most accurate
            // Other source which have been found having abnormalities include:
            // http://www.staff.science.uu.nl/~gent0113/islam/addfiles/islamcalendar_dat.js - Has 28 days in one of the month which is impossible
            // http://www.ummulqura.org.sa/ - Has several inaccurate dates
            // Generated by /personal-proj/umalqura/data-gen
            /*  DaysPerM  GY   GM  GD      D1   D2   D3   D4   D5   D6   D7   D8   D9   D10  D11  D12
            1276*/0x0D55, 1859, 7, 30,  /* 1    0    1    0    1    0    1    0    1    0    1    1    1859-07-30
            1277*/0x0555, 1860, 7, 19,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1860-07-19
            1278*/0x0D55, 1861, 7, 8,   /* 1    0    1    0    1    0    1    0    1    0    1    1    1861-07-08
            1279*/0x0555, 1862, 6, 28,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1862-06-28
            1280*/0x0555, 1863, 6, 17,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1863-06-17
            1281*/0x0D55, 1864, 6, 5,   /* 1    0    1    0    1    0    1    0    1    0    1    1    1864-06-05
            1282*/0x0555, 1865, 5, 26,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1865-05-26
            1283*/0x0555, 1866, 5, 15,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1866-05-15
            1284*/0x0D55, 1867, 5, 4,   /* 1    0    1    0    1    0    1    0    1    0    1    1    1867-05-04
            1285*/0x0555, 1868, 4, 23,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1868-04-23
            1286*/0x0D55, 1869, 4, 12,  /* 1    0    1    0    1    0    1    0    1    0    1    1    1869-04-12
            1287*/0x0555, 1870, 4, 2,   /* 1    0    1    0    1    0    1    0    1    0    1    0    1870-04-02
            1288*/0x0555, 1871, 3, 22,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1871-03-22
            1289*/0x0D55, 1872, 3, 10,  /* 1    0    1    0    1    0    1    0    1    0    1    1    1872-03-10
            1290*/0x0555, 1873, 2, 28,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1873-02-28
            1291*/0x0555, 1874, 2, 17,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1874-02-17
            1292*/0x0D55, 1875, 2, 6,   /* 1    0    1    0    1    0    1    0    1    0    1    1    1875-02-06
            1293*/0x0555, 1876, 1, 27,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1876-01-27
            1294*/0x0555, 1877, 1, 15,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1877-01-15
            1295*/0x0D55, 1878, 1, 4,   /* 1    0    1    0    1    0    1    0    1    0    1    1    1878-01-04
            1296*/0x0555, 1878, 12, 25, /* 1    0    1    0    1    0    1    0    1    0    1    0    1878-12-25
            1297*/0x0D55, 1879, 12, 14, /* 1    0    1    0    1    0    1    0    1    0    1    1    1879-12-14
            1298*/0x0555, 1880, 12, 3,  /* 1    0    1    0    1    0    1    0    1    0    1    0    1880-12-03
            1299*/0x0555, 1881, 11, 22, /* 1    0    1    0    1    0    1    0    1    0    1    0    1881-11-22
            1300*/0x054B, 1882, 11, 11, /* 1    1    0    1    0    0    1    0    1    0    1    0    1882-11-11
            1301*/0x0C97, 1883, 10, 31, /* 1    1    1    0    1    0    0    1    0    0    1    1    1883-10-31
            1302*/0x092E, 1884, 10, 20, /* 0    1    1    1    0    1    0    0    1    0    0    1    1884-10-20
            1303*/0x026E, 1885, 10, 9,  /* 0    1    1    1    0    1    1    0    0    1    0    0    1885-10-09
            1304*/0x056D, 1886, 9, 28,  /* 1    0    1    1    0    1    1    0    1    0    1    0    1886-09-28
            1305*/0x0AEA, 1887, 9, 18,  /* 0    1    0    1    0    1    1    1    0    1    0    1    1887-09-18
            1306*/0x06D2, 1888, 9, 7,   /* 0    1    0    0    1    0    1    1    0    1    1    0    1888-09-07
            1307*/0x06A5, 1889, 8, 27,  /* 1    0    1    0    0    1    0    1    0    1    1    0    1889-08-27
            1308*/0x052D, 1890, 8, 16,  /* 1    0    1    1    0    1    0    0    1    0    1    0    1890-08-16
            1309*/0x025B, 1891, 8, 5,   /* 1    1    0    1    1    0    1    0    0    1    0    0    1891-08-05
            1310*/0x04BB, 1892, 7, 24,  /* 1    1    0    1    1    1    0    1    0    0    1    0    1892-07-24
            1311*/0x09BA, 1893, 7, 14,  /* 0    1    0    1    1    1    0    1    1    0    0    1    1893-07-14
            1312*/0x03B4, 1894, 7, 4,   /* 0    0    1    0    1    1    0    1    1    1    0    0    1894-07-04
            1313*/0x0BA9, 1895, 6, 23,  /* 1    0    0    1    0    1    0    1    1    1    0    1    1895-06-23
            1314*/0x0B52, 1896, 6, 12,  /* 0    1    0    0    1    0    1    0    1    1    0    1    1896-06-12
            1315*/0x0AA5, 1897, 6, 1,   /* 1    0    1    0    0    1    0    1    0    1    0    1    1897-06-01
            1316*/0x052D, 1898, 5, 21,  /* 1    0    1    1    0    1    0    0    1    0    1    0    1898-05-21
            1317*/0x0B6D, 1899, 5, 10,  /* 1    0    1    1    0    1    1    0    1    1    0    1    1899-05-10
            1318*/0x02EA, 1900, 4, 30,  /* 0    1    0    1    0    1    1    1    0    1    0    0    1900-04-30
            1319*/0x06E9, 1901, 4, 19,  /* 1    0    0    1    0    1    1    1    0    1    1    0    1901-04-19
            1320*/0x0ED2, 1902, 4, 9,   /* 0    1    0    0    1    0    1    1    0    1    1    1    1902-04-09
            1321*/0x0EA4, 1903, 3, 30,  /* 0    0    1    0    0    1    0    1    0    1    1    1    1903-03-30
            1322*/0x0D4A, 1904, 3, 18,  /* 0    1    0    1    0    0    1    0    1    0    1    1    1904-03-18
            1323*/0x0A96, 1905, 3, 7,   /* 0    1    1    0    1    0    0    1    0    1    0    1    1905-03-07
            1324*/0x0536, 1906, 2, 24,  /* 0    1    1    0    1    1    0    0    1    0    1    0    1906-02-24
            1325*/0x0AB5, 1907, 2, 13,  /* 1    0    1    0    1    1    0    1    0    1    0    1    1907-02-13
            1326*/0x0DAA, 1908, 2, 3,   /* 0    1    0    1    0    1    0    1    1    0    1    1    1908-02-03
            1327*/0x0BA4, 1909, 1, 23,  /* 0    0    1    0    0    1    0    1    1    1    0    1    1909-01-23
            1328*/0x0B49, 1910, 1, 12,  /* 1    0    0    1    0    0    1    0    1    1    0    1    1910-01-12
            1329*/0x0A93, 1911, 1, 1,   /* 1    1    0    0    1    0    0    1    0    1    0    1    1911-01-01
            1330*/0x052B, 1911, 12, 21, /* 1    1    0    1    0    1    0    0    1    0    1    0    1911-12-21
            1331*/0x0A57, 1912, 12, 9,  /* 1    1    1    0    1    0    1    0    0    1    0    1    1912-12-09
            1332*/0x04B6, 1913, 11, 29, /* 0    1    1    0    1    1    0    1    0    0    1    0    1913-11-29
            1333*/0x0AB5, 1914, 11, 18, /* 1    0    1    0    1    1    0    1    0    1    0    1    1914-11-18
            1334*/0x05AA, 1915, 11, 8,  /* 0    1    0    1    0    1    0    1    1    0    1    0    1915-11-08
            1335*/0x0D55, 1916, 10, 27, /* 1    0    1    0    1    0    1    0    1    0    1    1    1916-10-27
            1336*/0x0D2A, 1917, 10, 17, /* 0    1    0    1    0    1    0    0    1    0    1    1    1917-10-17
            1337*/0x0A56, 1918, 10, 6,  /* 0    1    1    0    1    0    1    0    0    1    0    1    1918-10-06
            1338*/0x04AE, 1919, 9, 25,  /* 0    1    1    1    0    1    0    1    0    0    1    0    1919-09-25
            1339*/0x095D, 1920, 9, 13,  /* 1    0    1    1    1    0    1    0    1    0    0    1    1920-09-13
            1340*/0x02EC, 1921, 9, 3,   /* 0    0    1    1    0    1    1    1    0    1    0    0    1921-09-03
            1341*/0x06D5, 1922, 8, 23,  /* 1    0    1    0    1    0    1    1    0    1    1    0    1922-08-23
            1342*/0x06AA, 1923, 8, 13,  /* 0    1    0    1    0    1    0    1    0    1    1    0    1923-08-13
            1343*/0x0555, 1924, 8, 1,   /* 1    0    1    0    1    0    1    0    1    0    1    0    1924-08-01
            1344*/0x04AB, 1925, 7, 21,  /* 1    1    0    1    0    1    0    1    0    0    1    0    1925-07-21
            1345*/0x095B, 1926, 7, 10,  /* 1    1    0    1    1    0    1    0    1    0    0    1    1926-07-10
            1346*/0x02BA, 1927, 6, 30,  /* 0    1    0    1    1    1    0    1    0    1    0    0    1927-06-30
            1347*/0x0575, 1928, 6, 18,  /* 1    0    1    0    1    1    1    0    1    0    1    0    1928-06-18
            1348*/0x0BB2, 1929, 6, 8,   /* 0    1    0    0    1    1    0    1    1    1    0    1    1929-06-08
            1349*/0x0764, 1930, 5, 29,  /* 0    0    1    0    0    1    1    0    1    1    1    0    1930-05-29
            1350*/0x0749, 1931, 5, 18,  /* 1    0    0    1    0    0    1    0    1    1    1    0    1931-05-18
            1351*/0x0655, 1932, 5, 6,   /* 1    0    1    0    1    0    1    0    0    1    1    0    1932-05-06
            1352*/0x02AB, 1933, 4, 25,  /* 1    1    0    1    0    1    0    1    0    1    0    0    1933-04-25
            1353*/0x055B, 1934, 4, 14,  /* 1    1    0    1    1    0    1    0    1    0    1    0    1934-04-14
            1354*/0x0ADA, 1935, 4, 4,   /* 0    1    0    1    1    0    1    1    0    1    0    1    1935-04-04
            1355*/0x06D4, 1936, 3, 24,  /* 0    0    1    0    1    0    1    1    0    1    1    0    1936-03-24
            1356*/0x0EC9, 1937, 3, 13,  /* 1    0    0    1    0    0    1    1    0    1    1    1    1937-03-13
            1357*/0x0D92, 1938, 3, 3,   /* 0    1    0    0    1    0    0    1    1    0    1    1    1938-03-03
            1358*/0x0D25, 1939, 2, 20,  /* 1    0    1    0    0    1    0    0    1    0    1    1    1939-02-20
            1359*/0x0A4D, 1940, 2, 9,   /* 1    0    1    1    0    0    1    0    0    1    0    1    1940-02-09
            1360*/0x02AD, 1941, 1, 28,  /* 1    0    1    1    0    1    0    1    0    1    0    0    1941-01-28
            1361*/0x056D, 1942, 1, 17,  /* 1    0    1    1    0    1    1    0    1    0    1    0    1942-01-17
            1362*/0x0B6A, 1943, 1, 7,   /* 0    1    0    1    0    1    1    0    1    1    0    1    1943-01-07
            1363*/0x0B52, 1943, 12, 28, /* 0    1    0    0    1    0    1    0    1    1    0    1    1943-12-28
            1364*/0x0AA5, 1944, 12, 16, /* 1    0    1    0    0    1    0    1    0    1    0    1    1944-12-16
            1365*/0x0A4B, 1945, 12, 5,  /* 1    1    0    1    0    0    1    0    0    1    0    1    1945-12-05
            1366*/0x0497, 1946, 11, 24, /* 1    1    1    0    1    0    0    1    0    0    1    0    1946-11-24
            1367*/0x0937, 1947, 11, 13, /* 1    1    1    0    1    1    0    0    1    0    0    1    1947-11-13
            1368*/0x02B6, 1948, 11, 2,  /* 0    1    1    0    1    1    0    1    0    1    0    0    1948-11-02
            1369*/0x0575, 1949, 10, 22, /* 1    0    1    0    1    1    1    0    1    0    1    0    1949-10-22
            1370*/0x0D6A, 1950, 10, 12, /* 0    1    0    1    0    1    1    0    1    0    1    1    1950-10-12
            1371*/0x0D52, 1951, 10, 2,  /* 0    1    0    0    1    0    1    0    1    0    1    1    1951-10-02
            1372*/0x0A96, 1952, 9, 20,  /* 0    1    1    0    1    0    0    1    0    1    0    1    1952-09-20
            1373*/0x092D, 1953, 9, 9,   /* 1    0    1    1    0    1    0    0    1    0    0    1    1953-09-09
            1374*/0x025D, 1954, 8, 29,  /* 1    0    1    1    1    0    1    0    0    1    0    0    1954-08-29
            1375*/0x04DD, 1955, 8, 18,  /* 1    0    1    1    1    0    1    1    0    0    1    0    1955-08-18
            1376*/0x0ADA, 1956, 8, 7,   /* 0    1    0    1    1    0    1    1    0    1    0    1    1956-08-07
            1377*/0x05D4, 1957, 7, 28,  /* 0    0    1    0    1    0    1    1    1    0    1    0    1957-07-28
            1378*/0x0DA9, 1958, 7, 17,  /* 1    0    0    1    0    1    0    1    1    0    1    1    1958-07-17
            1379*/0x0D52, 1959, 7, 7,   /* 0    1    0    0    1    0    1    0    1    0    1    1    1959-07-07
            1380*/0x0AAA, 1960, 6, 25,  /* 0    1    0    1    0    1    0    1    0    1    0    1    1960-06-25
            1381*/0x04D6, 1961, 6, 14,  /* 0    1    1    0    1    0    1    1    0    0    1    0    1961-06-14
            1382*/0x09B6, 1962, 6, 3,   /* 0    1    1    0    1    1    0    1    1    0    0    1    1962-06-03
            1383*/0x0374, 1963, 5, 24,  /* 0    0    1    0    1    1    1    0    1    1    0    0    1963-05-24
            1384*/0x0769, 1964, 5, 12,  /* 1    0    0    1    0    1    1    0    1    1    1    0    1964-05-12
            1385*/0x0752, 1965, 5, 2,   /* 0    1    0    0    1    0    1    0    1    1    1    0    1965-05-02
            1386*/0x06A5, 1966, 4, 21,  /* 1    0    1    0    0    1    0    1    0    1    1    0    1966-04-21
            1387*/0x054B, 1967, 4, 10,  /* 1    1    0    1    0    0    1    0    1    0    1    0    1967-04-10
            1388*/0x0AAB, 1968, 3, 29,  /* 1    1    0    1    0    1    0    1    0    1    0    1    1968-03-29
            1389*/0x055A, 1969, 3, 19,  /* 0    1    0    1    1    0    1    0    1    0    1    0    1969-03-19
            1390*/0x0AD5, 1970, 3, 8,   /* 1    0    1    0    1    0    1    1    0    1    0    1    1970-03-08
            1391*/0x0DD2, 1971, 2, 26,  /* 0    1    0    0    1    0    1    1    1    0    1    1    1971-02-26
            1392*/0x0DA4, 1972, 2, 16,  /* 0    0    1    0    0    1    0    1    1    0    1    1    1972-02-16
            1393*/0x0D49, 1973, 2, 4,   /* 1    0    0    1    0    0    1    0    1    0    1    1    1973-02-04
            1394*/0x0A95, 1974, 1, 24,  /* 1    0    1    0    1    0    0    1    0    1    0    1    1974-01-24
            1395*/0x052D, 1975, 1, 13,  /* 1    0    1    1    0    1    0    0    1    0    1    0    1975-01-13
            1396*/0x0A5D, 1976, 1, 2,   /* 1    0    1    1    1    0    1    0    0    1    0    1    1976-01-02
            1397*/0x055A, 1976, 12, 22, /* 0    1    0    1    1    0    1    0    1    0    1    0    1976-12-22
            1398*/0x0AD5, 1977, 12, 11, /* 1    0    1    0    1    0    1    1    0    1    0    1    1977-12-11
            1399*/0x06AA, 1978, 12, 1,  /* 0    1    0    1    0    1    0    1    0    1    1    0    1978-12-01
            1400*/0x0695, 1979, 11, 20, /* 1    0    1    0    1    0    0    1    0    1    1    0    1979-11-20
            1401*/0x052B, 1980, 11, 8,  /* 1    1    0    1    0    1    0    0    1    0    1    0    1980-11-08
            1402*/0x0A57, 1981, 10, 28, /* 1    1    1    0    1    0    1    0    0    1    0    1    1981-10-28
            1403*/0x04AE, 1982, 10, 18, /* 0    1    1    1    0    1    0    1    0    0    1    0    1982-10-18
            1404*/0x0976, 1983, 10, 7,  /* 0    1    1    0    1    1    1    0    1    0    0    1    1983-10-07
            1405*/0x056C, 1984, 9, 26,  /* 0    0    1    1    0    1    1    0    1    0    1    0    1984-09-26
            1406*/0x0B55, 1985, 9, 15,  /* 1    0    1    0    1    0    1    0    1    1    0    1    1985-09-15
            1407*/0x0AAA, 1986, 9, 5,   /* 0    1    0    1    0    1    0    1    0    1    0    1    1986-09-05
            1408*/0x0A55, 1987, 8, 25,  /* 1    0    1    0    1    0    1    0    0    1    0    1    1987-08-25
            1409*/0x04AD, 1988, 8, 13,  /* 1    0    1    1    0    1    0    1    0    0    1    0    1988-08-13
            1410*/0x095D, 1989, 8, 2,   /* 1    0    1    1    1    0    1    0    1    0    0    1    1989-08-02
            1411*/0x02DA, 1990, 7, 23,  /* 0    1    0    1    1    0    1    1    0    1    0    0    1990-07-23
            1412*/0x05D9, 1991, 7, 12,  /* 1    0    0    1    1    0    1    1    1    0    1    0    1991-07-12
            1413*/0x0DB2, 1992, 7, 1,   /* 0    1    0    0    1    1    0    1    1    0    1    1    1992-07-01
            1414*/0x0BA4, 1993, 6, 21,  /* 0    0    1    0    0    1    0    1    1    1    0    1    1993-06-21
            1415*/0x0B4A, 1994, 6, 10,  /* 0    1    0    1    0    0    1    0    1    1    0    1    1994-06-10
            1416*/0x0A55, 1995, 5, 30,  /* 1    0    1    0    1    0    1    0    0    1    0    1    1995-05-30
            1417*/0x02B5, 1996, 5, 18,  /* 1    0    1    0    1    1    0    1    0    1    0    0    1996-05-18
            1418*/0x0575, 1997, 5, 7,   /* 1    0    1    0    1    1    1    0    1    0    1    0    1997-05-07
            1419*/0x0B6A, 1998, 4, 27,  /* 0    1    0    1    0    1    1    0    1    1    0    1    1998-04-27
            1420*/0x0BD2, 1999, 4, 17,  /* 0    1    0    0    1    0    1    1    1    1    0    1    1999-04-17
            1421*/0x0BC4, 2000, 4, 6,   /* 0    0    1    0    0    0    1    1    1    1    0    1    2000-04-06
            1422*/0x0B89, 2001, 3, 26,  /* 1    0    0    1    0    0    0    1    1    1    0    1    2001-03-26
            1423*/0x0A95, 2002, 3, 15,  /* 1    0    1    0    1    0    0    1    0    1    0    1    2002-03-15
            1424*/0x052D, 2003, 3, 4,   /* 1    0    1    1    0    1    0    0    1    0    1    0    2003-03-04
            1425*/0x05AD, 2004, 2, 21,  /* 1    0    1    1    0    1    0    1    1    0    1    0    2004-02-21
            1426*/0x0B6A, 2005, 2, 10,  /* 0    1    0    1    0    1    1    0    1    1    0    1    2005-02-10
            1427*/0x06D4, 2006, 1, 31,  /* 0    0    1    0    1    0    1    1    0    1    1    0    2006-01-31
            1428*/0x0DC9, 2007, 1, 20,  /* 1    0    0    1    0    0    1    1    1    0    1    1    2007-01-20
            1429*/0x0D92, 2008, 1, 10,  /* 0    1    0    0    1    0    0    1    1    0    1    1    2008-01-10
            1430*/0x0AA6, 2008, 12, 29, /* 0    1    1    0    0    1    0    1    0    1    0    1    2008-12-29
            1431*/0x0956, 2009, 12, 18, /* 0    1    1    0    1    0    1    0    1    0    0    1    2009-12-18
            1432*/0x02AE, 2010, 12, 7,  /* 0    1    1    1    0    1    0    1    0    1    0    0    2010-12-07
            1433*/0x056D, 2011, 11, 26, /* 1    0    1    1    0    1    1    0    1    0    1    0    2011-11-26
            1434*/0x036A, 2012, 11, 15, /* 0    1    0    1    0    1    1    0    1    1    0    0    2012-11-15
            1435*/0x0B55, 2013, 11, 4,  /* 1    0    1    0    1    0    1    0    1    1    0    1    2013-11-04
            1436*/0x0AAA, 2014, 10, 25, /* 0    1    0    1    0    1    0    1    0    1    0    1    2014-10-25
            1437*/0x094D, 2015, 10, 14, /* 1    0    1    1    0    0    1    0    1    0    0    1    2015-10-14
            1438*/0x049D, 2016, 10, 2,  /* 1    0    1    1    1    0    0    1    0    0    1    0    2016-10-02
            1439*/0x095D, 2017, 9, 21,  /* 1    0    1    1    1    0    1    0    1    0    0    1    2017-09-21
            1440*/0x02BA, 2018, 9, 11,  /* 0    1    0    1    1    1    0    1    0    1    0    0    2018-09-11
            1441*/0x05B5, 2019, 8, 31,  /* 1    0    1    0    1    1    0    1    1    0    1    0    2019-08-31
            1442*/0x05AA, 2020, 8, 20,  /* 0    1    0    1    0    1    0    1    1    0    1    0    2020-08-20
            1443*/0x0D55, 2021, 8, 9,   /* 1    0    1    0    1    0    1    0    1    0    1    1    2021-08-09
            1444*/0x0A9A, 2022, 7, 30,  /* 0    1    0    1    1    0    0    1    0    1    0    1    2022-07-30
            1445*/0x092E, 2023, 7, 19,  /* 0    1    1    1    0    1    0    0    1    0    0    1    2023-07-19
            1446*/0x026E, 2024, 7, 7,   /* 0    1    1    1    0    1    1    0    0    1    0    0    2024-07-07
            1447*/0x055D, 2025, 6, 26,  /* 1    0    1    1    1    0    1    0    1    0    1    0    2025-06-26
            1448*/0x0ADA, 2026, 6, 16,  /* 0    1    0    1    1    0    1    1    0    1    0    1    2026-06-16
            1449*/0x06D4, 2027, 6, 6,   /* 0    0    1    0    1    0    1    1    0    1    1    0    2027-06-06
            1450*/0x06A5, 2028, 5, 25,  /* 1    0    1    0    0    1    0    1    0    1    1    0    2028-05-25
            1451*/0x054B, 2029, 5, 14,  /* 1    1    0    1    0    0    1    0    1    0    1    0    2029-05-14
            1452*/0x0A97, 2030, 5, 3,   /* 1    1    1    0    1    0    0    1    0    1    0    1    2030-05-03
            1453*/0x054E, 2031, 4, 23,  /* 0    1    1    1    0    0    1    0    1    0    1    0    2031-04-23
            1454*/0x0AAE, 2032, 4, 11,  /* 0    1    1    1    0    1    0    1    0    1    0    1    2032-04-11
            1455*/0x05AC, 2033, 4, 1,   /* 0    0    1    1    0    1    0    1    1    0    1    0    2033-04-01
            1456*/0x0BA9, 2034, 3, 21,  /* 1    0    0    1    0    1    0    1    1    1    0    1    2034-03-21
            1457*/0x0D92, 2035, 3, 11,  /* 0    1    0    0    1    0    0    1    1    0    1    1    2035-03-11
            1458*/0x0B25, 2036, 2, 28,  /* 1    0    1    0    0    1    0    0    1    1    0    1    2036-02-28
            1459*/0x064B, 2037, 2, 16,  /* 1    1    0    1    0    0    1    0    0    1    1    0    2037-02-16
            1460*/0x0CAB, 2038, 2, 5,   /* 1    1    0    1    0    1    0    1    0    0    1    1    2038-02-05
            1461*/0x055A, 2039, 1, 26,  /* 0    1    0    1    1    0    1    0    1    0    1    0    2039-01-26
            1462*/0x0B55, 2040, 1, 15,  /* 1    0    1    0    1    0    1    0    1    1    0    1    2040-01-15
            1463*/0x06D2, 2041, 1, 4,   /* 0    1    0    0    1    0    1    1    0    1    1    0    2041-01-04
            1464*/0x0EA5, 2041, 12, 24, /* 1    0    1    0    0    1    0    1    0    1    1    1    2041-12-24
            1465*/0x0E4A, 2042, 12, 14, /* 0    1    0    1    0    0    1    0    0    1    1    1    2042-12-14
            1466*/0x0A95, 2043, 12, 3,  /* 1    0    1    0    1    0    0    1    0    1    0    1    2043-12-03
            1467*/0x052D, 2044, 11, 21, /* 1    0    1    1    0    1    0    0    1    0    1    0    2044-11-21
            1468*/0x0AAD, 2045, 11, 10, /* 1    0    1    1    0    1    0    1    0    1    0    1    2045-11-10
            1469*/0x036C, 2046, 10, 31, /* 0    0    1    1    0    1    1    0    1    1    0    0    2046-10-31
            1470*/0x0759, 2047, 10, 20, /* 1    0    0    1    1    0    1    0    1    1    1    0    2047-10-20
            1471*/0x06D2, 2048, 10, 9,  /* 0    1    0    0    1    0    1    1    0    1    1    0    2048-10-09
            1472*/0x0695, 2049, 9, 28,  /* 1    0    1    0    1    0    0    1    0    1    1    0    2049-09-28
            1473*/0x052D, 2050, 9, 17,  /* 1    0    1    1    0    1    0    0    1    0    1    0    2050-09-17
            1474*/0x0A5B, 2051, 9, 6,   /* 1    1    0    1    1    0    1    0    0    1    0    1    2051-09-06
            1475*/0x04BA, 2052, 8, 26,  /* 0    1    0    1    1    1    0    1    0    0    1    0    2052-08-26
            1476*/0x09BA, 2053, 8, 15,  /* 0    1    0    1    1    1    0    1    1    0    0    1    2053-08-15
            1477*/0x03B4, 2054, 8, 5,   /* 0    0    1    0    1    1    0    1    1    1    0    0    2054-08-05
            1478*/0x0B69, 2055, 7, 25,  /* 1    0    0    1    0    1    1    0    1    1    0    1    2055-07-25
            1479*/0x0B52, 2056, 7, 14,  /* 0    1    0    0    1    0    1    0    1    1    0    1    2056-07-14
            1480*/0x0AA6, 2057, 7, 3,   /* 0    1    1    0    0    1    0    1    0    1    0    1    2057-07-03
            1481*/0x04B6, 2058, 6, 22,  /* 0    1    1    0    1    1    0    1    0    0    1    0    2058-06-22
            1482*/0x096D, 2059, 6, 11,  /* 1    0    1    1    0    1    1    0    1    0    0    1    2059-06-11
            1483*/0x02EC, 2060, 5, 31,  /* 0    0    1    1    0    1    1    1    0    1    0    0    2060-05-31
            1484*/0x06D9, 2061, 5, 20,  /* 1    0    0    1    1    0    1    1    0    1    1    0    2061-05-20
            1485*/0x0EB2, 2062, 5, 10,  /* 0    1    0    0    1    1    0    1    0    1    1    1    2062-05-10
            1486*/0x0D54, 2063, 4, 30,  /* 0    0    1    0    1    0    1    0    1    0    1    1    2063-04-30
            1487*/0x0D2A, 2064, 4, 18,  /* 0    1    0    1    0    1    0    0    1    0    1    1    2064-04-18
            1488*/0x0A56, 2065, 4, 7,   /* 0    1    1    0    1    0    1    0    0    1    0    1    2065-04-07
            1489*/0x04AE, 2066, 3, 27,  /* 0    1    1    1    0    1    0    1    0    0    1    0    2066-03-27
            1490*/0x096D, 2067, 3, 16,  /* 1    0    1    1    0    1    1    0    1    0    0    1    2067-03-16
            1491*/0x0D6A, 2068, 3, 5,   /* 0    1    0    1    0    1    1    0    1    0    1    1    2068-03-05
            1492*/0x0B54, 2069, 2, 23,  /* 0    0    1    0    1    0    1    0    1    1    0    1    2069-02-23
            1493*/0x0B29, 2070, 2, 12,  /* 1    0    0    1    0    1    0    0    1    1    0    1    2070-02-12
            1494*/0x0A93, 2071, 2, 1,   /* 1    1    0    0    1    0    0    1    0    1    0    1    2071-02-01
            1495*/0x052B, 2072, 1, 21,  /* 1    1    0    1    0    1    0    0    1    0    1    0    2072-01-21
            1496*/0x0A57, 2073, 1, 9,   /* 1    1    1    0    1    0    1    0    0    1    0    1    2073-01-09
            1497*/0x0536, 2073, 12, 30, /* 0    1    1    0    1    1    0    0    1    0    1    0    2073-12-30
            1498*/0x0AB5, 2074, 12, 19, /* 1    0    1    0    1    1    0    1    0    1    0    1    2074-12-19
            1499*/0x06AA, 2075, 12, 9,  /* 0    1    0    1    0    1    0    1    0    1    1    0    2075-12-09
            1500*/0x0E93, 2076, 11, 27, /* 1    1    0    0    1    0    0    1    0    1    1    1    2076-11-27
            1501*/     0, 2077, 11, 17  /* 0    0    0    0    0    0    0    0    0    0    0    0    2077-11-17*/];

        const mapping: DateMapping[] = [];
        for (let i = 0; i < rawData.length / 4; i++) {
            mapping.push(new DateMapping(rawData[i * 4], rawData[i * 4 + 1], rawData[i * 4 + 2] - 1, rawData[i * 4 + 3]));
        }

        return mapping;
    }
}

// Register both locales so they'll be bundled in the package.
// This is fine since for this library, there will probably be
// only be these two locales.
UmAlQuraStatic.registerLocale(ar);
UmAlQuraStatic.registerLocale(en);

export default UmAlQuraStatic;
