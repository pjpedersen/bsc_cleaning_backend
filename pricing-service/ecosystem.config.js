module.exports = {
    apps: [
      {
        name: "pricing-cluster",
        script: "./src/index.ts",         // your TS entrypoint
        interpreter: "ts-node",           // use the local ts-node
        instances: 3,                     // fork 3 copies
        exec_mode: "cluster",             // enable built-in round-robin
        watch: false,
        env: {
          NODE_ENV: "production",
          PORT: 3000                      // or whatever port you use
        }
      }
    ]
  };
  