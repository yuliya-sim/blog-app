
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle('API Documentation Blog')
        .setDescription('Backend documentation for blog app')
        .setVersion('1.0')
        .addTag('/', 'APIs related to root')
        .addTag('auth', 'APIs related to authentication')
        .addTag('users', 'APIs related to users')
        .addTag('blogs', 'APIs related to blogs')
        .addTag('posts', 'APIs related to posts')
        .addTag('comments', 'APIs related to comments')
        .addTag('schedule', 'APIs related to amortization-schedule')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}
