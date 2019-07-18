# umalqura

Zero dependency Hijri calendar based on Um AlQura

[![npm package](https://img.shields.io/npm/v/@umalqura/core.svg)](https://www.npmjs.org/package/@umalqura/core)
[![travis](https://travis-ci.com/umalqura/umalqura.svg?branch=master)](https://travis-ci.com/umalqura/umalqura)
[![Coverage Status](https://coveralls.io/repos/github/umalqura/umalqura/badge.svg?branch=master)](https://coveralls.io/github/umalqura/umalqura?branch=master)

### Getting Started

Run the following `npm` or `yran` command:

```sh
npm i @umalqura/core
-or-
yarn add @umalqura/core
```

You can also use the library directly in the browser by adding the following to your html:

```html
<script src="https://unpkg.com/@umalqura/core@0.0.7/dist/umalqura.min.js"></script>
```

### Usage

#### NodeJS

```js
import uq from '@umalqura/core';

// Initializes a new umalqura instance using current date and time.
const now = uq();
// Do more stuff
// ...
```
#### Browser

A global var named `umalqura` will be available.

```js
// Initializes a new umalqura instance using current date and time.
var now = umalqura();
// Do more stuff
// ...
```

### API

##### Construction

```ts
// Initializes using current date and time.
umalqura();
// Initializes using provided date and time.
umalqura(date: Date);
// Initializes using provided Hijri year, month, day and the optionally provided time.
umalqura(hy: number, hm: number, hd: number, hour?: number, minute?: number, second?: number, millisecond?: number);
```

The `umalqura(...)` function returns an initialized `umalqura.UmAlQura` object which exposes the following properties and methods:

##### Properties

| Name          | Description                                                     |
|---------------|-----------------------------------------------------------------|
| `date`        | Returns the Date object.                                        |
| `hy`          | Returns the Hijri year.                                         |
| `hm`          | Returns the Hijri month.                                        |
| `hd`          | Returns the Hijri day of month.                                 |
| `dayOfYear`   | Returns the Hijri day of year.                                  |
| `dayOfWeek`   | Returns the day of week.                                        |
| `weekOfYear`  | Returns the Hijri week of year.                                 |
| `daysInYear`  | Returns the number of days in current Hijri year.               |
| `daysInMonth` | Returns the number of days in current Hijri month and year.     |
| `isLeapYear`  | Returns true if leap year, false otherwise.                     |
| `monthArray`  | Returns the dates of month arranged in a 2D array.              |

Examples:

```js
import uq from '@umalqura/core';

const d = uq(new Date(2019, 6, 3));  // July 3rd 2019
console.log(d.hy, d.hm, d.hd);       // Outputs 1440, 10, 30

// -or

const d = uq(1440, 10, 30);
console.log(d.date);                 // Outputs Wed Jul 03 2019 00:00:00 TZ...
```

##### Methods

Note that all methods are immutably.

| Name             | Arguments                              | Description
|------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------|
| `add`            | `v:number`<br/>`u:unitMs`              | Returns a new `UmAlQura` object adding the specified number of Hijri units to the current instance. |
| `subtract`       | `v:number`<br/>`u:unitMs`              | Returns a new `UmAlQura` object subtracting the specified number of Hijri units to the current instance. |
| `startOf`        | `u:unit`                               | Returns a new `UmAlQura` object starting at the specified Hijri unit of time. |
| `endOf`          | `u:unit`                               | Returns a new `UmAlQura` object ending at the specified Hijri unit of time. |
| `isBefore`       | `cmp:UmAlQura\|Date`<br/>`unit?:unitMs` | Returns whether current instance is before `cmp`. Check can be pinned down to `unitMs` which defaults to milliseconds. |
| `isAfter`        | `cmp:UmAlQura\|Date`<br/>`unit?:unitMs` | Returns whether current instance is after `cmp`. Check can be pinned down to `unitMs` which defaults to milliseconds. |
| `isSame`         | `cmp:UmAlQura\|Date`<br/>`unit?:unitMs` | Returns whether current instance is same as `cmp`. Check can be pinned down to `unitMs` which defaults to milliseconds. |
| `isSameOrBefore` | `cmp:UmAlQura\|Date`<br/>`unit?:unitMs` | Returns whether current instance is same as or before `cmp`. Check can be pinned down to `unitMs` which defaults to milliseconds. |
| `isSameOrAfter`  | `cmp:UmAlQura\|Date`<br/>`unit?:unitMs` | Returns whether current instance is same as or after `cmp`. Check can be pinned down to `unitMs` which defaults to milliseconds. |
| `isBetween`      | `from:UmAlQura\|Date`<br/>`to:UmAlQura\|Date`<br/>`fromIncl?:boolean`<br/>`toIncl?:boolean`<br/>`unit?:unitMs` | Returns whether current instance is between `from` and `to`. Check can be pinned down to `unitMs` which defaults to milliseconds. By, default the match is exclusive of both ends. This can be controlled via `fromIncl` and `toIncl`. |
| `format`         | `mask:string`<br/>`locale?:string`     | Returns a formatted string of the Hijri date and time using the specified `mask` and optionally a `locale`. |

`unitMs` can be any of the following strings: `year, month, week, day, hour, minute, second, millisecond`.

`unit` can be any of the following string: `year, month, week, day, hour, minute, second`.

Examples:

```js
import uq from '@umalqura/core';

const d = uq(new Date(2019, 6, 3));
// Add 5 Hijri months
const after5HijriMonths = d.add(5, 'month');

// ٣٠/١٠/١٤٤٠
d.format('dd/MM/yyyy', 'ar');
// 30/03/1441
after5HijriMonths.format('dd/MM/yyyy');
// True
after5HijriMonths.isAfter(d);
// Shawwāl 1, 1440
d.startOf('month').format('longDate');

const endOf1440H = d.endOf('year');
// الجمعة، ٢٩ ذو الحجة، ١٤٤٠
endOf1440H.format('fullDate', 'ar');
// Fri Aug 30 2019 23:59:59 TZ...
endOf1440H.date;
```

The following properties and functions exist directly on the export `umalqura` object:

| Name                        | Description
|-----------------------------|----------------------------------------------------------------------------------------------
| `VERSION`                   | Returns the library version.
| `$`                         | Gives access to static methods.
| `min`                       | Returns the minimum supported Hijri date.
| `max`                       | Returns the maximum supported Hijri date.
| `locale(locale?: string)`   | Gets or sets the local to be used globally.
| `rtl()`                     | Returns whether current locale supports RTL.
| `times()`                   | Returns the times names array according to currently set global locale.
| `days()`                    | Returns the days names array according to currently set global locale.
| `daysShort()`               | Returns the short days names array according to currently set global locale.
| `months()`                  | Returns the Hijri months names array according to currently set global locale.
| `monthsShort()`             | Returns the short Hijri month names array according to currently set global locale.
| `localizeNum(n: number)`    | Returns a localized string representing the specified number according to currently set global locale.

Examples:

```js
import uq from '@umalqura/core';

// Set global locale to Arabic so that we no longer need to specify a locale when calling format() function.
uq.locale('ar');
// Returns true
uq.rtl();
// Returns ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة']
uq.months();
```

##### Pre-defined Formatting Masks

| Name         | Format                                                                      |
|--------------|-----------------------------------------------------------------------------|
| `default`    | `ddd dd MMM yyyy HH:mm:ss` for `ar`<br/>`ddd MMM dd yyyy HH:mm:ss` for `en` |
| `shortDate`  | `yy/M/d` for `ar`<br/>`M/d/yy` for `en`                                     |
| `mediumDate` | `d MMM, yyyy` for `ar`<br/>`MMM d, yyyy` for `en`                           |
| `longDate`   | `d MMMM, yyyy` for `ar`<br/>`MMMM d, yyyy` for `en`                         |
| `fullDate`   | `dddd, d MMMM, yyyy` for `ar`<br/>`dddd, MMMM d, yyyy` for `en`             |
| `shortTime`  | `h:mm TT`                                                                   |
| `mediumTime` | `h:mm:ss TT`                                                                |
| `longTime`   | `h:mm:ss.l TT`                                                              |


### Sample

An HTML-based sample is available in `./sample/browser.html` locally or online @ https://umalqura.github.io/.
