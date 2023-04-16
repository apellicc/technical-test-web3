import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import * as session from 'express-session';
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "./auth/auth.guard";

  
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet());

  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(
    session({
      secret: configService.get<string>("SESSION_SECRET_KEY"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
        secure: configService.get<string>("NODE_ENV") === 'production'
      }
    })
  )
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(8080);
}
bootstrap();
