import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export interface UseListProps {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
  }