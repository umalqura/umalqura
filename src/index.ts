import UmAlQura from './UmAlQura';

function umalqura(): UmAlQura;
function umalqura(date: Date): UmAlQura;
function umalqura(hy: number, hm: number, hd: number): UmAlQura;
function umalqura(dateOrHy?: Date | number, hm?: number, hd?: number): UmAlQura {
    if (dateOrHy instanceof Date) {
        return new UmAlQura(dateOrHy);
    } else if (dateOrHy !== undefined && hm !== undefined && hd !== undefined) {
        return new UmAlQura(dateOrHy, hm, hd);
    } else {
        return new UmAlQura();
    }
}

umalqura.VERSION = "0.0.0-DEV_BUILD";

export default umalqura;
