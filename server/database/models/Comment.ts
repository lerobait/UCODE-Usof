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

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment> {
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

  @Column(DataType.TEXT)
  content!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  publish_date!: Date;

  @Default('active')
  @Column(DataType.ENUM('active', 'inactive'))
  status!: 'active' | 'inactive';

  @BelongsTo(() => User)
  author!: User;

  @BelongsTo(() => Post)
  post!: Post;
}
