class DateMapping {
    public hijriMonthsLengthFlags: number;
    public gregorianDate: Date;

    constructor(monthsLengthFlags: number, gy: number, gm: number, gd: number) {
        this.hijriMonthsLengthFlags = monthsLengthFlags;
        this.gregorianDate = new Date(gy, gm, gd);
    }
}

export default DateMapping;
