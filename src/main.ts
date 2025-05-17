import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare interface NodeModule {
    hot?: {
        accept: () => void;
        dispose: (callback: () => void) => void;
    };
}

declare const module: NodeModule;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    // configure the swagger
    const config = new DocumentBuilder()
        .setTitle('Spotify Clone')
        .setDescription('The Sportify clone api documentation')
        .setVersion('1.0')
        .addBearerAuth(
            // Enable Bearer Auth here
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth', // We will use this Bearer Auth with the JWT-auth name on the controller function
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    const seedService = app.get(SeedService);
    await seedService.seed();

    const configService = app.get(ConfigService);
    app.enableCors();
    await app.listen(configService.get<number>('port') ?? 3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => {
            void app.close();
        });
    }
}
bootstrap();
