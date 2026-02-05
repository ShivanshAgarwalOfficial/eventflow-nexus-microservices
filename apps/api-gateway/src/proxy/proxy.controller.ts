import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @All('api/users/*')
    async proxyUsers(@Req() req: Request, @Res() res: Response) {
        const path = req.url.replace('/api/users', '/users');
        const result = await this.proxyService.forwardToUserService(path, {
            method: req.method,
            headers: req.headers as any,
            data: req.body,
            params: req.query,
        });
        return res.json(result);
    }

    @All('api/auth/*')
    async proxyAuth(@Req() req: Request, @Res() res: Response) {
        const path = req.url.replace('/api', '');
        const result = await this.proxyService.forwardToUserService(path, {
            method: req.method,
            headers: req.headers as any,
            data: req.body,
            params: req.query,
        });
        return res.json(result);
    }

    @All('api/events/*')
    async proxyEvents(@Req() req: Request, @Res() res: Response) {
        const path = req.url.replace('/api/events', '/events');
        const result = await this.proxyService.forwardToEventService(path, {
            method: req.method,
            headers: req.headers as any,
            data: req.body,
            params: req.query,
        });
        return res.json(result);
    }
}
