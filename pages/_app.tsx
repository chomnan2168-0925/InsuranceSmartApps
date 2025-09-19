import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import SharedLayout from '@/components/SharedLayout'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  if (isAuthPage) {
    return <Component {...pageProps} />;
  }

  return (
    <SharedLayout>
      <Component {...pageProps} />
    </SharedLayout>
  )
}
