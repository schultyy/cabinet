export const getRepositoriesQuery = `query getRepos {
  viewer {
    repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes{
        name
        createdAt
      }
    }
  }
}`;