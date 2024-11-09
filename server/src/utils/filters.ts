import sequelize from '../../database/db';
import { ParsedQs } from 'qs';

interface Filters {
  status?: 'active' | 'inactive';
  sortBy?: 'likes' | 'date';
  order?: 'ASC' | 'DESC';
}

type OrderItem =
  | [string, 'ASC' | 'DESC']
  | [ReturnType<typeof sequelize.fn>, 'ASC' | 'DESC'];

export const applyFilters = (filters: Filters) => {
  const whereClause: { status?: 'active' | 'inactive' } = {};
  const orderClause: OrderItem[] = [];

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.sortBy === 'likes') {
    orderClause.push([
      sequelize.literal(`(
        SELECT COUNT(*) 
        FROM likes 
        WHERE likes.post_id = Post.id AND likes.type = 'like'
      )`) as unknown as string,
      filters.order || 'DESC',
    ] as OrderItem);
  } else if (filters.sortBy === 'date') {
    orderClause.push(['publish_date', filters.order || 'DESC'] as OrderItem);
  }

  return { whereClause, orderClause };
};

export function getStringQueryParam(
  param: string | ParsedQs | string[] | ParsedQs[] | undefined,
): string | undefined {
  if (Array.isArray(param)) {
    return typeof param[0] === 'string' ? param[0] : undefined;
  }
  return typeof param === 'string' ? param : undefined;
}
