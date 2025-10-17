import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'crowdtcc',
  webDir: 'www',
  plugins: {
    SocialLogin: {
      google: {
        // ESSA CHAVE DEVE CONTER O WEB CLIENT ID (termina com .apps.googleusercontent.com)
        webClientId: 'SEU_WEB_CLIENT_ID_AQUI.apps.googleusercontent.com',
        // Para iOS, se aplicável, adicione:
        // iOSClientId: 'SEU_IOS_CLIENT_ID_AQUI.apps.googleusercontent.com',
      },
    },
  },
};

export default config;
