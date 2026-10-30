
import { infiniteQueryOptions } from "@tanstack/react-query";
import type { DashboardRepo } from "@/features/dashboard/lib/types";

export type GithubReposPage = {
  repos: DashboardRepo[];
  totalCount: number;
  page: number;
  hasMore: boolean;
};

export const githubRepoKeys = {
  all: ["github", "repos"] as const,
};

export const githubReposInfiniteQuery = infiniteQueryOptions({
  queryKey: [...githubRepoKeys.all, "list"],
  initialPageParam: 1,

  queryFn: async ({ pageParam }): Promise<GithubReposPage> => {
    const response = await fetch(
      `/api/github/repos?page=${pageParam}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Repository request failed (${response.status}): ${body}`,
      );
    }

    return (await response.json()) as GithubReposPage;
  },

  getNextPageParam: (lastPage) =>
    lastPage.hasMore ? lastPage.page + 1 : undefined,

  staleTime: 0,
});
