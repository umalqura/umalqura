import UmAlQuraStatic from './UmAlQuraStatic';
import { UnitOfTime, UnitOfTimeMs } from './units';

class UmAlQura {
    private _date = new Date(0, 0, 0);
    private _hy = 0;
    private _hm = 0;
    private _hd = 0;

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
    public get monthArray() {
        return UmAlQuraStatic.getMonthArray(this.date)
            .map(w => w.map(d => d ? new UmAlQura(d) : null));
    }

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
     * @param {number} hour The Hour component, defaults to zero
     * @param {number} minute The Minute component, defaults to zero
     * @param {number} second The Second component, defaults to zero
     * @param {number} millisecond The Millisecond component, defaults to zero
     */
    constructor(hy: number, hm: number, hd: number, hour?: number, minute?: number, second?: number, millisecond?: number);
    constructor(dateOrHy?: Date | number, hm?: number, hd?: number, hour = 0, minute = 0, second = 0, millisecond = 0) {
        if (dateOrHy instanceof Date) {
            this._setDate(dateOrHy);
        } else if (dateOrHy !== undefined && hm !== undefined && hd !== undefined) {
            const { gy, gm, gd } = UmAlQuraStatic.hijriToGregorian(dateOrHy, hm, hd);
            this._setDate(new Date(gy, gm, gd, hour, minute, second, millisecond));
        } else {
            this._setDate(new Date());
        }
    }

    /**
     * Adds the specified amount of `unit` to the current date and returns a new instance.
     * @param {number} value The amount of units to be added
     * @param {UnitOfTimeMs} unit The unit of time
     */
    public add(value: number, unit: UnitOfTimeMs) {
        switch (unit) {
            case 'year':
                return new UmAlQura(UmAlQuraStatic.addYears(this.date, value));
            case 'month':
                return new UmAlQura(UmAlQuraStatic.addMonths(this.date, value));
            case 'week':
                return new UmAlQura(UmAlQuraStatic.addWeeks(this.date, value));
            case 'day':
                return new UmAlQura(UmAlQuraStatic.addDays(this.date, value));
            case 'hour':
            case 'minute':
            case 'second':
            case 'millisecond':
                return new UmAlQura(UmAlQuraStatic.addTime(this.date, value, unit));
            default:
                throw new Error('Invalid value for `unit`');
        }
    }

    /**
     * Subtracts the specified amount of `unit` from the current date and returns a new instance.
     * @param {number} value The amount of units to be subtracted
     * @param {UnitOfTimeMs} unit The unit of time
     */
    public subtract(value: number, unit: UnitOfTimeMs) {
        return this.add(value * -1, unit);
    }

    /**
     * Returns a new instance having the Hijri date of this instance starting at the specified unit of time.
     * @param {UnitOfTime} unit The unit of time
     */
    public startOf(unit: UnitOfTime) {
        return new UmAlQura(UmAlQuraStatic.startOf(this.date, unit));
    }

    /**
     * Returns a new instance having the Hijri date of this instance ending at the specified unit of time.
     * @param {UnitOfTime} unit The unit of time
     */
    public endOf(unit: UnitOfTime) {
        return new UmAlQura(UmAlQuraStatic.endOf(this.date, unit));
    }

    /**
     * Checks if current date is before the specified date. The comparison is made based on milliseconds of both
     * times. This can be changed by specifying a value for the `unit` parameter.
     * @param {(UmAlQura | Date)} other The date to compare against
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isBefore(other: UmAlQura | Date, unit: UnitOfTimeMs = 'millisecond') {
        const thisDate = this.date;
        const thatDate = other instanceof Date ? other : other.date;

        if (unit === 'millisecond') {
            return thisDate.valueOf() < thatDate.valueOf();
        } else {
            return this.endOf(unit).date.valueOf() < thatDate.valueOf();
        }
    }

    /**
     * Checks if current date is after the specified date. The comparison is made based on milliseconds,
     * this can be changed by specifying a value for the `unit` parameter.
     * @param {(UmAlQura | Date)} other The date to compare against
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isAfter(other: UmAlQura | Date, unit: UnitOfTimeMs = 'millisecond') {
        const thisDate = this.date;
        const thatDate = other instanceof Date ? other : other.date;

        if (unit === 'millisecond') {
            return thisDate.valueOf() > thatDate.valueOf();
        } else {
            return this.startOf(unit).date.valueOf() > thatDate.valueOf();
        }
    }

    /**
     * Checks if current date is same as the specified date. The comparison is made based on milliseconds,
     * this can be changed by specifying a value for the `unit` parameter.
     * @param {(UmAlQura | Date)} other The date to compare against
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isSame(other: UmAlQura | Date, unit: UnitOfTimeMs = 'millisecond') {
        const thisDate = this.date;
        const thatDate = other instanceof Date ? other : other.date;

        if (unit === 'millisecond') {
            return thisDate.valueOf() === thatDate.valueOf();
        } else {
            return this.startOf(unit).date.valueOf() === new UmAlQura(thatDate).startOf(unit).date.valueOf();
        }
    }

    /**
     * Checks if current date is same as or before the specified date. The comparison is made based on milliseconds,
     * this can be changed by specifying a value for the `unit` parameter.
     * @param {(UmAlQura | Date)} other The date to compare against
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isSameOrBefore(other: UmAlQura | Date, unit: UnitOfTimeMs = 'millisecond') {
        return this.isSame(other, unit) || this.isBefore(other, unit);
    }

    /**
     * Checks if current date is same as or after the specified date. The comparison is made based on milliseconds,
     * this can be changed by specifying a value for the `unit` parameter.
     * @param {(UmAlQura | Date)} other The date to compare against
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isSameOrAfter(other: UmAlQura | Date, unit: UnitOfTimeMs = 'millisecond') {
        return this.isSame(other, unit) || this.isAfter(other, unit);
    }

    /**
     * Checks if current date is between the specified `from`/`to` dates. The comparison is made based on milliseconds,
     * this can be changed by specifying a value for the `unit` parameter. The comparison is exclusive of both ends by default,
     * this can be controller by `fromInclusive`/`toInclusive` parameters.
     * @param {(UmAlQura | Date)} from The lower bound date
     * @param {(UmAlQura | Date)} to The higher bound date
     * @param {boolean} [fromInclusive=false] Whether lower bound is inclusive, defaults to false.
     * @param {boolean} [toInclusive=false] Whether upper bound is inclusive, defaults to false.
     * @param {UnitOfTimeMs} [unit='millisecond'] The unit of time
     */
    public isBetween(from: UmAlQura | Date, to: UmAlQura | Date, fromInclusive: boolean = false, toInclusive: boolean = false, unit: UnitOfTimeMs = 'millisecond') {
        return (fromInclusive ? this.isSameOrAfter(from, unit) : this.isAfter(from, unit)) &&
            (toInclusive ? this.isSameOrBefore(to, unit) : this.isBefore(to, unit));
    }

    /**
     * Formats this instance in Hijri date.
     * @param {string} mask The mask
     * @param {string} locale The locale to use. If omitted, uses  the locale set via `locale` or the default locale.
     */
    public format(mask: string, locale?: string) {
        // tslint:disable-next-line:no-string-literal
        return UmAlQuraStatic.format(this.date, mask, locale || UmAlQuraStatic['locale'].name);
    }

    /**
     * Clones this instance and returns a new instance with the same values.
     */
    public clone() {
        return new UmAlQura(this.date);
    }

    private _setDate(date: Date) {
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(date);
        this._date = new Date(date.valueOf());
        this._hy = hy;
        this._hm = hm;
        this._hd = hd;
    }
}

export default UmAlQura;
