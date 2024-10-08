import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
} from 'sequelize-typescript';
import { Post } from './Post';
import { Category } from './Category';

@Table({ tableName: 'post_categories' })
export class PostCategory extends Model<PostCategory> {
  @ForeignKey(() => Post)
  @PrimaryKey
  @Column
  post_id!: number;

  @ForeignKey(() => Category)
  @PrimaryKey
  @Column
  category_id!: number;
}
