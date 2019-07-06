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

export default Locale;
