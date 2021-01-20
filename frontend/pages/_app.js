import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'

import store from '../store'
import '../styles/global.css'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  )
}

export default MyApp
