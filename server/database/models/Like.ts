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
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize/types';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';

@Table({ tableName: 'likes', timestamps: false })
export class Like extends Model<
  InferAttributes<Like>,
  InferCreationAttributes<Like>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  author_id!: number;

  @ForeignKey(() => Post)
  @Column
  post_id!: number;

  @ForeignKey(() => Comment)
  @Column
  comment_id?: number;

  @Column(DataType.ENUM('like', 'dislike'))
  type!: 'like' | 'dislike';

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'publish_date',
  })
  publish_date!: CreationOptional<Date>;

  @BelongsTo(() => User)
  author?: User;

  @BelongsTo(() => Post)
  post?: Post;

  @BelongsTo(() => Comment)
  comment?: Comment;
}
