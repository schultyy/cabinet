export const getRepositoriesQuery = `query getRepos {
  viewer {
    repositories(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes{
        id
        name
        createdAt
      }
    }
  }
}`;

export const getIssuesForRepositoryQuery = (repository) => {
  return `query GetIssues {
    viewer {
      repository(name: "${repository}") {
        issues(first: 100) {
          nodes {
            id,
            number,
            title,
            body,
            state,
            milestone {
              number,
              title,
              state
            }
            assignees(first: 10){
              nodes{
                login,
                avatarUrl
              }
            },
            labels(first: 20) {
              nodes {
                color
                id
                name
              }
            }
          }
        }
      }
    }
  }`;
};