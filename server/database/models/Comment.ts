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
  InferCreationAttributes<Comment, { omit: 'author' | 'post' | 'replies' }>
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

  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  parent_id!: number | null;

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

  @BelongsTo(() => Comment, { foreignKey: 'parent_id' })
  parent?: Comment;

  @HasMany(() => Comment, { foreignKey: 'parent_id' })
  replies?: Comment[];

  @HasMany(() => Like)
  likes?: Like[];

  likes_count?: number;

  @Column(DataType.VIRTUAL)
  replies_count?: number;
}
