import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'categories' })
export class Category extends Model<Category> {
  @PrimaryKey
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING(100))
  title!: string;

  @Column(DataType.TEXT)
  description!: string;
}
