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
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { UserSession } from './UserSession';
import { PasswordReset } from './PasswordReset';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

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
  rating!: number;

  @Default('user')
  @Column(DataType.ENUM('user', 'admin'))
  role!: 'user' | 'admin';

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

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
