module.exports = {
  expo: {
    name: "kura-app",
    slug: "kura-app",
    version: "1.0.0",
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
    },
    android: {
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
    // ✅ 环境变量配置
    extra: {
      eas: {
        projectId: "your-eas-project-id",
      },
      walletConnectProjectId:
        process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID ||
        process.env.WALLETCONNECT_PROJECT_ID ||
        "development_project_id",
      environment: process.env.APP_ENV || process.env.NODE_ENV || "development",
    },
  },
};
