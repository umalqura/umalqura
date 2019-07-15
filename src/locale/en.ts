import Locale from './Locale';

const en: Locale = {
    name: 'en',
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNamesShort: ['Muh', 'Ṣaf', 'Rab-I', 'Rab-II', 'Jum-I', 'Jum-II', 'Raj', 'Sha', 'Ram', 'Shw', 'Dhū-Q', 'Dhū-Ḥ'],
    monthNames: ['Muharram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ ath-Thānī', 'Jumādá al-Ūlá', 'Jumādá al-Ākhirah', 'Rajab', 'Sha‘bān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qa‘dah', 'Dhū al-Ḥijjah'],
    timeNames: ['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'],
    masks: {
        default: 'ddd MMM dd yyyy HH:mm:ss',
        shortDate: 'M/d/yy',
        mediumDate: 'MMM d, yyyy',
        longDate: 'MMMM d, yyyy',
        fullDate: 'dddd, MMMM d, yyyy',
        shortTime: 'h:mm TT',
        mediumTime: 'h:mm:ss TT',
        longTime: 'h:mm:ss.l TT',
    },
    localizeNum: (num: number | string) => String(num),
    // @ts-ignore
    localizeDayNum: (d: number) => ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10],
    localizeCommas: (v: string) => v,
};

export default en;
