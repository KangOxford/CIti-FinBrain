export interface PagingInfo {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPage: number;
}

export const DEFAULT_PAGING_INFO  = {
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  totalPage: 1,
};
