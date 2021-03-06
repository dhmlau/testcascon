import {bind, config} from '@loopback/context';
import {asGreeter, Greeter} from '@loopback/example-greeter-extension';

/**
 * Options for the French greeter
 */
export interface FrenchGreeterOptions {
  // Name first, default to `true`
  nameFirst: boolean;
}

/**
 * A greeter implementation for French.
 */
@bind(asGreeter)
export class FrenchGreeter implements Greeter {
  language = 'fr';

  constructor(
    /**
     * Inject the configuration for FrenchGreeter
     */
    @config()
    private options: FrenchGreeterOptions = {nameFirst: true},
  ) {}

  greet(name: string) {
    if (this.options && this.options.nameFirst === false) {
      return `Bonjour，${name}！`;
    }
    return `${name}, Bonjour`;
  }
}
