import { validate } from './validation';

describe('validate', () => {
  it('prejde pre platné hodnoty', () => {
    expect(validate({ uuid: 'abc', batteryPercent: '85' })).toEqual({});
  });

  it('vyžaduje uuid', () => {
    expect(validate({ uuid: '  ', batteryPercent: '10' }).uuid).toBeDefined();
  });

  it('vyžaduje battery_percent', () => {
    expect(validate({ uuid: 'abc', batteryPercent: '' }).batteryPercent).toBeDefined();
  });

  it.each(['-1', '101', '1.5', 'abc'])('odmietne battery_percent %s', (value) => {
    expect(validate({ uuid: 'abc', batteryPercent: value }).batteryPercent).toBeDefined();
  });

  it.each(['0', '100'])('povolí hraničnú hodnotu %s', (value) => {
    expect(validate({ uuid: 'abc', batteryPercent: value })).toEqual({});
  });
});
