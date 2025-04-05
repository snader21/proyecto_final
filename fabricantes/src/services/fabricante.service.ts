import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fabricante } from '../entities/fabricante.entity';
import { CreateFabricanteDto } from '../dto/create-fabricante.dto';
import { UpdateFabricanteDto } from '../dto/update-fabricante.dto';
import { Lugar } from '../entities/lugar.entity';
import { GetFabricanteDto } from '../dto/get-fabricante.dto';
@Injectable()
export class FabricanteService {
  constructor(
    @InjectRepository(Fabricante)
    private readonly fabricanteRepository: Repository<Fabricante>,
    @InjectRepository(Lugar)
    private readonly lugarRepository: Repository<Lugar>,
  ) {}

  async findAll(): Promise<GetFabricanteDto[]> {
    const fabricantes = await this.fabricanteRepository.find({
      relations: ['lugar', 'lugar.lugar_padre'],
    });

    const fabricantesDto: GetFabricanteDto[] = fabricantes.map(
      (fabricante) => ({
        id: fabricante.id,
        nombre: fabricante.nombre,
        correo: fabricante.correo,
        direccion: fabricante.direccion,
        estado: fabricante.estado,
        telefono: fabricante.telefono,
        ciudad_id: fabricante.lugar.id,
        ciudad_nombre: fabricante.lugar.nombre,
        pais_id: fabricante.lugar.lugar_padre.id,
        pais_nombre: fabricante.lugar.lugar_padre?.nombre,
      }),
    );

    return fabricantesDto;
  }

  async findOne(id: string): Promise<Fabricante> {
    const fabricante = await this.fabricanteRepository.findOne({
      where: { id },
    });
    if (!fabricante) {
      throw new NotFoundException(`Fabricante con ID ${id} no encontrado`);
    }
    return fabricante;
  }

  async create(createFabricanteDto: CreateFabricanteDto): Promise<Fabricante> {
    const existingFabricante = await this.fabricanteRepository.findOne({
      where: { nombre: createFabricanteDto.nombre },
    });

    if (existingFabricante) {
      throw new ConflictException('El fabricante ya está registrado');
    }

    const existingLugar = await this.lugarRepository.findOne({
      where: { id: createFabricanteDto.ciudad_id },
    });

    if (!existingLugar) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    const fabricante = this.fabricanteRepository.create(createFabricanteDto);
    return this.fabricanteRepository.save(fabricante);
  }

  async update(
    id: string,
    updateFabricanteDto: UpdateFabricanteDto,
  ): Promise<Fabricante> {
    const fabricante = await this.fabricanteRepository.findOne({
      where: { id },
    });

    if (!fabricante) {
      throw new NotFoundException('Fabricante no encontrado');
    }

    const updatedData = {
      ...updateFabricanteDto,
      lugar_id: updateFabricanteDto.ciudad_id,
    };

    const updatedFabricante = this.fabricanteRepository.merge(
      fabricante,
      updatedData,
    );

    return this.fabricanteRepository.save(updatedFabricante);
  }
}
