export type Unit = 'd' | 'h' | 'm' | 's' | 'i';

export interface FormatOptions {
  padStart?: {
    char: string;
    count: number;
  };
  leadingZero?: boolean;
}

const I = 1,
  S = I * 1000,
  M = S * 60,
  H = M * 60,
  D = H * 24;

export class Duration {
  private value: number;

  constructor(value: number) {
    this.value = value;
  }

  static from(unit: Unit, value: number = 0) {
    value = Number(value);
    if (Number.isNaN(value)) {
      console.error(`Received invalid argument 'value' of ${value}`);
      throw new TypeError('Duration must be a valid number');
    }
    switch (unit) {
      case 'd':
        return new Duration(value * D);
      case 'h':
        return new Duration(value * H);
      case 'm':
        return new Duration(value * M);
      case 's':
        return new Duration(value * S);
      case 'i':
        return new Duration(value);
    }
  }

  static days(value: number) {
    return Duration.from('d', value);
  }

  static hours(value: number) {
    return Duration.from('h', value);
  }

  static minutes(value: number) {
    return Duration.from('m', value);
  }

  static seconds(value: number) {
    return Duration.from('s', value);
  }

  static milliseconds(value: number) {
    return Duration.from('i', value);
  }

  valueOf() {
    return this.value;
  }

  in(unit: Unit) {
    switch (unit) {
      case 'd':
        return Math.floor(this.value / D);
      case 'h':
        return Math.floor(this.value / H);
      case 'm':
        return Math.floor(this.value / M);
      case 's':
        return Math.floor(this.value / S);
      case 'i':
        return Math.floor(this.value);
    }
  }

  days() {
    return this.in('d');
  }

  hours() {
    return this.in('h');
  }

  minutes() {
    return this.in('m');
  }

  seconds() {
    return this.in('s');
  }

  milliseconds() {
    return this.in('i');
  }

  format(formatString: string, options: FormatOptions = {}) {
    let formattedString = formatString;
    let remainingDuration = this.value;

    if (formatString.includes('d')) {
      const days = Math.floor(remainingDuration / D);
      remainingDuration = remainingDuration - days * D;
      const str = Duration.applyFormatOptions(days, options);
      formattedString = formattedString.replace(/d/, str);
    }

    if (formatString.includes('h')) {
      const hours = Math.floor(remainingDuration / H);
      remainingDuration = remainingDuration - hours * H;
      const str = Duration.applyFormatOptions(hours, options);
      formattedString = formattedString.replace(/h/, str);
    }

    if (formatString.includes('m')) {
      const minutes = Math.floor(remainingDuration / M);
      remainingDuration = remainingDuration - minutes * M;
      const str = Duration.applyFormatOptions(minutes, options);
      formattedString = formattedString.replace(/m/, str);
    }

    if (formatString.includes('s')) {
      const seconds = Math.floor(remainingDuration / S);
      remainingDuration = remainingDuration - seconds * S;
      const str = Duration.applyFormatOptions(seconds, options);
      formattedString = formattedString.replace(/s/, str);
    }

    if (formatString.includes('i')) {
      const milliseconds = Math.floor(remainingDuration / I);
      const str = Duration.applyFormatOptions(milliseconds, options);
      formattedString = formattedString.replace(/i/, str);
    }

    return formattedString;
  }

  private static applyFormatOptions(
    value: number,
    options: FormatOptions = {}
  ) {
    const string = String(value);
    const { padStart } = options;
    if (options.leadingZero) {
      return string.padStart(2, '0');
    }
    if (padStart) {
      return string.padStart(padStart.count, padStart.char);
    }
    return string;
  }
}
