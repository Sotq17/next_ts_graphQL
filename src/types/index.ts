export type Issue = {
  node: {
    id: string
    title: string
    url: string
  }
}

export type Repository = {
  id: string
  name: string
  url: string
  stargazers: { totalCount: number }
  viewerHasStarred: boolean
  issues?: { edges: Issue[] }
}
