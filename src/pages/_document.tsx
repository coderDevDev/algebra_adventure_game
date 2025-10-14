import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* PWA Meta Tags */}
                <meta name="application-name" content="Algebra Adventure" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black-translucent"
                />
                <meta name="apple-mobile-web-app-title" content="Algebra Adventure" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="format-detection" content="telephone=no" />

                {/* Landscape Orientation Lock */}
                <meta name="screen-orientation" content="landscape" />
                <meta name="x5-orientation" content="landscape" />
                <meta name="orientation" content="landscape" />

                {/* Theme Colors */}
                <meta name="theme-color" content="#F59E0B" />
                <meta name="msapplication-TileColor" content="#F59E0B" />
                <meta name="msapplication-navbutton-color" content="#F59E0B" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="#F59E0B"
                />

                {/* Manifest */}
                <link rel="manifest" href="/manifest.json" />

                {/* Favicon */}
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon.png"
                />
                <link rel="shortcut icon" href="/favicon.png" />

                {/* Apple Touch Icons */}
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/pwa-icons/icon-192x192.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/pwa-icons/icon-152x152.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="144x144"
                    href="/pwa-icons/icon-144x144.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="120x120"
                    href="/pwa-icons/icon-128x128.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="76x76"
                    href="/pwa-icons/icon-96x96.png"
                />

                {/* Description */}
                <meta
                    name="description"
                    content="Algebra Adventure - An interactive educational game that teaches algebra through real-world problem solving and engaging gameplay"
                />

                {/* Prevent Zooming on Mobile */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
                />

                {/* Google Fonts - Math game typography */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}

