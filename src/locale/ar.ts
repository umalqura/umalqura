import Locale from './interfaces';

const symbolMap = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const dayNumMap = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر'];

const ar: Locale = {
    dayNamesShort: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    monthNamesShort: ['محرم', 'صفر', 'ربيع ١', 'ربيع ٢', 'جمادى ١', 'جمادى ٢', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    monthNames: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    timeNames: ['ص', 'م', 'ص', 'م', 'ص', 'م', 'ص', 'م'],
    masks: {
        default: 'ddd dd mmm yyyy HH:MM:ss',
        shortDate: 'yy/m/d',
        mediumDate: 'd mmm, yyyy',
        longDate: 'd mmmm, yyyy',
        fullDate: 'dddd, d mmmm, yyyy',
        shortTime: 'h:MM TT',
        mediumTime: 'h:MM:ss TT',
        longTime: 'h:MM:ss.l TT',
    },
    localizeNum: (num: number | string) => {
        const s = String(num);
        let output = '';
        for (let i = 0; i < s.length; i++) {
            output += symbolMap[s.charAt(i)];
        }

        return output;
    },
    localizeDayNum: (d: number) => {
        let output = '';
        if (d === 11) {
            output = 'الحادي عشر';
        } else if (d === 20) {
            output = 'العشرون';
        } else if (d === 30) {
            output = 'الثلاثون';
        } else {
            output = dayNumMap[d - 1];
        }

        const section = d / 10;
        if (section > 1.1 && section < 2) {
            output = dayNumMap[(d - 1) % 10] + ' عشر';
        } else if (section > 2 && section < 3) {
            output = dayNumMap[(d - 1) % 10] + ' والعشرون';
        }

        return output + ' من';
    },
    localizeCommas: (v: string) => v.replace(/,/g, '،'),
};

export default ar;
