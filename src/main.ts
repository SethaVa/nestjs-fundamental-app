import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';

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
    const seedService = app.get(SeedService);
    await seedService.seed();
    const configService = app.get(ConfigService);
    await app.listen(configService.get<number>('port') ?? 3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => {
            void app.close();
        });
    }
}
bootstrap();
