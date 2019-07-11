/**
 * Initializes UmAlQura instance using current date and time.
 */
declare function umalqura(): umalqura.UmAlQura;
/**
 * Initializes UmAlQura instance using the specified date and time.
 * @param {Date} date The date
 */
declare function umalqura(date: Date): umalqura.UmAlQura;
/**
 * Initializes UmAlQura instance using the specified Hijri year, month and day.
 * @param {number} hy The Hijri year
 * @param {number} hm The Hijri month
 * @param {number} hd The Hijri day
 */
declare function umalqura(hy: number, hm: number, hd: number): umalqura.UmAlQura;

declare namespace umalqura {
    /**
     * Returns library version.
     */
    const VERSION: string;
    /**
     * Returns a class which exposes static Hijri related functions.
     */
    const $: typeof UmAlQuraStatic;
    /**
     * Returns the globally set locale.
     */
    const locale: () => Locale;
    /**
      * Sets global locale to be used for formatting.
      * @param locale The locale
      */
    const setLocale: typeof UmAlQuraStatic.setLocale;

    class UmAlQuraStatic {
        /**
         * The minimum supported Hijri calendar year.
         */
        static readonly minCalendarYear = 1318;
        /**
         * The maximum supported Hijri calendar year.
         */
        static readonly maxCalendarYear = 1500;
        /**
          * Coverts the given Hijri date to Gregorian.
          * @param hy The Hijri year
          * @param hm The Hijri month
          * @param hd The Hijri day
          */
        static hijriToGregorian(hy: number, hm: number, hd: number): {
            gy: number;
            gm: number;
            gd: number;
        };
        /**
          * Coverts the given Gregorian date to Hijri year, month and day.
          * @param date The date to be converted
          */
        static gregorianToHijri(date: Date): {
            hy: number;
            hm: number;
            hd: number;
        };
        /**
          * Adds the specified amount of Hijri years to the given Gregorian date.
          * @param date The date
          * @param hys The Hijri years to be added
          */
        static addYears(date: Date, hys: number): Date;
        /**
          * Adds the specified amount of Hijri months to the given Gregorian date.
          * @param date The date
          * @param hms The Hijri months to be added
          */
        static addMonths(date: Date, hms: number): Date;
        /**
          * Adds the specified amount of weeks to the given Gregorian date.
          * @param date The date
          * @param wks The weeks to be added
          */
        static addWeeks(date: Date, wks: number): Date;
        /**
          * Adds the specified amount of days to the given Gregorian date.
          * @param date The date
          * @param days The days to be added
          */
        static addDays(date: Date, days: number): Date;
        /**
          * Returns the Hijri day of year for the specified Gregorian date.
          * @param date The date
          */
        static getDayOfYear(date: Date): number;
        /**
          * Returns the Hijri day of month for the specified Gregorian date.
          * @param date The date
          */
        static getDayOfMonth(date: Date): number;
        /**
          * Returns the day of week for the specified Gregorian date.
          * @param date The date
          */
        static getDayOfWeek(date: Date): number;
        /**
          * Returns the Hijri week of year for the specified Gregorian date.
          * @param date The date
          */
        static getWeekOfYear(date: Date): number;
        /**
          * Returns the number of days in the specified Hijri year.
          * @param hy The Hijri year
          */
        static getDaysInYear(hy: number): 355 | 354;
        /**
          * Returns the number of days in the specified Hijri year and month.
          * @param hy The Hijri year
          * @param hm The Hijri month
          */
        static getDaysInMonth(hy: number, hm: number): 30 | 29;
        /**
          * Returns the Hijri year corresponding to the given Gregorian date.
          * @param date The date
          */
        static getYear(date: Date): number;
        /**
          * Returns the Hijri month corresponding to the given Gregorian date.
          * @param date The date
          */
        static getMonth(date: Date): number;
        /**
          * Returns the Hijri month array for the given Gregorian date.
          * @param date The date
          */
        static getMonthArray(date: Date): (Date | null)[][];
        /**
         * Returns the Gregorian date corresponding to the Hijri date starting at the specified unit of time.
         * @param date: The date
         * @param unit: The unit of time
         */
        static startOf(date: Date, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): Date;
        /**
         * Returns the Gregorian date corresponding to the Hijri date ending at the specified unit of time.
         * @param date: The date
         * @param unit: The unit of time
         */
        static endOf(date: Date, unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): Date;
        /**
          * Returns whether or not the given Hijri year is a leap year.
          * A Hijri leap year is where the number of days in that year is 355.
          * @param hy The Hijri year
          */
        static isLeapYear(hy: number): boolean;
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
        static toDate(hy: number, hm: number, hd: number, hour?: number, minute?: number, second?: number, millisecond?: number): Date;
        /**
          * Formats the specified Gregorian Date instance in Hijri date.
          * @param date The date
          * @param mask The format mask
          * @param locale The locale to use. If omitted, uses the globally set locale or the default locale.
          */
        static format(date: Date, mask: string, locale?: string): string;
        /**
          * Sets global locale to be used for formatting.
          * @param locale The locale
          */
        static setLocale(locale: string): void;
    }

    class UmAlQura {
        /**
         * Returns the `Date` object of this instance.
         */
        readonly date: Date;
        /**
         * Returns the Hijri year of this instance.
         */
        readonly hy: number;
        /**
         * Returns the Hijri month of this instance.
         */
        readonly hm: number;
        /**
         * Returns the Hijri day of this instance.
         */
        readonly hd: number;
        /**
         * Returns the Hijri day of year of this instance.
         */
        readonly dayOfYear: number;
        /**
         * Returns the Hijri day of month year of this instance.
         */
        readonly dayOfMonth: number;
        /**
         * Returns the day of week of this instance.
         */
        readonly dayOfWeek: number;
        /**
         * Returns the Hijri week of year of this instance.
         */
        readonly weekOfYear: number;
        /**
         * Returns the number of days in year of this instance.
         */
        readonly daysInYear: 355 | 354;
        /**
         * Returns the number of days in month of this instance.
         */
        readonly daysInMonth: 30 | 29;
        /**
         * Returns whether or not the Hijri year of this instance is a leap year.
         */
        readonly isLeapYear: boolean;
        /**
         * Returns the Hijri month array of this instance.
         */
        readonly monthArray: (Date | null)[][];
        /**
         * Creates an instance of UmAlQura.
         */
        constructor();
        /**
         * Creates an instance of UmAlQura.
         * @param {Date} date The date
         */
        constructor(date: Date);
        /**
         * Creates an instance of UmAlQura.
         * @param {number} hy The Hijri year
         * @param {number} hm The Hijri month
         * @param {number} hd The Hijri day
         */
        constructor(hy: number, hm: number, hd: number);
        /**
         * Adds the specified amount of `unit` to the current date and returns a new instance.
         * @param {number} value The amount of units to be added
         * @param {('year' | 'month' | 'week' | 'day')} unit The unit of time
         * @returns Reference to this instance.
         */
        add(value: number, unit: 'year' | 'month' | 'week' | 'day'): UmAlQura;
        /**
         * Subtracts the specified amount of `unit` from the current date and returns a new instance.
         * @param {number} value The amount of units to be subtracted
         * @param {('year' | 'month' | 'week' | 'day')} unit The unit of time
         * @returns Reference to this instance.
         */
        subtract(value: number, unit: 'year' | 'month' | 'week' | 'day'): UmAlQura;
        /**
         * Returns a new instance having the Hijri date of this instance starting at the specified unit of time.
         * @param {('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')} unit The unit of time
         */
        startOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): UmAlQura;
        /**
         * Returns a new instance having the Hijri date of this instance ending at the specified unit of time.
         * @param {('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')} unit The unit of time
         */
        endOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'): UmAlQura;
        /**
         * Formats this instance in Hijri date.
         * @param {string} mask The mask
         * @param {string} locale The locale to use. If omitted, uses  the locale set via `locale` or the default locale.
         */
        format(mask: string, locale?: string): string;
    }

    interface Mask {
        default: string;
        shortDate: string;
        mediumDate: string;
        longDate: string;
        fullDate: string;
        shortTime: string;
        mediumTime: string;
        longTime: string;
    }

    interface Locale {
        name: string;
        rtl?: boolean;
        dayNamesShort: string[];
        dayNames: string[];
        monthNamesShort: string[];
        monthNames: string[];
        timeNames: string[];
        masks: Mask;
        localizeNum: (num: number | string) => string;
        localizeDayNum: (d: number) => string;
        localizeCommas: (v: string) => string;
    }
}

export default umalqura;
