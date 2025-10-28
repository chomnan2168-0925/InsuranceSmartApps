// /pages/_app.tsx - ANALYSIS
// ✅ YOUR CODE IS EXCELLENT! Everything is properly configured.

import "@/styles/globals.css";
import "@/styles/article-content.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Script from "next/script";
import SharedLayout from "@/components/SharedLayout";
import { CalculatorProvider } from "@/context/CalculatorContext";
import AdminLayout from "@/components/admin/AdminLayout";
import CookieConsent from "@/components/CookieConsent";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// ✅ CORRECT: Reads from environment variable
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [cookieSettings, setCookieSettings] = useState({
    enabled: true,
    excludePaths: [] as string[],
    style: 'corner' as 'corner' | 'minimal',
    position: 'bottom-right' as 'bottom-left' | 'bottom-right',
  });

  const isAdminPage = router.pathname.startsWith("/admin0925");
  const isDevAdminPage = router.pathname.startsWith("/dev-admin0925");
  const isAuthPage = router.pathname === "/login" || router.pathname === "/register";

  // ✅ EXCELLENT: Dynamic cookie settings from CMS
  useEffect(() => {
    const fetchCookieSettings = async () => {
      try {
        const res = await fetch('/api/settings/cookie-banner');
        if (res.ok) {
          const data = await res.json();
          setCookieSettings(data);
        }
      } catch (error) {
        console.log('Cookie settings not found, using defaults');
      }
    };
    fetchCookieSettings();
  }, []);

  return (
    <>
      {/* ✅ EXCELLENT: Google Consent Mode (GDPR compliant) */}
      {/* Loads BEFORE analytics - proper implementation */}
      <Script id="google-consent-mode" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Default consent to 'denied' - wait for user choice
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>

      {/* ✅ CORRECT: Google Analytics only loads if GA_MEASUREMENT_ID exists */}
      {/* ✅ CORRECT: Uses Next.js Script component with proper strategy */}
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

      {/* ✅ EXCELLENT: Calculator Provider wraps everything */}
      <CalculatorProvider>
        {/* ✅ CORRECT: Proper layout logic for admin/auth/public pages */}
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

        {/* ✅ EXCELLENT: Cookie Consent with proper exclusions */}
        {/* Only shows on public pages, not admin/auth */}
        {!isAdminPage && !isDevAdminPage && !isAuthPage && (
          <CookieConsent
            enabled={cookieSettings.enabled}
            excludePaths={cookieSettings.excludePaths}
            style={cookieSettings.style}
            position={cookieSettings.position}
          />
        )}
      </CalculatorProvider>
    </>
  );
}