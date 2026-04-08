module.exports = {
  expo: {
    name: "kura-app",
    slug: "kura-app",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      bundleIdentifier: "com.rick.kuraapp",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.rick.kuraapp",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "65a47cb5-faa8-4d32-805c-e35ced4da335",
      },
      walletConnectProjectId:
        process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ||
        process.env.WALLETCONNECT_PROJECT_ID ||
        "development_project_id",
      backendUrl:
        process.env.EXPO_PUBLIC_BACKEND_URL ||
        "https://localhost:8080",
      backendUrlDev:
        process.env.EXPO_PUBLIC_BACKEND_URL_DEV ||
        undefined,
      environment: process.env.APP_ENV || process.env.NODE_ENV || "development",
    },
  },
};
