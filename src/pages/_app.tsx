import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store/slices'
import GlobalStyle from '../style/GlobalStyle'

const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: relayStylePagination(['type', 'query']),
      },
    },
  },
})
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: { authorization: `Bearer ${token}` },
  cache,
})

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  )
}
export default MyApp
