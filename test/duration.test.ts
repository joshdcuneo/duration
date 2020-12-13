import { Duration } from '../src';

const N = 2;
describe('instantiation', () => {
  test('Duration.days', () => {
    const duration = Duration.days(N);
    expect(duration).toEqual(Duration.from('d', N));
    expect(duration.valueOf()).toBe(N * 24 * 60 * 60 * 1000);
  });
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
  test('duration.days', () => {
    const duration = Duration.days(N);
    expect(duration.in('d')).toBe(N);
    expect(duration.days()).toBe(N);
  });
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
  test('single duration units', () => {
    const duration = Duration.days(2);
    expect(duration.format('{d}')).toBe(String(2));
    expect(duration.format('{h}')).toBe(String(2 * 24));
    expect(duration.format('{m}')).toBe(String(2 * 24 * 60));
    expect(duration.format('{s}')).toBe(String(2 * 24 * 60 * 60));
    expect(duration.format('{i}')).toBe(String(2 * 24 * 60 * 60 * 1000));
  });

  test('single remaining units', () => {
    const duration = Duration.days(2);
    expect(duration.format('{D}')).toBe(String(2));
    expect(duration.format('{H}')).toBe(String(2 * 24));
    expect(duration.format('{M}')).toBe(String(2 * 24 * 60));
    expect(duration.format('{S}')).toBe(String(2 * 24 * 60 * 60));
    expect(duration.format('{I}')).toBe(String(2 * 24 * 60 * 60 * 1000));
  });

  test('mixed remaining units', () => {
    const duration = Duration.days(2.5373);
    expect(duration.format('{D}')).toBe('2');
    expect(duration.format('{D} {H}')).toBe('2 12');
    expect(duration.format('{D} {H} {M}')).toBe('2 12 53');
    expect(duration.format('{D} {H} {M} {S}')).toBe('2 12 53 42');
    expect(duration.format('{D} {H} {M} {S} {I}')).toBe('2 12 53 42 720');
  });

  test('reversed remaining units', () => {
    const duration = Duration.days(2.5373);
    expect(duration.format('{I} {S} {M} {H} {D}')).toBe('720 42 53 12 2');
  });

  test('wierd mixed units', () => {
    const duration = Duration.hours(2.5373);
    expect(duration.format('{H} hours')).toBe('2 hours');
    expect(duration.format('{M} {m}')).toBe('152 152');
    expect(duration.format('{M} {s} {M} {H}')).toBe('32 9134 32 2');
  });

  test('with leading 0', () => {
    const duration = Duration.hours(2.03);
    expect(duration.format('{H}:{M}', { leadingZero: true })).toBe('02:01');
  });

  test('single remaining units with unit string', () => {
    const duration = Duration.days(2);
    expect(duration.format('{Do}')).toBe("2 days");
    expect(duration.format('{Ho}')).toBe("48 hours");
    expect(duration.format('{Mo}')).toBe("2880 minutes");
    expect(duration.format('{So}')).toBe("172800 seconds");
    expect(duration.format('{Io}')).toBe("172800000 milliseconds");
  });

  test('timer', () => {
    const duration = Duration.days(2.34)
    expect(duration.format("{H}:{M}:{S}", {leadingZero: true})).toBe("56:09:36")
  })

  test('padStart', () => {
    const duration = Duration.days(2.34)
    expect(duration.format("{H}:{M}:{S}", {padStart: {char: "X", length: 3}})).toBe("X56:XX9:X36")
  })

  test('single unit formatting', () => {
    expect(Duration.days(1).format("{do}")).toBe("1 day")
    expect(Duration.hours(1).format("{ho}")).toBe("1 hour")
    expect(Duration.minutes(1).format("{mo}")).toBe("1 minute")
    expect(Duration.seconds(1).format("{so}")).toBe("1 second")
    expect(Duration.milliseconds(1).format("{io}")).toBe("1 millisecond")
  })
});
