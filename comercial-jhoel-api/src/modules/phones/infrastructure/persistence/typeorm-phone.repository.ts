import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Phone } from '../../domain/entities/phone.entity';
import {
  CreatePhoneData,
  PhoneRepository,
} from '../../domain/repositories/phone.repository';
import { ImeiAlreadyExistsError } from '../../domain/errors/imei-already-exists.error';
import { PhoneNumberAlreadyExistsError } from '../../domain/errors/phone-number-already-exists.error';
import { PhoneOrmEntity } from './phone.orm-entity';
import { PhoneMapper } from './phone.mapper';

@Injectable()
export class TypeOrmPhoneRepository implements PhoneRepository {
  constructor(
    @InjectRepository(PhoneOrmEntity)
    private readonly repository: Repository<PhoneOrmEntity>,
  ) {}

  async findAll(): Promise<Phone[]> {
    const orms = await this.repository.find({
      order: { purchaseDate: 'DESC', createdAt: 'DESC' },
    });
    return orms.map((orm) => PhoneMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Phone | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? PhoneMapper.toDomain(orm) : null;
  }

  async findByImei(imei: string): Promise<Phone | null> {
    const orm = await this.repository.findOne({ where: { imei } });
    return orm ? PhoneMapper.toDomain(orm) : null;
  }

  async findAvailableByPhoneNumber(phoneNumber: string): Promise<Phone | null> {
    const orm = await this.repository.findOne({
      where: { phoneNumber, status: 'DISPONIBLE' },
    });
    return orm ? PhoneMapper.toDomain(orm) : null;
  }

  async create(data: CreatePhoneData): Promise<Phone> {
    const orm = this.repository.create(data);
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return PhoneMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data);
    }
  }

  /** Safety net for the create-time race the use case's own pre-check can't close — same pattern as `TypeOrmSupplierRepository.translateUniqueViolation`. */
  private translateUniqueViolation(
    error: unknown,
    data: CreatePhoneData,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_phones_imei') {
        return new ImeiAlreadyExistsError(data.imei);
      }
      if (constraint === 'UQ_phones_phone_number_available') {
        return new PhoneNumberAlreadyExistsError(data.phoneNumber);
      }
    }
    return error;
  }
}
