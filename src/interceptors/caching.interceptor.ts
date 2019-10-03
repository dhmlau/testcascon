import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  inject,
  ValueOrPromise,
} from '@loopback/context';
import {CachingService} from '../services/caching.service';
import {CACHING_SERVICE} from '../keys';
import {RestBindings} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'caching'}})
export class CachingInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
        optional: true,
      });
      /* istanbul ignore if */
      if (!httpReq) {
        // Not http request
        return next();
      }
      const key = httpReq.path;
      const lang = httpReq.acceptsLanguages(['en', 'zh']) || 'en';
      const cachingKey = `${lang}:${key}`;
      const cachedResult = await this.cachingService.get(cachingKey);
      if (cachedResult) {
        console.error('Cache found for %s %j', cachingKey, cachedResult);
        return cachedResult;
      }

      const result = await next();

      // Add post-invocation logic here
      await this.cachingService.set(cachingKey, result);
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
