import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import type { AppProps } from 'next/app'
import GlobalStyle from '../style/GlobalStyle'

const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: { authorization: `Bearer ${token}` },
  cache: new InMemoryCache(),
})

// TODO:
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
export default MyApp
