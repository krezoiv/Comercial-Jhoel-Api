import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AlertReadMarkRepository } from '../../domain/repositories/alert-read-mark.repository';
import { AlertReadMarkOrmEntity } from './alert-read-mark.orm-entity';

@Injectable()
export class TypeOrmAlertReadMarkRepository implements AlertReadMarkRepository {
  constructor(
    @InjectRepository(AlertReadMarkOrmEntity)
    private readonly repository: Repository<AlertReadMarkOrmEntity>,
  ) {}

  async findReadKeys(userId: string, keys: string[]): Promise<Set<string>> {
    if (keys.length === 0) {
      return new Set();
    }
    const rows = await this.repository.find({
      where: { userId, alertKey: In(keys) },
    });
    return new Set(rows.map((row) => row.alertKey));
  }

  async markRead(userId: string, key: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .values({ userId, alertKey: key })
      .orIgnore()
      .execute();
  }

  async markAllRead(userId: string, keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }
    await this.repository
      .createQueryBuilder()
      .insert()
      .values(keys.map((key) => ({ userId, alertKey: key })))
      .orIgnore()
      .execute();
  }
}
