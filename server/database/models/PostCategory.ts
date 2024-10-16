import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { CreationOptional } from 'sequelize/types';
import { Post } from './Post';
import { Category } from './Category';

interface PostCategoryCreationAttributes {
  post_id: number;
  category_id: number;
}

@Table({ tableName: 'post_categories', timestamps: false })
export class PostCategory extends Model<
  PostCategory,
  PostCategoryCreationAttributes
> {
  @ForeignKey(() => Post)
  @PrimaryKey
  @Column
  post_id!: number;

  @ForeignKey(() => Category)
  @PrimaryKey
  @Column
  category_id!: number;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: CreationOptional<Date>;

  @BelongsTo(() => Category)
  category?: Category;
}
