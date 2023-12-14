import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" was not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    //metodo creado arriba se reusa
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      //new es para mandar el objeto nuevo
      await pokemon.updateOne(updatePokemonDto);

      //pokemon.toJson exparse todas las propiedades que tiene, luego se sobreescribe con el DTO
      return { ...pokemon.toJSON(), ...updatePokemonDto };

      /*
          const updatedPokemon = await pokemon.updateOne(updatePokemonDto, { new: true });
          return updatedPokemon;

          Retorna como respuesta:
           {
              "acknowledged": true,
              "modifiedCount": 0,
              "upsertedId": null,
              "upsertedCount": 0,
              "matchedCount": 1
            }
      */
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //Elimina por no, name y id, Nota: se debe eliminar el Pipe del controler
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    //const result = await this.pokemonModel.findByIdAndDelete(id);

    //deletedCount sale de enviar un ID ya eliminado con const return = ...
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" was not found`);
    }

    return;
  }

  //Excepcion no controlada, any para capturar cualquier error.
  private handleExceptions(error: any) {
    //Se aprovecha el mensaje de error y de consola para no consultar nuevamente la DB
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(error.keyValue)}`,
      );
    }

    //Si hay otro error
    throw new InternalServerErrorException(
      `Can not create Pokemon - Check server logs`,
    );
  }
}
