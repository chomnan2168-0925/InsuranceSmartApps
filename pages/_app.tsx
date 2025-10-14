// /pages/_app.tsx
import "@/styles/globals.css";
import "@/styles/article-content.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import SharedLayout from "@/components/SharedLayout";
import { CalculatorProvider } from "@/context/CalculatorContext";
import AdminLayout from "@/components/admin/AdminLayout";

// ✅ Add these type exports (they don't affect runtime behavior)
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Get the Measurement ID from your environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const isAdminPage = router.pathname.startsWith("/admin0925");
  const isDevAdminPage = router.pathname.startsWith("/dev-admin0925");
  const isAuthPage = router.pathname === "/login" || router.pathname === "/register";

  return (
    <>
      {/* Google Analytics Scripts */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {/* CalculatorProvider wraps everything to provide calculator context globally */}
      <CalculatorProvider>
        {/* Layout Logic */}
        {isAdminPage || isDevAdminPage ? (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <SharedLayout>
            <Component {...pageProps} />
          </SharedLayout>
        )}
      </CalculatorProvider>
    </>
  );
}
