import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
            driver: ApolloGatewayDriver,
            useFactory: async (configService: ConfigService) => ({
                gateway: {
                    supergraphSdl: new IntrospectAndCompose({
                        subgraphs: [
                            {
                                name: 'users',
                                url: configService.get<string>('USER_GRAPHQL_URL') || 'http://localhost:3001/graphql',
                            },
                            {
                                name: 'events',
                                url: configService.get<string>('EVENT_GRAPHQL_URL') || 'http://localhost:3002/graphql',
                            },
                        ],
                    }),
                },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class GatewayGraphQLModule { }
