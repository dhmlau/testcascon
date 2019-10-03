// Uncomment these imports to begin using these cool features!

import {param, get, Request, RestBindings} from '@loopback/rest';
import {Message} from '../types';
import {inject} from '@loopback/context';
// Import from the beginning but bind a simple function as service
import {
  GreetingService,
  GREETING_SERVICE,
} from '@loopback/example-greeter-extension';

export class GreetingController {
  constructor(
    @inject(GREETING_SERVICE) private greetingService: GreetingService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  @get('/greet/{name}', {
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                timestamp: 'string',
                language: 'string',
                message: 'string',
              },
            },
          },
        },
      },
    },
  })
  async greet(
    @param.path.string('name') name: string,
    @param.header.string('language') lang: string,
  ): Promise<Message> {
    const language: string = ['en', 'zh', 'fr'].includes(lang) ? lang : 'en';

    // const language: string = lang(['en', 'zh', 'fr']) || 'en';
    // const language: string =
    //   this.request.acceptsLanguages(['en', 'zh', 'fr']) || 'en';
    const greeting = await this.greetingService.greet(language, name);
    return {
      timestamp: new Date(),
      language,
      greeting,
    };
  }
}
