import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validationSchema';

@Module({
  imports: [
    //Entorno virtual para hcerlos visibles, siempre al inicio,
    //las ejecuta, valida, procesa
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      //puede trabajar en conjunto con el load
      validationSchema: JoiValidationSchema,
    }),

    //Para servir el html
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    //URI de MongoDB, se hace en variable de entorno
    MongooseModule.forRoot(process.env.MONGO_DB),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {
  //Para poder ver todas las variables
  // constructor() {
  //   console.log(process.env);
  // }
}
