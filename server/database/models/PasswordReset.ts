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

@Table({ tableName: 'password_resets', timestamps: false })
export class PasswordReset extends Model<PasswordReset> {
  @PrimaryKey
  @Column(DataType.STRING(100))
  email!: string;

  @Column(DataType.STRING(255))
  token!: string;

  @Column(DataType.DATE)
  expires_at!: Date | null;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE, field: 'created_at' })
  created_at!: Date;

  @ForeignKey(() => User)
  @Column
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}
