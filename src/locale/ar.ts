import Locale from './Locale';

const symbolMap = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const dayNumMap = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر', 'الحادي عشر'];

const ar: Locale = {
    name: 'ar',
    rtl: true,
    dayNamesShort: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    monthNamesShort: ['محرم', 'صفر', 'ربيع ١', 'ربيع ٢', 'جمادى ١', 'جمادى ٢', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    monthNames: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
    timeNames: ['ص', 'م', 'ص', 'م', 'ص', 'م', 'ص', 'م'],
    masks: {
        default: 'ddd dd MMM yyyy HH:mm:ss',
        shortDate: 'yy/M/d',
        mediumDate: 'd MMM, yyyy',
        longDate: 'd MMMM, yyyy',
        fullDate: 'dddd, d MMMM, yyyy',
        shortTime: 'h:mm TT',
        mediumTime: 'h:mm:ss TT',
        longTime: 'h:mm:ss.l TT',
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
