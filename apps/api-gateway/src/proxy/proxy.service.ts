import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);
    private readonly userServiceUrl: string;
    private readonly eventServiceUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3001';
        this.eventServiceUrl = this.configService.get<string>('EVENT_SERVICE_URL') || 'http://localhost:3002';
    }

    async forwardToUserService(path: string, options: AxiosRequestConfig) {
        const url = `${this.userServiceUrl}${path}`;
        this.logger.log(`Forwarding to User Service: ${options.method} ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.request({
                    ...options,
                    url,
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Error forwarding to User Service: ${error.message}`);
            throw error;
        }
    }

    async forwardToEventService(path: string, options: AxiosRequestConfig) {
        const url = `${this.eventServiceUrl}${path}`;
        this.logger.log(`Forwarding to Event Service: ${options.method} ${url}`);

        try {
            const response = await firstValueFrom(
                this.httpService.request({
                    ...options,
                    url,
                }),
            );
            return response.data;
        } catch (error) {
            this.logger.error(`Error forwarding to Event Service: ${error.message}`);
            throw error;
        }
    }
}
