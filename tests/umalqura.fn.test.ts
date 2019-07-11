import umalqura from '../src/umalqura.fn';
import UmAlQuraStatic from '../src/UmAlQuraStatic';

describe('Locales', () => {
    it('locale() returns the globally set locale', () => {
        expect(umalqura.locale().name).toBe('en');
        umalqura.setLocale('ar');
        expect(umalqura.locale().name).toBe('ar');
    });
});

describe('Initializer', () => {
    it('no params - Initializes using current date', () => {
        const now = new Date();
        const uq = umalqura();
        const diff = Math.abs(uq.date.getTime() - now.getTime());
        const { hy, hm, hd } = UmAlQuraStatic.gregorianToHijri(now);

        expect(diff).toBeLessThan(30 * 1000);
        expect(uq.hy).toBe(hy);
        expect(uq.hm).toBe(hm);
        expect(uq.hd).toBe(hd);
    });

    it('date param - Initializes using given date', () => {
        const d = new Date(2019, 6, 3);
        const uq = umalqura(d);

        expect(uq.date).toEqual(d);
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });

    it('hy, hm, hd params - Initializes using given Hijri date', () => {
        const uq = umalqura(1440, 10, 30);

        expect(uq.date).toEqual(new Date(2019, 6, 3));
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });

    it('hy, hm, hd params - Initializes using given Hijri date and time', () => {
        const uq = umalqura(1440, 10, 30, 19, 1, 15, 200);

        expect(uq.date).toEqual(new Date(2019, 6, 3, 19, 1, 15, 200));
        expect(uq.hy).toBe(1440);
        expect(uq.hm).toBe(10);
        expect(uq.hd).toBe(30);
    });
});
