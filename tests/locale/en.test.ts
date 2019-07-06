import en from '../../src/locale/en';

const l = en;

describe('English locale test', () => {
    it('dayNamesShort', () => {
        expect(l.dayNamesShort).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });

    it('dayNames', () => {
        expect(l.dayNames).toEqual(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    });

    it('monthNamesShort', () => {
        expect(l.monthNamesShort).toEqual(['Muh', 'Ṣaf', 'Rab-I', 'Rab-II', 'Jum-I', 'Jum-II', 'Raj', 'Sha', 'Ram', 'Shw', 'Dhū-Q', 'Dhū-Ḥ']);
    });

    it('monthNames', () => {
        expect(l.monthNames).toEqual(['Muharram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ ath-Thānī', 'Jumādá al-Ūlá', 'Jumādá al-Ākhirah', 'Rajab', 'Sha‘bān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qa‘dah', 'Dhū al-Ḥijjah']);
    });

    it('timeNames', () => {
        expect(l.timeNames).toEqual(['a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM']);
    });

    it('masks', () => {
        expect(l.masks.default).toBe('ddd mmm dd yyyy HH:MM:ss');
        expect(l.masks.shortDate).toBe('m/d/yy');
        expect(l.masks.mediumDate).toBe('mmm d, yyyy');
        expect(l.masks.longDate).toBe('mmmm d, yyyy');
        expect(l.masks.fullDate).toBe('dddd, mmmm d, yyyy');
        expect(l.masks.shortTime).toBe('h:MM TT');
        expect(l.masks.mediumTime).toBe('h:MM:ss TT');
        expect(l.masks.longTime).toBe('h:MM:ss.l TT');
    });

    it('localizeNum - number', () => {
        for (let n = 0; n <= 9; n++) {
            expect(l.localizeNum(n)).toBe(n.toString());
        }
    });

    it('localizeNum - string', () => {
        for (let n = 0; n <= 9; n++) {
            expect(l.localizeNum(n.toString())).toBe(n.toString());
        }
    });

    it('localizeDayNum', () => {
        expect(l.localizeDayNum(1)).toBe('st');
        expect(l.localizeDayNum(2)).toBe('nd');
        expect(l.localizeDayNum(3)).toBe('rd');
        expect(l.localizeDayNum(4)).toBe('th');
        expect(l.localizeDayNum(5)).toBe('th');
        expect(l.localizeDayNum(6)).toBe('th');
        expect(l.localizeDayNum(7)).toBe('th');
        expect(l.localizeDayNum(8)).toBe('th');
        expect(l.localizeDayNum(9)).toBe('th');
        expect(l.localizeDayNum(10)).toBe('th');
        expect(l.localizeDayNum(11)).toBe('th');
        expect(l.localizeDayNum(12)).toBe('th');
        expect(l.localizeDayNum(13)).toBe('th');
        expect(l.localizeDayNum(14)).toBe('th');
        expect(l.localizeDayNum(15)).toBe('th');
        expect(l.localizeDayNum(16)).toBe('th');
        expect(l.localizeDayNum(17)).toBe('th');
        expect(l.localizeDayNum(18)).toBe('th');
        expect(l.localizeDayNum(19)).toBe('th');
        expect(l.localizeDayNum(20)).toBe('th');
        expect(l.localizeDayNum(21)).toBe('st');
        expect(l.localizeDayNum(22)).toBe('nd');
        expect(l.localizeDayNum(23)).toBe('rd');
        expect(l.localizeDayNum(24)).toBe('th');
        expect(l.localizeDayNum(25)).toBe('th');
        expect(l.localizeDayNum(26)).toBe('th');
        expect(l.localizeDayNum(27)).toBe('th');
        expect(l.localizeDayNum(28)).toBe('th');
        expect(l.localizeDayNum(29)).toBe('th');
        expect(l.localizeDayNum(30)).toBe('th');
    });
});
