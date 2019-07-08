import UmAlQuraStatic from './UmAlQuraStatic';

class UmAlQura {
    private _locale = 'en';
    private _date = new Date(0, 0, 0);
    private _hy = 0;
    private _hm = 0;
    private _hd = 0;

    /**
     * Sets the locale to be used for formatting.
     */
    public set locale(locale: string) { this._locale = locale; }
    /**
     * Returns the locale for this instance.
     */
    public get locale() { return this._locale; }

    /**
     * Returns the `Date` object of this instance.
     */
    public get date() { return new Date(this._date.valueOf()); }
    /**
     * Returns the Hijri year of this instance.
     */
    public get hy() { return this._hy; }
    /**
     * Returns the Hijri month of this instance.
     */
    public get hm() { return this._hm; }
    /**
     * Returns the Hijri day of this instance.
     */
    public get hd() { return this._hd; }

    /**
     * Returns the Hijri day of year of this instance.
     */
    public get dayOfYear() { return UmAlQuraStatic.getDayOfYear(this.date); }
    /**
     * Returns the Hijri day of month year of this instance.
     */
    public get dayOfMonth() { return UmAlQuraStatic.getDayOfMonth(this.date); }
    /**
     * Returns the day of week of this instance.
     */
    public get dayOfWeek() { return UmAlQuraStatic.getDayOfWeek(this.date); }
    /**
     * Returns the Hijri week of year of this instance.
     */
    public get weekOfYear() { return UmAlQuraStatic.getWeekOfYear(this.date); }
    /**
     * Returns the number of days in year of this instance.
     */
    public get daysInYear() { return UmAlQuraStatic.getDaysInYear(this.hy); }
    /**
     * Returns the number of days in month of this instance.
     */
    public get daysInMonth() { return UmAlQuraStatic.getDaysInMonth(this.hy, this.hm); }
    /**
     * Returns whether or not the Hijri year of this instance is a leap year.
     */
    public get isLeapYear() { return UmAlQuraStatic.isLeapYear(this.hy); }
    /**
     * Returns the Hijri month array of this instance.
     */
    public get monthArray() { return UmAlQuraStatic.getMonthArray(this.date); }

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
    constructor(dateOrHy?: Date | number, hm?: number, hd?: number) {
        if (dateOrHy instanceof Date) {
            this.setDate(dateOrHy);
        } else if (dateOrHy !== undefined && hm !== undefined && hd !== undefined) {
            const { gy, gm, gd } = UmAlQuraStatic.hijriToGregorian(dateOrHy, hm, hd);
            this.setDate(new Date(gy, gm, gd));
        } else {
            this.setDate(new Date());
        }
    }

    /**
     * Adds the specified amount of `unit` to the current of this instance.
     * @param {number} value The amount of units to be added
     * @param {('year' | 'month' | 'week' | 'day')} unit The unit of time
     * @returns Reference to this instance.
     */
    public add(value: number, unit: 'year' | 'month' | 'week' | 'day') {
        switch (unit) {
            case 'year':
                this.setDate(UmAlQuraStatic.addYears(this.date, value));
                break;
            case 'month':
                this.setDate(UmAlQuraStatic.addMonths(this.date, value));
                break;
            case 'week':
                this.setDate(UmAlQuraStatic.addWeeks(this.date, value));
                break;
            case 'day':
                this.setDate(UmAlQuraStatic.addDays(this.date, value));
                break;
        }

        return this;
    }

    /**
     * Subtracts the specified amount of `unit` from the current of this instance.
     * @param {number} value The amount of units to be subtracted
     * @param {('year' | 'month' | 'week' | 'day')} unit The unit of time
     * @returns Reference to this instance.
     */
    public subtract(value: number, unit: 'year' | 'month' | 'week' | 'day') {
        return this.add(value * -1, unit);
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date of this instance starting at the specified unit of time.
     * @param {('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')} unit The unit of time
     */
    public startOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        return UmAlQuraStatic.startOf(this.date, unit);
    }

    /**
     * Returns the Gregorian date corresponding to the Hijri date of this instance ending at the specified unit of time.
     * @param {('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')} unit The unit of time
     */
    public endOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        return UmAlQuraStatic.endOf(this.date, unit);
    }

    /**
     * Formats this instance in Hijri date. Uses the locale set via `locale` or the default locale.
     * @param {string} mask The mask
     */
    public format(mask: string) {
        return UmAlQuraStatic.format(this.date, mask, this.locale);
    }

    private setDate(date: Date) {
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(date);
        this._date = new Date(date.valueOf());
        this._hy = hy;
        this._hm = hm;
        this._hd = hd;
    }
}

export default UmAlQura;
