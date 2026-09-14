"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function CapacitorInit() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function initializeCapacitor() {
      try {
        const { Capacitor } = await import("@capacitor/core");

        if (!Capacitor.isNativePlatform()) {
          return;
        }

        // Initialize StatusBar
        try {
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#0A0910" });
        } catch (e) {
          console.debug("StatusBar plugin not available", e);
        }

        // Hide Splash Screen
        try {
          const { SplashScreen } = await import("@capacitor/splash-screen");
          await SplashScreen.hide();
        } catch (e) {
          console.debug("SplashScreen plugin not available", e);
        }

        // Handle Android Hardware Back Button
        try {
          const { App } = await import("@capacitor/app");
          App.addListener("backButton", ({ canGoBack }) => {
            if (pathname === "/" || pathname === "/dashboard") {
              App.exitApp();
            } else if (canGoBack) {
              router.back();
            } else {
              router.push("/dashboard");
            }
          });
        } catch (e) {
          console.debug("App plugin not available", e);
        }
      } catch (err) {
        console.error("Failed to initialize Capacitor plugins:", err);
      }
    }

    initializeCapacitor();

    return () => {
      isMounted = false;
    };
  }, [router, pathname]);

  return null;
}
