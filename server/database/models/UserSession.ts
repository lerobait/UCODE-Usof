import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'user_sessions' })
export class UserSession extends Model<UserSession> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @Column(DataType.STRING(255))
  token!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @BelongsTo(() => User)
  user!: User;
}
