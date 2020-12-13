const units = <const> ['d' , 'h' , 'm' , 's', 'i']
const remUnits = <const> ['D', 'H', 'M', 'S', 'I']
export type Unit = typeof units[number];
export type RemUnit = typeof remUnits[number]

export interface FormatOptions {
  padStart?: {
    char: string;
    length: number;
  };
  leadingZero?: boolean;
}

const I = 1,
  S = I * 1000,
  M = S * 60,
  H = M * 60,
  D = H * 24;

const U: {[K in RemUnit]: number} = {I, S, M, H, D}

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

  units(value: number, unit: Unit): string {
    switch(unit) {
      case "d":
        return value === 1 ? 'day' : 'days'
      case "h":
        return value === 1 ? 'hour' : 'hours'
      case "m":
        return value === 1 ? 'minute' : 'minutes'
      case "s":
        return value === 1 ? 'second' : 'seconds'
      case "i":
        return value === 1 ? 'millisecond' : 'milliseconds'
    }
  }

  format(formatString: string, options: FormatOptions = {}) {
    let formattedString = formatString;

    const durationTokens = formatString.match(/{([dhmsi]o?)}/g) ?? []
    const remainingTokens = formatString.match(/{([DHMSI]o?)}/g) ?? []
    const remainingValues: {[K in RemUnit]: number} = {D:0, H:0, M:0, S:0, I:0}

    remUnits.reduce((remainingDuration, unit) => {
      if(remainingTokens.some(token => token.includes(unit))) {
        const value = Math.floor(remainingDuration / U[unit])
        remainingValues[unit] = value
        return remainingDuration - value * U[unit]
      }
      return remainingDuration
    }, this.value)

    formattedString = remainingTokens.reduce((str, token) => {
      const tag = token.slice(1, -1)
      const [unit, withUnits] = tag.split('')
      const value = remainingValues[unit as RemUnit]
      const formattedValue = Duration.applyFormatOptions(value, options)
      if(withUnits) {
        return str.replace(new RegExp(token, 'g'), `${formattedValue} ${this.units(value, unit.toLowerCase() as Unit)}`)
      } else {
        return str.replace(new RegExp(token, 'g'), formattedValue)
      }
    }, formattedString)

    formattedString = durationTokens.reduce((str, token) => {
      const tag = token.slice(1, -1)
      const [unit, withUnits] = tag.split('')
      const value = this.in(unit as Unit)
      const formattedValue = Duration.applyFormatOptions(value, options)
      if(withUnits) {
        return str.replace(new RegExp(token, 'g'), `${formattedValue} ${this.units(value, unit as Unit)}`)
      } else {
        return str.replace(new RegExp(token, 'g'), formattedValue)
      }
    }, formattedString)

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
      return string.padStart(padStart.length, padStart.char);
    }
    return string;
  }
}