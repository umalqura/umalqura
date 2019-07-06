import DateMapping from './DateMapping';
import DatePart from './DatePart';
import { format } from './format';
import { en, Locale } from './locale';

/// Calendar support range:
///     Calendar    Minimum     Maximum
///     ==========  ==========  ==========
///     Gregorian   1900/04/30  2077/11/16
///     UmAlQura    1318/01/01  1500/12/30
class UmAlQuraCalendar {
    private static readonly maxSeconds = 9223372036854775807 / 10000000;
    private static readonly minSeconds = -9223372036854775807 / 10000000;

    private static readonly millisPerSecond = 1000;
    private static readonly millisPerMinute = UmAlQuraCalendar.millisPerSecond * 60;
    private static readonly millisPerHour = UmAlQuraCalendar.millisPerMinute * 60;
    private static readonly millisPerDay = UmAlQuraCalendar.millisPerHour * 24;

    private static readonly minCalendarYear = 1318;
    private static readonly maxCalendarYear = 1500;

    private static readonly minDate = new Date(1900, 3, 30);
    private static readonly maxDate = new Date(2077, 10, 16, 23, 59, 59, 999);

    private static readonly hijriYearData = UmAlQuraCalendar._initDateMapping();

    private static locale = en;

    /**
      * Sets the global locale to be used
      * @param locale The locale
      */
    public static setLocale(locale: Locale) {
        UmAlQuraCalendar.locale = locale;
    }

    /**
      * Coverts the given Hijri date to Gregorian.
      * @param hy The Hijri year
      * @param hm The Hijri month
      * @param hd The Hijri day
      */
    public static hijriToGregorian(hy: number, hm: number, hd: number) {
        UmAlQuraCalendar._checkYearRange(hy);
        UmAlQuraCalendar._checkMonthRange(hm);
        UmAlQuraCalendar._checkDayRange(hd);

        let nDays = hd - 1;

        const index = hy - UmAlQuraCalendar.minCalendarYear;
        let dt = UmAlQuraCalendar.hijriYearData[index].gregorianDate;
        let b = UmAlQuraCalendar.hijriYearData[index].hijriMonthsLengthFlags;

        for (let m = 1; m < hm; m++) {
            nDays = nDays + 29 + (b & 1);
            b >>= 1;
        }

        dt = UmAlQuraCalendar._addDays(dt, nDays);

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
        UmAlQuraCalendar._checkMillsRange(date.getTime());

        // Find the index where we should start our search by quessing the Hijri year that we will be in HijriYearInfo.
        // A Hijri year is 354 or 355 days.  Use 355 days so that we will search from a lower index.

        let index = Math.trunc((date.getTime() - UmAlQuraCalendar.minDate.getTime()) / UmAlQuraCalendar.millisPerDay / 355);

        do {
        } while (date.getTime() > UmAlQuraCalendar.hijriYearData[++index].gregorianDate.getTime());

        if (date.getTime() !== UmAlQuraCalendar.hijriYearData[index].gregorianDate.getTime()) {
            index--;
        }

        let nDays = UmAlQuraCalendar._dayDiff(date, UmAlQuraCalendar.hijriYearData[index].gregorianDate);
        const yh1 = index + UmAlQuraCalendar.minCalendarYear;
        let mh1 = 1;
        let dh1 = 1;
        let b = UmAlQuraCalendar.hijriYearData[index].hijriMonthsLengthFlags;
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
        return UmAlQuraCalendar.addMonths(date, hys * 12);
    }

    /**
      * Adds the specified amount of Hijri months to the given Gregorian date.
      * @param date The date
      * @param hms The Hijri months to be added
      */
    public static addMonths(date: Date, hms: number) {
        // Get the date in UmAlQura calendar.
        let y = UmAlQuraCalendar._getDatePart(date, DatePart.Year);
        let m = UmAlQuraCalendar._getDatePart(date, DatePart.Month);
        let d = UmAlQuraCalendar._getDatePart(date, DatePart.Day);
        const i = m - 1 + hms;

        if (i >= 0) {
            m = i % 12 + 1;
            y += Math.trunc(i / 12);
        } else {
            m = 12 + (i + 1) % 12;
            y += Math.trunc((i - 11) / 12);
        }

        if (d > 29) {
            const days = UmAlQuraCalendar.getDaysInMonth(y, m);
            if (d > days) {
                d = days;
            }
        }

        return new Date(UmAlQuraCalendar._getAbsoluteDateUmAlQura(y, m, d) * UmAlQuraCalendar.millisPerDay + date.getTime() % UmAlQuraCalendar.millisPerDay);
    }

    /**
      * Returns the Hijri year for the specified Gregorian date.
      * @param date The date
      */
    public static getDayOfYear(date: Date) {
        return UmAlQuraCalendar._getDatePart(date, DatePart.DayOfYear);
    }

    /**
      * Returns the Hijri day of month for the specified Gregorian date.
      * @param date The date
      */
    public static getDayOfMonth(date: Date) {
        return UmAlQuraCalendar._getDatePart(date, DatePart.Day);
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
        const { hy } = UmAlQuraCalendar.gregorianToHijri(date);
        const { gy, gm, gd } = UmAlQuraCalendar.hijriToGregorian(hy, 1, 1);

        const firstDayOfWeekOfYear = new Date(gy, gm, gd).getDay();
        const daysToDayOfWeek = firstDayOfWeekOfYear - date.getDay();

        const d = UmAlQuraCalendar._addDays(date, daysToDayOfWeek);
        return Math.ceil(UmAlQuraCalendar.getDayOfYear(d) / 7);
    }

    /**
      * Returns the number of days in the specified Hijri year.
      * @param hy The Hijri year
      */
    public static getDaysInYear(hy: number) {
        UmAlQuraCalendar._checkYearRange(hy);

        let days = 0;
        let b = UmAlQuraCalendar.hijriYearData[hy - UmAlQuraCalendar.minCalendarYear].hijriMonthsLengthFlags;

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
        UmAlQuraCalendar._checkYearRange(hy);
        UmAlQuraCalendar._checkMonthRange(hm);

        if ((UmAlQuraCalendar.hijriYearData[hy - UmAlQuraCalendar.minCalendarYear].hijriMonthsLengthFlags & (1 << hm - 1)) === 0) {
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
        return UmAlQuraCalendar._getDatePart(date, DatePart.Year);
    }

    /**
      * Returns the Hijri month corresponding to the given Gregorian date.
      * @param date The date
      */
    public static getMonth(date: Date) {
        return UmAlQuraCalendar._getDatePart(date, DatePart.Month);
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date starting at the specified unit of time.
     * @param date: The date
     * @param unit: The unit of time
     */
    public static startOf(date: Date, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        const d = new Date(date);
        const { hy, hm } = UmAlQuraCalendar.gregorianToHijri(d);

        switch (unit) {
            case 'year':
                return UmAlQuraCalendar.toDate(hy, 1, 1, 0, 0, 0, 0);
            case 'month':
                return UmAlQuraCalendar.toDate(hy, hm, 1, 0, 0, 0, 0);
            case 'week':
                const dow = UmAlQuraCalendar.getDayOfWeek(d);
                const sow = UmAlQuraCalendar._addDays(d, -dow);
                sow.setHours(0);
                sow.setMinutes(0);
                sow.setSeconds(0);
                sow.setMilliseconds(0);
                return sow;
            case 'day':
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0);
                return d;
            case 'hour':
                d.setMinutes(0);
                d.setSeconds(0);
                d.setMilliseconds(0);
                return d;
            case 'minute':
                d.setSeconds(0);
                d.setMilliseconds(0);
                return d;
            case 'second':
                d.setMilliseconds(0);
                return d;
        }
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date ending at the specified unit of time.
     * @param date: The date
     * @param unit: The unit of time
     */
    public static endOf(date: Date, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        const d = new Date(date);
        const { hy, hm } = UmAlQuraCalendar.gregorianToHijri(d);
        let daysInMonth;

        switch (unit) {
            case 'year':
                daysInMonth = UmAlQuraCalendar.getDaysInMonth(hy, 12);
                return UmAlQuraCalendar.toDate(hy, 12, daysInMonth, 23, 59, 59, 999);
            case 'month':
                daysInMonth = UmAlQuraCalendar.getDaysInMonth(hy, hm);
                return UmAlQuraCalendar.toDate(hy, hm, daysInMonth, 23, 59, 59, 999);
            case 'week':
                const dow = UmAlQuraCalendar.getDayOfWeek(d);
                const sow = UmAlQuraCalendar._addDays(d, 6 - dow);
                sow.setHours(23);
                sow.setMinutes(59);
                sow.setSeconds(59);
                sow.setMilliseconds(999);
                return sow;
            case 'day':
                d.setHours(23);
                d.setMinutes(59);
                d.setSeconds(59);
                d.setMilliseconds(999);
                return d;
            case 'hour':
                d.setMinutes(59);
                d.setSeconds(59);
                d.setMilliseconds(999);
                return d;
            case 'minute':
                d.setSeconds(59);
                d.setMilliseconds(999);
                return d;
            case 'second':
                d.setMilliseconds(999);
                return d;
        }
    }

    /**
      * Returns whether or not the given Hijri year is a leap year.
      * A Hijri leap year is where the number of days in that year is 355.
      * @param hy The Hijri year
      */
    public static isLeapYear(hy: number) {
        return UmAlQuraCalendar.getDaysInYear(hy) === 355;
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
        const daysInMonth = UmAlQuraCalendar.getDaysInMonth(hy, hm);

        if (hd < 1 || hd > daysInMonth) {
            throw new Error(`Invalid value for day for the given year/month. Day must be between 1 and ${daysInMonth}.`);
        }

        const lDate = UmAlQuraCalendar._getAbsoluteDateUmAlQura(hy, hm, hd);
        if (lDate < 0) {
            throw new Error('Error converting date. This is possibly a bug.');
        }

        return new Date(lDate * UmAlQuraCalendar.millisPerDay + UmAlQuraCalendar._timeToMillis(hour, minute, second, millisecond));
    }

    /**
      * Formats the specified Gregorian Date instance in Hijri date.
      * @param date The date
      * @param mask The format mask
      */
    public static format(date: Date, mask: string) {
        const { hy, hm, hd } = UmAlQuraCalendar.gregorianToHijri(date);
        return format(date, mask, UmAlQuraCalendar.locale, hy, hm, hd,
            UmAlQuraCalendar.getWeekOfYear(date),
            UmAlQuraCalendar.getDayOfWeek(date));
    }

    private static _getDatePart(date: Date, part: DatePart) {
        const { hy, hm, hd } = UmAlQuraCalendar.gregorianToHijri(date);

        switch (part) {
            case DatePart.Year:
                return hy;
            case DatePart.Month:
                return hm;
            case DatePart.Day:
                return hd;
            case DatePart.DayOfYear:
                return Math.trunc(UmAlQuraCalendar._getAbsoluteDateUmAlQura(hy, hm, hd) - UmAlQuraCalendar._getAbsoluteDateUmAlQura(hy, 1, 1) + 1);
        }
    }

    private static _getAbsoluteDateUmAlQura(hy: number, hm: number, hd: number) {
        const { gy, gm, gd } = UmAlQuraCalendar.hijriToGregorian(hy, hm, hd);
        return new Date(gy, gm, gd).getTime() / UmAlQuraCalendar.millisPerDay;
    }

    private static _timeToMillis(hour: number, minute: number, second: number, millisecond: number) {
        if (hour < 0 || hour >= 24 || minute < 0 || minute >= 60 || second < 0 || second >= 60 || millisecond < 0 || millisecond >= UmAlQuraCalendar.millisPerSecond) {
            throw new Error('Invalid value for hour, minute, second or millisecond.');
        }

        const totalSeconds = hour * 3600 + minute * 60 + second;
        if (totalSeconds > UmAlQuraCalendar.maxSeconds || totalSeconds < UmAlQuraCalendar.minSeconds) {
            throw new Error('Time overflow error. This is possibly a bug.');
        }

        return (totalSeconds * UmAlQuraCalendar.millisPerSecond) + millisecond;
    }

    private static _checkYearRange(hy: number) {
        if (hy < UmAlQuraCalendar.minCalendarYear || hy > UmAlQuraCalendar.maxCalendarYear) {
            throw new Error(`Invalid value for year. Must be between ${UmAlQuraCalendar.minCalendarYear} and ${UmAlQuraCalendar.maxCalendarYear}.`);
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
        if (millis < UmAlQuraCalendar.minDate.getTime() || millis > UmAlQuraCalendar.maxDate.getTime()) {
            throw new Error(`Invalid value for epoch. Must be between ${UmAlQuraCalendar.minDate.getTime()} and ${UmAlQuraCalendar.maxDate.getTime()}.`);
        }
    }

    private static _addDays(date: Date, days: number) {
        const d = new Date(date.valueOf());
        d.setDate(d.getDate() + days);
        return d;
    }

    private static _dayDiff(date: Date, other: Date) {
        return (date.getTime() - other.getTime()) / (1000 * 60 * 60 * 24);
    }

    private static _initDateMapping() {
        const rawData = [
            // This data is auto generated from http://www.staff.science.uu.nl/~gent0113/islam/addfiles/islamcalendar_dat.js
            // Ref: ummalqura_dat array. Generated by /personal-proj/hijri-data-gen
            /*  DaysPerM  GY   GM  GD      D1   D2   D3   D4   D5   D6   D7   D8   D9   D10  D11  D12
            1318*/0x02EA, 1900, 4, 30,  /* 0    1    0    1    0    1    1    1    0    1    0    0    04/30/1900
            1319*/0x06E9, 1901, 4, 19,  /* 1    0    0    1    0    1    1    1    0    1    1    0    04/19/1901
            1320*/0x0ED2, 1902, 4, 9,   /* 0    1    0    0    1    0    1    1    0    1    1    1    04/09/1902
            1321*/0x0EA4, 1903, 3, 30,  /* 0    0    1    0    0    1    0    1    0    1    1    1    03/30/1903
            1322*/0x0D4A, 1904, 3, 18,  /* 0    1    0    1    0    0    1    0    1    0    1    1    03/18/1904
            1323*/0x0A96, 1905, 3, 7,   /* 0    1    1    0    1    0    0    1    0    1    0    1    03/07/1905
            1324*/0x0536, 1906, 2, 24,  /* 0    1    1    0    1    1    0    0    1    0    1    0    02/24/1906
            1325*/0x0AB5, 1907, 2, 13,  /* 1    0    1    0    1    1    0    1    0    1    0    1    02/13/1907
            1326*/0x0DAA, 1908, 2, 3,   /* 0    1    0    1    0    1    0    1    1    0    1    1    02/03/1908
            1327*/0x0BA4, 1909, 1, 23,  /* 0    0    1    0    0    1    0    1    1    1    0    1    01/23/1909
            1328*/0x0B49, 1910, 1, 12,  /* 1    0    0    1    0    0    1    0    1    1    0    1    01/12/1910
            1329*/0x0A93, 1911, 1, 1,   /* 1    1    0    0    1    0    0    1    0    1    0    1    01/01/1911
            1330*/0x052B, 1911, 12, 21, /* 1    1    0    1    0    1    0    0    1    0    1    0    12/21/1911
            1331*/0x0A57, 1912, 12, 9,  /* 1    1    1    0    1    0    1    0    0    1    0    1    12/09/1912
            1332*/0x04B6, 1913, 11, 29, /* 0    1    1    0    1    1    0    1    0    0    1    0    11/29/1913
            1333*/0x0AB5, 1914, 11, 18, /* 1    0    1    0    1    1    0    1    0    1    0    1    11/18/1914
            1334*/0x05AA, 1915, 11, 8,  /* 0    1    0    1    0    1    0    1    1    0    1    0    11/08/1915
            1335*/0x0D55, 1916, 10, 27, /* 1    0    1    0    1    0    1    0    1    0    1    1    10/27/1916
            1336*/0x0D2A, 1917, 10, 17, /* 0    1    0    1    0    1    0    0    1    0    1    1    10/17/1917
            1337*/0x0A56, 1918, 10, 6,  /* 0    1    1    0    1    0    1    0    0    1    0    1    10/06/1918
            1338*/0x04AE, 1919, 9, 25,  /* 0    1    1    1    0    1    0    1    0    0    1    0    09/25/1919
            1339*/0x095D, 1920, 9, 13,  /* 1    0    1    1    1    0    1    0    1    0    0    1    09/13/1920
            1340*/0x02EC, 1921, 9, 3,   /* 0    0    1    1    0    1    1    1    0    1    0    0    09/03/1921
            1341*/0x06D5, 1922, 8, 23,  /* 1    0    1    0    1    0    1    1    0    1    1    0    08/23/1922
            1342*/0x06AA, 1923, 8, 13,  /* 0    1    0    1    0    1    0    1    0    1    1    0    08/13/1923
            1343*/0x0555, 1924, 8, 1,   /* 1    0    1    0    1    0    1    0    1    0    1    0    08/01/1924
            1344*/0x04AB, 1925, 7, 21,  /* 1    1    0    1    0    1    0    1    0    0    1    0    07/21/1925
            1345*/0x095B, 1926, 7, 10,  /* 1    1    0    1    1    0    1    0    1    0    0    1    07/10/1926
            1346*/0x02BA, 1927, 6, 30,  /* 0    1    0    1    1    1    0    1    0    1    0    0    06/30/1927
            1347*/0x0575, 1928, 6, 18,  /* 1    0    1    0    1    1    1    0    1    0    1    0    06/18/1928
            1348*/0x0BB2, 1929, 6, 8,   /* 0    1    0    0    1    1    0    1    1    1    0    1    06/08/1929
            1349*/0x0764, 1930, 5, 29,  /* 0    0    1    0    0    1    1    0    1    1    1    0    05/29/1930
            1350*/0x0749, 1931, 5, 18,  /* 1    0    0    1    0    0    1    0    1    1    1    0    05/18/1931
            1351*/0x0655, 1932, 5, 6,   /* 1    0    1    0    1    0    1    0    0    1    1    0    05/06/1932
            1352*/0x02AB, 1933, 4, 25,  /* 1    1    0    1    0    1    0    1    0    1    0    0    04/25/1933
            1353*/0x055B, 1934, 4, 14,  /* 1    1    0    1    1    0    1    0    1    0    1    0    04/14/1934
            1354*/0x0ADA, 1935, 4, 4,   /* 0    1    0    1    1    0    1    1    0    1    0    1    04/04/1935
            1355*/0x06D4, 1936, 3, 24,  /* 0    0    1    0    1    0    1    1    0    1    1    0    03/24/1936
            1356*/0x0EC9, 1937, 3, 13,  /* 1    0    0    1    0    0    1    1    0    1    1    1    03/13/1937
            1357*/0x0D92, 1938, 3, 3,   /* 0    1    0    0    1    0    0    1    1    0    1    1    03/03/1938
            1358*/0x0D25, 1939, 2, 20,  /* 1    0    1    0    0    1    0    0    1    0    1    1    02/20/1939
            1359*/0x0A4D, 1940, 2, 9,   /* 1    0    1    1    0    0    1    0    0    1    0    1    02/09/1940
            1360*/0x02AD, 1941, 1, 28,  /* 1    0    1    1    0    1    0    1    0    1    0    0    01/28/1941
            1361*/0x056D, 1942, 1, 17,  /* 1    0    1    1    0    1    1    0    1    0    1    0    01/17/1942
            1362*/0x0B6A, 1943, 1, 7,   /* 0    1    0    1    0    1    1    0    1    1    0    1    01/07/1943
            1363*/0x0B52, 1943, 12, 28, /* 0    1    0    0    1    0    1    0    1    1    0    1    12/28/1943
            1364*/0x0AA5, 1944, 12, 16, /* 1    0    1    0    0    1    0    1    0    1    0    1    12/16/1944
            1365*/0x0A4B, 1945, 12, 5,  /* 1    1    0    1    0    0    1    0    0    1    0    1    12/05/1945
            1366*/0x0497, 1946, 11, 24, /* 1    1    1    0    1    0    0    1    0    0    1    0    11/24/1946
            1367*/0x0937, 1947, 11, 13, /* 1    1    1    0    1    1    0    0    1    0    0    1    11/13/1947
            1368*/0x02B6, 1948, 11, 2,  /* 0    1    1    0    1    1    0    1    0    1    0    0    11/02/1948
            1369*/0x0575, 1949, 10, 22, /* 1    0    1    0    1    1    1    0    1    0    1    0    10/22/1949
            1370*/0x0D6A, 1950, 10, 12, /* 0    1    0    1    0    1    1    0    1    0    1    1    10/12/1950
            1371*/0x0D52, 1951, 10, 2,  /* 0    1    0    0    1    0    1    0    1    0    1    1    10/02/1951
            1372*/0x0A96, 1952, 9, 20,  /* 0    1    1    0    1    0    0    1    0    1    0    1    09/20/1952
            1373*/0x092D, 1953, 9, 9,   /* 1    0    1    1    0    1    0    0    1    0    0    1    09/09/1953
            1374*/0x025D, 1954, 8, 29,  /* 1    0    1    1    1    0    1    0    0    1    0    0    08/29/1954
            1375*/0x04DD, 1955, 8, 18,  /* 1    0    1    1    1    0    1    1    0    0    1    0    08/18/1955
            1376*/0x0ADA, 1956, 8, 7,   /* 0    1    0    1    1    0    1    1    0    1    0    1    08/07/1956
            1377*/0x05D4, 1957, 7, 28,  /* 0    0    1    0    1    0    1    1    1    0    1    0    07/28/1957
            1378*/0x0DA9, 1958, 7, 17,  /* 1    0    0    1    0    1    0    1    1    0    1    1    07/17/1958
            1379*/0x0D52, 1959, 7, 7,   /* 0    1    0    0    1    0    1    0    1    0    1    1    07/07/1959
            1380*/0x0AAA, 1960, 6, 25,  /* 0    1    0    1    0    1    0    1    0    1    0    1    06/25/1960
            1381*/0x04D6, 1961, 6, 14,  /* 0    1    1    0    1    0    1    1    0    0    1    0    06/14/1961
            1382*/0x09B6, 1962, 6, 3,   /* 0    1    1    0    1    1    0    1    1    0    0    1    06/03/1962
            1383*/0x0374, 1963, 5, 24,  /* 0    0    1    0    1    1    1    0    1    1    0    0    05/24/1963
            1384*/0x0769, 1964, 5, 12,  /* 1    0    0    1    0    1    1    0    1    1    1    0    05/12/1964
            1385*/0x0752, 1965, 5, 2,   /* 0    1    0    0    1    0    1    0    1    1    1    0    05/02/1965
            1386*/0x06A5, 1966, 4, 21,  /* 1    0    1    0    0    1    0    1    0    1    1    0    04/21/1966
            1387*/0x054B, 1967, 4, 10,  /* 1    1    0    1    0    0    1    0    1    0    1    0    04/10/1967
            1388*/0x0AAB, 1968, 3, 29,  /* 1    1    0    1    0    1    0    1    0    1    0    1    03/29/1968
            1389*/0x055A, 1969, 3, 19,  /* 0    1    0    1    1    0    1    0    1    0    1    0    03/19/1969
            1390*/0x0AD5, 1970, 3, 8,   /* 1    0    1    0    1    0    1    1    0    1    0    1    03/08/1970
            1391*/0x0DD2, 1971, 2, 26,  /* 0    1    0    0    1    0    1    1    1    0    1    1    02/26/1971
            1392*/0x0DA4, 1972, 2, 16,  /* 0    0    1    0    0    1    0    1    1    0    1    1    02/16/1972
            1393*/0x0D49, 1973, 2, 4,   /* 1    0    0    1    0    0    1    0    1    0    1    1    02/04/1973
            1394*/0x0A95, 1974, 1, 24,  /* 1    0    1    0    1    0    0    1    0    1    0    1    01/24/1974
            1395*/0x052D, 1975, 1, 13,  /* 1    0    1    1    0    1    0    0    1    0    1    0    01/13/1975
            1396*/0x0A5D, 1976, 1, 2,   /* 1    0    1    1    1    0    1    0    0    1    0    1    01/02/1976
            1397*/0x055A, 1976, 12, 22, /* 0    1    0    1    1    0    1    0    1    0    1    0    12/22/1976
            1398*/0x0AD5, 1977, 12, 11, /* 1    0    1    0    1    0    1    1    0    1    0    1    12/11/1977
            1399*/0x06AA, 1978, 12, 1,  /* 0    1    0    1    0    1    0    1    0    1    1    0    12/01/1978
            1400*/0x0695, 1979, 11, 20, /* 1    0    1    0    1    0    0    1    0    1    1    0    11/20/1979
            1401*/0x052B, 1980, 11, 8,  /* 1    1    0    1    0    1    0    0    1    0    1    0    11/08/1980
            1402*/0x0A57, 1981, 10, 28, /* 1    1    1    0    1    0    1    0    0    1    0    1    10/28/1981
            1403*/0x04AE, 1982, 10, 18, /* 0    1    1    1    0    1    0    1    0    0    1    0    10/18/1982
            1404*/0x0976, 1983, 10, 7,  /* 0    1    1    0    1    1    1    0    1    0    0    1    10/07/1983
            1405*/0x056C, 1984, 9, 26,  /* 0    0    1    1    0    1    1    0    1    0    1    0    09/26/1984
            1406*/0x0B55, 1985, 9, 15,  /* 1    0    1    0    1    0    1    0    1    1    0    1    09/15/1985
            1407*/0x0AAA, 1986, 9, 5,   /* 0    1    0    1    0    1    0    1    0    1    0    1    09/05/1986
            1408*/0x0A55, 1987, 8, 25,  /* 1    0    1    0    1    0    1    0    0    1    0    1    08/25/1987
            1409*/0x04AD, 1988, 8, 13,  /* 1    0    1    1    0    1    0    1    0    0    1    0    08/13/1988
            1410*/0x095D, 1989, 8, 2,   /* 1    0    1    1    1    0    1    0    1    0    0    1    08/02/1989
            1411*/0x02DA, 1990, 7, 23,  /* 0    1    0    1    1    0    1    1    0    1    0    0    07/23/1990
            1412*/0x05D9, 1991, 7, 12,  /* 1    0    0    1    1    0    1    1    1    0    1    0    07/12/1991
            1413*/0x0DB2, 1992, 7, 1,   /* 0    1    0    0    1    1    0    1    1    0    1    1    07/01/1992
            1414*/0x0BA4, 1993, 6, 21,  /* 0    0    1    0    0    1    0    1    1    1    0    1    06/21/1993
            1415*/0x0B4A, 1994, 6, 10,  /* 0    1    0    1    0    0    1    0    1    1    0    1    06/10/1994
            1416*/0x0A55, 1995, 5, 30,  /* 1    0    1    0    1    0    1    0    0    1    0    1    05/30/1995
            1417*/0x02B5, 1996, 5, 18,  /* 1    0    1    0    1    1    0    1    0    1    0    0    05/18/1996
            1418*/0x0575, 1997, 5, 7,   /* 1    0    1    0    1    1    1    0    1    0    1    0    05/07/1997
            1419*/0x0B6A, 1998, 4, 27,  /* 0    1    0    1    0    1    1    0    1    1    0    1    04/27/1998
            1420*/0x0BD2, 1999, 4, 17,  /* 0    1    0    0    1    0    1    1    1    1    0    1    04/17/1999
            1421*/0x0BC4, 2000, 4, 6,   /* 0    0    1    0    0    0    1    1    1    1    0    1    04/06/2000
            1422*/0x0B89, 2001, 3, 26,  /* 1    0    0    1    0    0    0    1    1    1    0    1    03/26/2001
            1423*/0x0A95, 2002, 3, 15,  /* 1    0    1    0    1    0    0    1    0    1    0    1    03/15/2002
            1424*/0x052D, 2003, 3, 4,   /* 1    0    1    1    0    1    0    0    1    0    1    0    03/04/2003
            1425*/0x05AD, 2004, 2, 21,  /* 1    0    1    1    0    1    0    1    1    0    1    0    02/21/2004
            1426*/0x0B6A, 2005, 2, 10,  /* 0    1    0    1    0    1    1    0    1    1    0    1    02/10/2005
            1427*/0x06D4, 2006, 1, 31,  /* 0    0    1    0    1    0    1    1    0    1    1    0    01/31/2006
            1428*/0x0DC9, 2007, 1, 20,  /* 1    0    0    1    0    0    1    1    1    0    1    1    01/20/2007
            1429*/0x0D92, 2008, 1, 10,  /* 0    1    0    0    1    0    0    1    1    0    1    1    01/10/2008
            1430*/0x0AA6, 2008, 12, 29, /* 0    1    1    0    0    1    0    1    0    1    0    1    12/29/2008
            1431*/0x0956, 2009, 12, 18, /* 0    1    1    0    1    0    1    0    1    0    0    1    12/18/2009
            1432*/0x02AE, 2010, 12, 7,  /* 0    1    1    1    0    1    0    1    0    1    0    0    12/07/2010
            1433*/0x056D, 2011, 11, 26, /* 1    0    1    1    0    1    1    0    1    0    1    0    11/26/2011
            1434*/0x036A, 2012, 11, 15, /* 0    1    0    1    0    1    1    0    1    1    0    0    11/15/2012
            1435*/0x0B55, 2013, 11, 4,  /* 1    0    1    0    1    0    1    0    1    1    0    1    11/04/2013
            1436*/0x0AAA, 2014, 10, 25, /* 0    1    0    1    0    1    0    1    0    1    0    1    10/25/2014
            1437*/0x094D, 2015, 10, 14, /* 1    0    1    1    0    0    1    0    1    0    0    1    10/14/2015
            1438*/0x049D, 2016, 10, 2,  /* 1    0    1    1    1    0    0    1    0    0    1    0    10/02/2016
            1439*/0x095D, 2017, 9, 21,  /* 1    0    1    1    1    0    1    0    1    0    0    1    09/21/2017
            1440*/0x02BA, 2018, 9, 11,  /* 0    1    0    1    1    1    0    1    0    1    0    0    09/11/2018
            1441*/0x05B5, 2019, 8, 31,  /* 1    0    1    0    1    1    0    1    1    0    1    0    08/31/2019
            1442*/0x05AA, 2020, 8, 20,  /* 0    1    0    1    0    1    0    1    1    0    1    0    08/20/2020
            1443*/0x0D55, 2021, 8, 9,   /* 1    0    1    0    1    0    1    0    1    0    1    1    08/09/2021
            1444*/0x0A9A, 2022, 7, 30,  /* 0    1    0    1    1    0    0    1    0    1    0    1    07/30/2022
            1445*/0x092E, 2023, 7, 19,  /* 0    1    1    1    0    1    0    0    1    0    0    1    07/19/2023
            1446*/0x026E, 2024, 7, 7,   /* 0    1    1    1    0    1    1    0    0    1    0    0    07/07/2024
            1447*/0x055D, 2025, 6, 26,  /* 1    0    1    1    1    0    1    0    1    0    1    0    06/26/2025
            1448*/0x0ADA, 2026, 6, 16,  /* 0    1    0    1    1    0    1    1    0    1    0    1    06/16/2026
            1449*/0x06D4, 2027, 6, 6,   /* 0    0    1    0    1    0    1    1    0    1    1    0    06/06/2027
            1450*/0x06A5, 2028, 5, 25,  /* 1    0    1    0    0    1    0    1    0    1    1    0    05/25/2028
            1451*/0x054B, 2029, 5, 14,  /* 1    1    0    1    0    0    1    0    1    0    1    0    05/14/2029
            1452*/0x0A97, 2030, 5, 3,   /* 1    1    1    0    1    0    0    1    0    1    0    1    05/03/2030
            1453*/0x054E, 2031, 4, 23,  /* 0    1    1    1    0    0    1    0    1    0    1    0    04/23/2031
            1454*/0x0AAE, 2032, 4, 11,  /* 0    1    1    1    0    1    0    1    0    1    0    1    04/11/2032
            1455*/0x05AC, 2033, 4, 1,   /* 0    0    1    1    0    1    0    1    1    0    1    0    04/01/2033
            1456*/0x0BA9, 2034, 3, 21,  /* 1    0    0    1    0    1    0    1    1    1    0    1    03/21/2034
            1457*/0x0D92, 2035, 3, 11,  /* 0    1    0    0    1    0    0    1    1    0    1    1    03/11/2035
            1458*/0x0B25, 2036, 2, 28,  /* 1    0    1    0    0    1    0    0    1    1    0    1    02/28/2036
            1459*/0x064B, 2037, 2, 16,  /* 1    1    0    1    0    0    1    0    0    1    1    0    02/16/2037
            1460*/0x0CAB, 2038, 2, 5,   /* 1    1    0    1    0    1    0    1    0    0    1    1    02/05/2038
            1461*/0x055A, 2039, 1, 26,  /* 0    1    0    1    1    0    1    0    1    0    1    0    01/26/2039
            1462*/0x0B55, 2040, 1, 15,  /* 1    0    1    0    1    0    1    0    1    1    0    1    01/15/2040
            1463*/0x06D2, 2041, 1, 4,   /* 0    1    0    0    1    0    1    1    0    1    1    0    01/04/2041
            1464*/0x0EA5, 2041, 12, 24, /* 1    0    1    0    0    1    0    1    0    1    1    1    12/24/2041
            1465*/0x0E4A, 2042, 12, 14, /* 0    1    0    1    0    0    1    0    0    1    1    1    12/14/2042
            1466*/0x0A95, 2043, 12, 3,  /* 1    0    1    0    1    0    0    1    0    1    0    1    12/03/2043
            1467*/0x052D, 2044, 11, 21, /* 1    0    1    1    0    1    0    0    1    0    1    0    11/21/2044
            1468*/0x0AAD, 2045, 11, 10, /* 1    0    1    1    0    1    0    1    0    1    0    1    11/10/2045
            1469*/0x036C, 2046, 10, 31, /* 0    0    1    1    0    1    1    0    1    1    0    0    10/31/2046
            1470*/0x0759, 2047, 10, 20, /* 1    0    0    1    1    0    1    0    1    1    1    0    10/20/2047
            1471*/0x06D2, 2048, 10, 9,  /* 0    1    0    0    1    0    1    1    0    1    1    0    10/09/2048
            1472*/0x0695, 2049, 9, 28,  /* 1    0    1    0    1    0    0    1    0    1    1    0    09/28/2049
            1473*/0x052D, 2050, 9, 17,  /* 1    0    1    1    0    1    0    0    1    0    1    0    09/17/2050
            1474*/0x0A5B, 2051, 9, 6,   /* 1    1    0    1    1    0    1    0    0    1    0    1    09/06/2051
            1475*/0x04BA, 2052, 8, 26,  /* 0    1    0    1    1    1    0    1    0    0    1    0    08/26/2052
            1476*/0x09BA, 2053, 8, 15,  /* 0    1    0    1    1    1    0    1    1    0    0    1    08/15/2053
            1477*/0x03B4, 2054, 8, 5,   /* 0    0    1    0    1    1    0    1    1    1    0    0    08/05/2054
            1478*/0x0B69, 2055, 7, 25,  /* 1    0    0    1    0    1    1    0    1    1    0    1    07/25/2055
            1479*/0x0B52, 2056, 7, 14,  /* 0    1    0    0    1    0    1    0    1    1    0    1    07/14/2056
            1480*/0x0AA6, 2057, 7, 3,   /* 0    1    1    0    0    1    0    1    0    1    0    1    07/03/2057
            1481*/0x04B6, 2058, 6, 22,  /* 0    1    1    0    1    1    0    1    0    0    1    0    06/22/2058
            1482*/0x096D, 2059, 6, 11,  /* 1    0    1    1    0    1    1    0    1    0    0    1    06/11/2059
            1483*/0x02EC, 2060, 5, 31,  /* 0    0    1    1    0    1    1    1    0    1    0    0    05/31/2060
            1484*/0x06D9, 2061, 5, 20,  /* 1    0    0    1    1    0    1    1    0    1    1    0    05/20/2061
            1485*/0x0EB2, 2062, 5, 10,  /* 0    1    0    0    1    1    0    1    0    1    1    1    05/10/2062
            1486*/0x0D54, 2063, 4, 30,  /* 0    0    1    0    1    0    1    0    1    0    1    1    04/30/2063
            1487*/0x0D2A, 2064, 4, 18,  /* 0    1    0    1    0    1    0    0    1    0    1    1    04/18/2064
            1488*/0x0A56, 2065, 4, 7,   /* 0    1    1    0    1    0    1    0    0    1    0    1    04/07/2065
            1489*/0x04AE, 2066, 3, 27,  /* 0    1    1    1    0    1    0    1    0    0    1    0    03/27/2066
            1490*/0x096D, 2067, 3, 16,  /* 1    0    1    1    0    1    1    0    1    0    0    1    03/16/2067
            1491*/0x0D6A, 2068, 3, 5,   /* 0    1    0    1    0    1    1    0    1    0    1    1    03/05/2068
            1492*/0x0B54, 2069, 2, 23,  /* 0    0    1    0    1    0    1    0    1    1    0    1    02/23/2069
            1493*/0x0B29, 2070, 2, 12,  /* 1    0    0    1    0    1    0    0    1    1    0    1    02/12/2070
            1494*/0x0A93, 2071, 2, 1,   /* 1    1    0    0    1    0    0    1    0    1    0    1    02/01/2071
            1495*/0x052B, 2072, 1, 21,  /* 1    1    0    1    0    1    0    0    1    0    1    0    01/21/2072
            1496*/0x0A57, 2073, 1, 9,   /* 1    1    1    0    1    0    1    0    0    1    0    1    01/09/2073
            1497*/0x0536, 2073, 12, 30, /* 0    1    1    0    1    1    0    0    1    0    1    0    12/30/2073
            1498*/0x0AB5, 2074, 12, 19, /* 1    0    1    0    1    1    0    1    0    1    0    1    12/19/2074
            1499*/0x06AA, 2075, 12, 9,  /* 0    1    0    1    0    1    0    1    0    1    1    0    12/09/2075
            1500*/0x0E93, 2076, 11, 27, /* 1    1    0    0    1    0    0    1    0    1    1    1    11/27/2076
            1501*/     0, 2077, 11, 17  /* 0    0    0    0    0    0    0    0    0    0    0    0    11/17/2077*/];

        const mapping: DateMapping[] = [];
        for (let i = 0; i < rawData.length / 4; i++) {
            mapping.push(new DateMapping(rawData[i * 4], rawData[i * 4 + 1], rawData[i * 4 + 2] - 1, rawData[i * 4 + 3]));
        }

        return mapping;
    }
}

export default UmAlQuraCalendar;
