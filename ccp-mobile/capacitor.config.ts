import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ccp-mobile',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
		iosScheme: "https",
  }
};

export default config;
