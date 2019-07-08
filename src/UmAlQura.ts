import UmAlQuraStatic from './UmAlQuraStatic';

class UmAlQura {
    private _locale = 'en';
    private _date = new Date(0, 0, 0);
    private _hy = 0;
    private _hm = 0;
    private _hd = 0;

    public set locale(locale: string) { this._locale = locale; }

    public get date() { return new Date(this._date.valueOf()); }
    public get hy() { return this._hy; }
    public get hm() { return this._hm; }
    public get hd() { return this._hd; }

    public get dayOfYear() { return UmAlQuraStatic.getDayOfYear(this._date); }
    public get dayOfMonth() { return UmAlQuraStatic.getDayOfMonth(this._date); }
    public get dayOfWeek() { return UmAlQuraStatic.getDayOfWeek(this._date); }
    public get weekOfYear() { return UmAlQuraStatic.getWeekOfYear(this._date); }
    public get daysInYear() { return UmAlQuraStatic.getDaysInYear(this._hy); }
    public get daysInMonth() { return UmAlQuraStatic.getDaysInMonth(this._hy, this._hm); }
    public get isLeapYear() { return UmAlQuraStatic.isLeapYear(this._hy); }
    public get monthArray() { return UmAlQuraStatic.getMonthArray(this._date); }

    constructor();
    constructor(date: Date);
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

    public add(value: number, unit: 'year' | 'month' | 'week' | 'day') {
        switch (unit) {
            case 'year':
                this.setDate(UmAlQuraStatic.addYears(this._date, value));
                break;
            case 'month':
                this.setDate(UmAlQuraStatic.addMonths(this._date, value));
                break;
            case 'week':
                this.setDate(UmAlQuraStatic.addWeeks(this._date, value));
                break;
            case 'day':
                this.setDate(UmAlQuraStatic.addDays(this._date, value));
                break;
        }

        return this;
    }

    public subtract(value: number, unit: 'year' | 'month' | 'week' | 'day') {
        return this.add(value * -1, unit);
    }

    public startOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        return UmAlQuraStatic.startOf(this._date, unit);
    }

    public endOf(unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second') {
        return UmAlQuraStatic.endOf(this._date, unit);
    }

    public format(mask: string) {
        return UmAlQuraStatic.format(this._date, mask, this._locale);
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
