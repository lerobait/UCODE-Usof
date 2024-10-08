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
import { Category } from './Category';

@Table({ tableName: 'posts' })
export class Post extends Model<Post> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  author_id!: number;

  @Column(DataType.STRING(255))
  title!: string;

  @Column(DataType.TEXT)
  content!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  publish_date!: Date;

  @Column(DataType.ENUM('active', 'inactive'))
  status!: 'active' | 'inactive';

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id!: number;

  @BelongsTo(() => User)
  author!: User;

  @BelongsTo(() => Category)
  category!: Category;
}
