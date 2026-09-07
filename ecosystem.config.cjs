module.exports = {
  apps: [
    {
      name: "uesevi",
      script: "server.js",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_BASE_API_URL: "https://apiuesevi.jpmanagementgroup.com.ar",
      },
    },
  ],
};
