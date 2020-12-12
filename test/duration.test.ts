import { Duration } from '../src';

const N = 2;
describe('instantiation', () => {
  test('Duration.hours', () => {
    const duration = Duration.hours(N);
    expect(duration).toEqual(Duration.from('h', N));
    expect(duration.valueOf()).toBe(N * 60 * 60 * 1000);
  });
  test('Duration.minutes', () => {
    const duration = Duration.minutes(N);
    expect(duration).toEqual(Duration.from('m', N));
    expect(duration.valueOf()).toBe(N * 60 * 1000);
  });
  test('Duration.seconds', () => {
    const duration = Duration.seconds(N);
    expect(duration).toEqual(Duration.from('s', N));
    expect(duration.valueOf()).toBe(N * 1000);
  });
  test('Duration.milliseconds', () => {
    const duration = Duration.milliseconds(N);
    expect(duration).toEqual(Duration.from('i', N));
    expect(duration.valueOf()).toBe(N);
  });
});

describe('access', () => {
  test('duration.hours', () => {
    const duration = Duration.hours(N);
    expect(duration.in('h')).toBe(N);
    expect(duration.hours()).toBe(N);
  });
  test('duration.minutes', () => {
    const duration = Duration.minutes(N);
    expect(duration.in('m')).toBe(N);
    expect(duration.minutes()).toBe(N);
  });
  test('duration.seconds', () => {
    const duration = Duration.seconds(N);
    expect(duration.in('s')).toBe(N);
    expect(duration.seconds()).toBe(N);
  });
  test('duration.milliseconds', () => {
    const duration = Duration.milliseconds(N);
    expect(duration.in('i')).toBe(N);
    expect(duration.milliseconds()).toBe(N);
  });
});

describe('formatString', () => {
  test('single units', () => {
    const duration = Duration.hours(2);
    expect(duration.format('h')).toBe('2');
    expect(duration.format('m')).toBe('120');
    expect(duration.format('s')).toBe('7200');
    expect(duration.format('i')).toBe('7200000');
  });
  test('mixed units', () => {
    const duration = Duration.hours(2.5373);
    expect(duration.format('h')).toBe('2');
    expect(duration.format('h m')).toBe('2 32');
    expect(duration.format('h m s')).toBe('2 32 14');
    expect(duration.format('h m s i')).toBe('2 32 14 280');
  });
  test('reversed mixed units', () => {
    const duration = Duration.hours(2.5373);
    expect(duration.format('h')).toBe('2');
    expect(duration.format('m h')).toBe('32 2');
    expect(duration.format('s m h')).toBe('14 32 2');
    expect(duration.format('i s m h')).toBe('280 14 32 2');
  });
  test('wierd mixed units', () => {
    const duration = Duration.hours(2.5373);
    expect(duration.format('h h')).toBe('2 h');
    expect(duration.format('m h m')).toBe('32 2 m');
    expect(duration.format('s s s h')).toBe('1934 s s 2');
  });
  test('with other chars', () => {
    const duration = Duration.hours(2.5373);
    expect(duration.format('h:m')).toBe('2:32');
  });
  test('with leading 0', () => {
    const duration = Duration.hours(2.03);
    expect(duration.format('h:m', { leadingZero: true })).toBe('02:01');
  });
});
