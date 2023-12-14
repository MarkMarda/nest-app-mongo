import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    //Para usar el configService en pokemon.service.ts
    //Viene de app.module.ts de la config de variables de entorno
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //sale de extend Document no del esquema
        schema: PokemonSchema,
      },
    ]),
  ],
  //Para poder inyectar los datos en el seed service
  exports: [MongooseModule],
})
export class PokemonModule {}
