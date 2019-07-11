import UmAlQura from './UmAlQura';
import UmAlQuraStatic from './UmAlQuraStatic';

/**
 * Initializes UmAlQura instance using current date and time.
 */
function umalqura(): UmAlQura;
/**
 * Initializes UmAlQura instance using the specified date and time.
 * @param {Date} date The date
 */
function umalqura(date: Date): UmAlQura;
/**
 * Initializes UmAlQura instance using the specified Hijri year, month and day.
 * @param {number} hy The Hijri year
 * @param {number} hm The Hijri month
 * @param {number} hd The Hijri day
 * @param {number} hour The Hour component, defaults to zero
 * @param {number} minute The Minute component, defaults to zero
 * @param {number} second The Second component, defaults to zero
 * @param {number} millisecond The Millisecond component, defaults to zero
 */
function umalqura(hy: number, hm: number, hd: number, hour?: number, minute?: number, second?: number, millisecond?: number): UmAlQura;
function umalqura(dateOrHy?: Date | number, hm?: number, hd?: number, hour = 0, minute = 0, second = 0, millisecond = 0): UmAlQura {
    if (dateOrHy instanceof Date) {
        return new UmAlQura(dateOrHy);
    } else if (dateOrHy !== undefined && hm !== undefined && hd !== undefined) {
        return new UmAlQura(dateOrHy, hm, hd, hour, minute, second, millisecond);
    } else {
        return new UmAlQura();
    }
}

/**
 * Returns the library version.
 */
umalqura.VERSION = "0.0.0-DEV_BUILD";
/**
 * Returns a class which exposes static Hijri related functions.
 */
umalqura.$ = UmAlQuraStatic;
/**
 * Gets or sets the global locale
  * @param locale The locale to set. If omitted, returns the current locale
 */
umalqura.locale = (locale?: string) => locale ? UmAlQuraStatic.setLocale(locale) : UmAlQuraStatic['locale'].name;
/**
 * Returns the times names using the currently set locale.
 */
umalqura.times = () => [...UmAlQuraStatic['locale'].timeNames];
/**
 * Returns the days names using the currently set locale.
 */
umalqura.days = () => [...UmAlQuraStatic['locale'].dayNames];
/**
 * Returns the days short names using the currently set locale.
 */
umalqura.daysShort = () => [...UmAlQuraStatic['locale'].dayNamesShort];
/**
 * Returns the months names using the currently set locale.
 */
umalqura.months = () => [...UmAlQuraStatic['locale'].monthNames];
/**
 * Returns the months short names using the currently set locale.
 */
umalqura.monthsShort = () => [...UmAlQuraStatic['locale'].monthNamesShort];

export default umalqura;
