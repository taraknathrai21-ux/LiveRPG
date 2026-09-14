import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV === 'development';
const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.arcanecodex.liferpg',
  appName: 'Arcane Codex',
  webDir: 'out',
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: true,
      }
    : {
        androidScheme: 'https',
      },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0A0910',
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#0A0910',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      spinnerColor: '#E8B44A',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
