import Locale from './interface';

const en: Locale = {
    dayNamesShort: [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    ],
    dayNames: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ],
    monthNamesShort: [
        'Muh', 'Ṣaf', 'Rab-I', 'Rab-II', 'Jum-I', 'Jum-II', 'Raj', 'Sha', 'Ram', 'Shw', 'Dhū-Q', 'Dhū-Ḥ',
    ],
    monthNames: [
        'Muharram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ ath-Thānī', 'Jumādá al-Ūlá', 'Jumādá al-Ākhirah', 'Rajab', 'Sha‘bān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qa‘dah', 'Dhū al-Ḥijjah',
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM',
    ],
    localizeNum: (num: number | string) => String(num),
    // @ts-ignore
    localizeDayNum: (d: number) => ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10],
};

export default en;
