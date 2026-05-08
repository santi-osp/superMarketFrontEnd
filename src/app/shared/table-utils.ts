import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export const FRONTEND_PAGE_LIMIT = 500;

export function setPagedData<T>(
  dataSource: MatTableDataSource<T>,
  rows: T[],
  paginator?: MatPaginator,
): void {
  dataSource.data = rows;

  if (!paginator) return;

  const maxPageIndex = Math.max(Math.ceil(rows.length / paginator.pageSize) - 1, 0);
  if (paginator.pageIndex > maxPageIndex) {
    paginator.pageIndex = maxPageIndex;
  }

  dataSource.paginator = paginator;
}
