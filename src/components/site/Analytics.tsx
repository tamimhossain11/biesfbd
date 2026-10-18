import Script from "next/script";

/** Meta Pixel + Google Analytics 4. Both are optional and configured in Admin → Settings. */
export function Analytics({ pixelId, gaId }: { pixelId: string; gaId: string }) {
  const pid = pixelId.replace(/\D/g, "");
  const gid = gaId.replace(/[^\w-]/g, "");
  return (
    <>
      {pid && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pid}');fbq('track','PageView');`}
        </Script>
      )}
      {gid && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gid}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gid}');`}
          </Script>
        </>
      )}
    </>
  );
}
