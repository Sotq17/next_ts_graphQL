import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store/slices'
import GlobalStyle from '../style/GlobalStyle'

const token = process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Component {...pageProps} />
    </Provider>
  )
}
export default MyApp
