export const usePagination = (totalPages: number) => {
  const getVisiblePages = (currentPage: number) => {
    const visiblePages: (number | string)[] = [];
    if (totalPages <= 9) {
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      visiblePages.push(1);
      let start = Math.max(2, currentPage - 3);
      let end = Math.min(totalPages - 1, currentPage + 3);
      if (start > 2) visiblePages.push("...");
      for (let i = start; i <= end; i++) visiblePages.push(i);
      if (end < totalPages - 1) visiblePages.push("...");
      visiblePages.push(totalPages);
    }
    return visiblePages;
  };

  return { getVisiblePages };
};
