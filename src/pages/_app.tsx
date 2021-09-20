import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import type { AppProps } from 'next/app'

const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: { authorization: `Bearer ${token}` },
  cache: new InMemoryCache(),
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
export default MyApp
