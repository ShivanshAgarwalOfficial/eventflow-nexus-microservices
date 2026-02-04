import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };

        const tokens = await this.getTokens(payload);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }

    async register(createUserDto: any) {
        const user = await this.usersService.create(createUserDto);
        return this.login(user);
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Access Denied');
        }

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };

        const tokens = await this.getTokens(payload);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string) {
        await this.usersService.removeRefreshToken(userId);
    }

    private async getTokens(payload: any) {
        const jwtSecret = this.configService.get<string>('JWT_SECRET') || 'default-secret';
        const jwtExpiration = '15m';
        const jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret';
        const jwtRefreshExpiration = '7d';

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: jwtExpiration,
            }),
            this.jwtService.signAsync(payload, {
                secret: jwtRefreshSecret,
                expiresIn: jwtRefreshExpiration,
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
