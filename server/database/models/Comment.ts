import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  DataType,
  BelongsTo,
  HasMany,
  Default,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize/types';
import { User } from './User';
import { Post } from './Post';
import { Like } from './Like';

@Table({ tableName: 'comments', timestamps: false })
export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment, { omit: 'author' | 'post' }>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  author_id!: number;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  post_id!: number;

  @Column(DataType.TEXT)
  content!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'publish_date',
  })
  publish_date!: CreationOptional<Date>;

  @Default('active')
  @Column(DataType.ENUM('active', 'inactive'))
  status!: 'active' | 'inactive';

  @BelongsTo(() => User)
  author?: User;

  @BelongsTo(() => Post)
  post?: Post;

  @HasMany(() => Like)
  likes?: Like[];

  likes_count?: number;
}
