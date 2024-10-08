import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'password_resets' })
export class PasswordReset extends Model<PasswordReset> {
  @PrimaryKey
  @Column(DataType.STRING(100))
  email!: string;

  @Column(DataType.STRING(255))
  token!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}
