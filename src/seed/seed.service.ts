import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  //Crea visualmente que hay una dependencia en el servicio
  //private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    //DATA no se desestrutura porque se hizo en el axios.adapter
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=100',
    );

    //const insertPromisesArray = [];
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      //para insertar los pokemons, viene del pokemonService:

      //const pokemon = await this.pokemonModel.create({ name, no }); //cap94

      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no }),
      // );

      pokemonToInsert.push({ name, no });
    });

    //await Promise.all(insertPromisesArray);

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}
