import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'crowdtcc',
  webDir: 'www',
  plugins: {
    SocialLogin: {
      google: {
        // ESSA CHAVE DEVE CONTER O WEB CLIENT ID (termina com .apps.googleusercontent.com)
        webClientId: '1066633833169-tc4k3svvdrgascv5ij5mfs2f9bpco7ro.apps.googleusercontent.com',
        // Para iOS, se aplicável, adicione:
        // iOSClientId: 'SEU_IOS_CLIENT_ID_AQUI.apps.googleusercontent.com',
      },
    },
  },
};

export default config;
