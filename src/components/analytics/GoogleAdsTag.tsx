import Script from 'next/script'

/**
 * Google Ads conversion ID, from Google Ads > Tools & Settings > Conversions
 * > [conversion action] > Tag setup. Same ID used in the send_to value in
 * FloatingWhatsApp.tsx for the distributor/franchise conversion event.
 */
const GOOGLE_ADS_ID = 'AW-18459620238'

/** Click conversions fired by the delegated listener below. */
const PHONE_CLICK_SEND_TO = `${GOOGLE_ADS_ID}/IEaSCLOE7oodEI7nneJE`
const WHATSAPP_CLICK_SEND_TO = `${GOOGLE_ADS_ID}/XPd_CMGA8oodEI7nneJE`

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
      {/* One delegated listener covers every tel: and WhatsApp link, including
          ones rendered later (chat widget, WhatsApp shelf). Links marked
          data-ads-own-conversion fire their own event and are skipped. */}
      <Script id="google-ads-click-conversions" strategy="afterInteractive">
        {`document.addEventListener('click', function (e) {
          var a = e.target.closest && e.target.closest('a[href]');
          if (!a || typeof gtag !== 'function' || a.hasAttribute('data-ads-own-conversion')) return;
          var href = a.getAttribute('href') || '';
          if (/^tel:/i.test(href)) {
            gtag('event', 'conversion', {'send_to': '${PHONE_CLICK_SEND_TO}'});
          } else if (/(wa\\.me|api\\.whatsapp\\.com|web\\.whatsapp\\.com|whatsapp:\\/\\/)/i.test(href)) {
            gtag('event', 'conversion', {'send_to': '${WHATSAPP_CLICK_SEND_TO}'});
          }
        }, true);`}
      </Script>
    </>
  )
}
