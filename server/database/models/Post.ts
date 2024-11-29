import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Default,
  AutoIncrement,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize/types';
import { User } from './User';
import { PostCategory } from './PostCategory';
import { Comment } from './Comment';
import { Like } from './Like';

@Table({ tableName: 'posts', timestamps: false })
export class Post extends Model<
  InferAttributes<Post>,
  InferCreationAttributes<Post>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  author_id!: number;

  @Column(DataType.STRING(255))
  title!: string;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.STRING(255))
  image_url?: string | null;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    field: 'publish_date',
  })
  publish_date!: CreationOptional<Date>;

  @Column(DataType.ENUM('active', 'inactive'))
  status!: 'active' | 'inactive';

  @BelongsTo(() => User)
  author?: User;

  @HasMany(() => PostCategory)
  postCategories?: PostCategory[];

  @HasMany(() => Comment)
  comments?: Comment[];

  @HasMany(() => Like)
  likes?: Like[];

  likes_count?: number;
  comments_count?: number;
}
