import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Default,
} from 'sequelize-typescript';

import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize/types';

@Table({ tableName: 'categories', timestamps: false })
export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

  @Column(DataType.STRING(100))
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  created_at!: CreationOptional<Date>;
}
