type UnitOfDate = 'year' | 'month' | 'week' | 'day';
type UnitOfDateTime = UnitOfDate | 'hour' | 'minute' | 'second';
type UnitOfDateTimeMs = UnitOfDateTime | 'millisecond';

export { UnitOfDate, UnitOfDateTime, UnitOfDateTimeMs };
