import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../store'
import GlobalStyle from '../style/GlobalStyle'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Component {...pageProps} />
    </Provider>
  )
}
export default MyApp
