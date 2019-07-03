class DateMapping {
    constructor(monthsLengthFlags: number, gy: number, gm: number, gd: number) {
        this.hijriMonthsLengthFlags = monthsLengthFlags;
        this.gregorianDate = new Date(gy, gm, gd);
    }

    public hijriMonthsLengthFlags: number;
    public gregorianDate: Date;
}

export default DateMapping;
