import { Controller, Get, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: { hello: new Date() } }) as MessageEvent),
    );
  }
}
