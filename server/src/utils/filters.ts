import sequelize from '../../database/db';
import { ParsedQs } from 'qs';

interface Filters {
  status?: 'active' | 'inactive';
  sortBy?: 'likes' | 'date';
  order?: 'ASC' | 'DESC';
}

export const applyFilters = (filters: Filters) => {
  const whereClause: { status?: 'active' | 'inactive' } = {};
  const orderClause: any[] = [];

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.sortBy === 'likes') {
    orderClause.push([
      sequelize.fn('COUNT', sequelize.col('likes.id')),
      filters.order || 'DESC',
    ]);
  } else if (filters.sortBy === 'date') {
    orderClause.push(['publish_date', filters.order || 'DESC']);
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
