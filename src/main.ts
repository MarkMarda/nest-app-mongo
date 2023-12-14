import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Para versionamiento del api
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      //tranformar los Dto en el tipo de dato que esperamos, pro: mas facil de validar la data porque viene como se desea
      //contra: si va informacion se procesa y genera la instancia lo que consume mas memoria
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT);
  console.log(`app runnning on port ${process.env.PORT}`);
}
bootstrap();

//En main no se puede hacer inyeccion de dependencias
