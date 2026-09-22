import Script from 'next/script'

/**
 * Google Ads conversion ID, from Google Ads > Tools & Settings > Conversions
 * > [conversion action] > Tag setup. Same ID used in the send_to value in
 * FloatingWhatsApp.tsx for the distributor/franchise conversion event.
 */
const GOOGLE_ADS_ID = 'AW-18459620238'

/**
 * Loads the Google Ads base tag. Purely additive to the existing first-party
 * analytics in AnalyticsTracker — this is unrelated to that tool and to the
 * cookie banner: it loads unconditionally so ad conversions aren't lost to
 * visitors who reject or ignore the banner. No GA4, only Ads conversion
 * tracking.
 */
export function GoogleAdsTag() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      <Script id="google-ads-base" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  )
}
