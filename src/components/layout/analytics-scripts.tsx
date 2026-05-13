"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { readConsentClient, CONSENT_CHANGED_EVENT } from "@/lib/analytics/consent";

// GTM loader. Mounted from the root layout. Renders the GTM <Script>
// only when consent is granted AND NEXT_PUBLIC_GTM_ID is set. If GTM_ID
// is missing, the component is a no-op (useful for local dev / preview
// deploys without analytics env vars).
//
// dataLayer is initialized before GTM loads so any track.* calls
// fired during the consent-granted -> GTM-ready window are queued
// safely. Once GTM is on the page, it picks up the queued events.
export function AnalyticsScripts() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const update = () => setConsented(readConsentClient() === "granted");
    update();
    window.addEventListener(CONSENT_CHANGED_EVENT, update);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, update);
  }, []);

  if (!gtmId || !consented) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
      {/* noscript fallback for non-JS clients (also useful for some crawlers) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
