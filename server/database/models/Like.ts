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
import { Post } from './Post';
import { Comment } from './Comment';

@Table({ tableName: 'likes' })
export class Like extends Model<Like> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => User)
  @Column
  author_id!: number;

  @ForeignKey(() => Post)
  @Column
  post_id!: number;

  @ForeignKey(() => Comment)
  @Column
  comment_id!: number;

  @Column(DataType.ENUM('like', 'dislike'))
  type!: 'like' | 'dislike';

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  publish_date!: Date;

  @BelongsTo(() => User)
  author!: User;

  @BelongsTo(() => Post)
  post!: Post;

  @BelongsTo(() => Comment)
  comment!: Comment;
}
