import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Unique,
  Default,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize/types';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { UserSession } from './UserSession';
import { PasswordReset } from './PasswordReset';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  id!: CreationOptional<number>;

  @Unique
  @Column(DataType.STRING(50))
  login!: string;

  @Column(DataType.STRING(255))
  password!: string;

  @Column(DataType.STRING(100))
  full_name!: string;

  @Unique
  @Column(DataType.STRING(100))
  email!: string;

  @Column(DataType.STRING(255))
  profile_picture?: string;

  @Default(0)
  @Column(DataType.INTEGER)
  rating!: CreationOptional<number>;

  @Default('user')
  @Column(DataType.ENUM('user', 'admin'))
  role!: CreationOptional<'user' | 'admin'>;

  @Default(false)
  @Column(DataType.BOOLEAN)
  email_verified!: CreationOptional<boolean>;

  @Column(DataType.STRING)
  email_verification_token!: string | null;

  @Column(DataType.DATE)
  email_verification_expires_at!: CreationOptional<Date>;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: CreationOptional<Date>;

  @HasMany(() => Post)
  posts!: Post[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @HasMany(() => Like)
  likes!: Like[];

  @HasMany(() => UserSession)
  sessions!: UserSession[];

  @HasMany(() => PasswordReset)
  passwordResets!: PasswordReset[];
}
