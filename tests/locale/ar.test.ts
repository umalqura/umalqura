import ar from '../../src/locale/ar';

const l = ar;

describe('Arabic locale test', () => {
    it('name', () => expect(l.name).toBe('ar'));
    it('rtl', () => expect(l.rtl).toBeTruthy());

    it('dayNamesShort', () => {
        expect(l.dayNamesShort).toEqual(['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س']);
    });

    it('dayNames', () => {
        expect(l.dayNames).toEqual(['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']);
    });

    it('monthNamesShort', () => {
        expect(l.monthNamesShort).toEqual(['محرم', 'صفر', 'ربيع ١', 'ربيع ٢', 'جمادى ١', 'جمادى ٢', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']);
    });

    it('monthNames', () => {
        expect(l.monthNames).toEqual(['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']);
    });

    it('timeNames', () => {
        expect(l.timeNames).toEqual(['ص', 'م', 'ص', 'م', 'ص', 'م', 'ص', 'م']);
    });

    it('masks', () => {
        expect(l.masks.default).toBe('ddd dd mmm yyyy HH:MM:ss');
        expect(l.masks.shortDate).toBe('yy/m/d');
        expect(l.masks.mediumDate).toBe('d mmm, yyyy');
        expect(l.masks.longDate).toBe('d mmmm, yyyy');
        expect(l.masks.fullDate).toBe('dddd, d mmmm, yyyy');
        expect(l.masks.shortTime).toBe('h:MM TT');
        expect(l.masks.mediumTime).toBe('h:MM:ss TT');
        expect(l.masks.longTime).toBe('h:MM:ss.l TT');
    });

    it('localizeNum - number', () => {
        expect(l.localizeNum(0)).toBe('٠');
        expect(l.localizeNum(1)).toBe('١');
        expect(l.localizeNum(2)).toBe('٢');
        expect(l.localizeNum(3)).toBe('٣');
        expect(l.localizeNum(4)).toBe('٤');
        expect(l.localizeNum(5)).toBe('٥');
        expect(l.localizeNum(6)).toBe('٦');
        expect(l.localizeNum(7)).toBe('٧');
        expect(l.localizeNum(8)).toBe('٨');
        expect(l.localizeNum(9)).toBe('٩');
    });

    it('localizeNum - string', () => {
        expect(l.localizeNum('0')).toBe('٠');
        expect(l.localizeNum('1')).toBe('١');
        expect(l.localizeNum('2')).toBe('٢');
        expect(l.localizeNum('3')).toBe('٣');
        expect(l.localizeNum('4')).toBe('٤');
        expect(l.localizeNum('5')).toBe('٥');
        expect(l.localizeNum('6')).toBe('٦');
        expect(l.localizeNum('7')).toBe('٧');
        expect(l.localizeNum('8')).toBe('٨');
        expect(l.localizeNum('9')).toBe('٩');
    });

    it('localizeDayNum', () => {
        expect(l.localizeDayNum(1)).toBe('الأول من');
        expect(l.localizeDayNum(2)).toBe('الثاني من');
        expect(l.localizeDayNum(3)).toBe('الثالث من');
        expect(l.localizeDayNum(4)).toBe('الرابع من');
        expect(l.localizeDayNum(5)).toBe('الخامس من');
        expect(l.localizeDayNum(6)).toBe('السادس من');
        expect(l.localizeDayNum(7)).toBe('السابع من');
        expect(l.localizeDayNum(8)).toBe('الثامن من');
        expect(l.localizeDayNum(9)).toBe('التاسع من');
        expect(l.localizeDayNum(10)).toBe('العاشر من');
        expect(l.localizeDayNum(11)).toBe('الحادي عشر من');
        expect(l.localizeDayNum(12)).toBe('الثاني عشر من');
        expect(l.localizeDayNum(13)).toBe('الثالث عشر من');
        expect(l.localizeDayNum(14)).toBe('الرابع عشر من');
        expect(l.localizeDayNum(15)).toBe('الخامس عشر من');
        expect(l.localizeDayNum(16)).toBe('السادس عشر من');
        expect(l.localizeDayNum(17)).toBe('السابع عشر من');
        expect(l.localizeDayNum(18)).toBe('الثامن عشر من');
        expect(l.localizeDayNum(19)).toBe('التاسع عشر من');
        expect(l.localizeDayNum(20)).toBe('العشرون من');
        expect(l.localizeDayNum(21)).toBe('الأول والعشرون من');
        expect(l.localizeDayNum(22)).toBe('الثاني والعشرون من');
        expect(l.localizeDayNum(23)).toBe('الثالث والعشرون من');
        expect(l.localizeDayNum(24)).toBe('الرابع والعشرون من');
        expect(l.localizeDayNum(25)).toBe('الخامس والعشرون من');
        expect(l.localizeDayNum(26)).toBe('السادس والعشرون من');
        expect(l.localizeDayNum(27)).toBe('السابع والعشرون من');
        expect(l.localizeDayNum(28)).toBe('الثامن والعشرون من');
        expect(l.localizeDayNum(29)).toBe('التاسع والعشرون من');
        expect(l.localizeDayNum(30)).toBe('الثلاثون من');
    });

    it('localizeCommas', () => {
        expect(l.localizeCommas('ddd, mmm')).toBe('ddd، mmm');
    });
});
