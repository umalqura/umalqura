interface Locale {
    dayNamesShort: string[];
    dayNames: string[];
    monthNamesShort: string[];
    monthNames: string[];
    timeNames: string[];

    localizeNum: (num: number | string) => string;
    localizeDayNum: (d: number) => string;
}

export default Locale;
