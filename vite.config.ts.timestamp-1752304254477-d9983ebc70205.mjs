// vite.config.ts
import { defineConfig } from "file:///C:/Users/rohai/Desktop/WEBSITE%20PAGES/AVATAR/AUSTROS%20ATLA%20WORLD/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/rohai/Desktop/WEBSITE%20PAGES/AVATAR/AUSTROS%20ATLA%20WORLD/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vanillaExtractPlugin } from "file:///C:/Users/rohai/Desktop/WEBSITE%20PAGES/AVATAR/AUSTROS%20ATLA%20WORLD/node_modules/@vanilla-extract/vite-plugin/dist/vanilla-extract-vite-plugin.cjs.js";
import { VitePWA } from "file:///C:/Users/rohai/Desktop/WEBSITE%20PAGES/AVATAR/AUSTROS%20ATLA%20WORLD/node_modules/vite-plugin-pwa/dist/index.js";
import tailwindcss from "file:///C:/Users/rohai/Desktop/WEBSITE%20PAGES/AVATAR/AUSTROS%20ATLA%20WORLD/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), vanillaExtractPlugin(), VitePWA(), tailwindcss()],
  publicDir: "public",
  build: {
    outDir: "dist"
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyb2hhaVxcXFxEZXNrdG9wXFxcXFdFQlNJVEUgUEFHRVNcXFxcQVZBVEFSXFxcXEFVU1RST1MgQVRMQSBXT1JMRFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccm9oYWlcXFxcRGVza3RvcFxcXFxXRUJTSVRFIFBBR0VTXFxcXEFWQVRBUlxcXFxBVVNUUk9TIEFUTEEgV09STERcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3JvaGFpL0Rlc2t0b3AvV0VCU0lURSUyMFBBR0VTL0FWQVRBUi9BVVNUUk9TJTIwQVRMQSUyMFdPUkxEL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgdmFuaWxsYUV4dHJhY3RQbHVnaW4gfSBmcm9tICdAdmFuaWxsYS1leHRyYWN0L3ZpdGUtcGx1Z2luJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHZhbmlsbGFFeHRyYWN0UGx1Z2luKCksIFZpdGVQV0EoKSwgdGFpbHdpbmRjc3MoKV0sXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiAnL3NyYycsXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgb3BlbjogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnWSxTQUFTLG9CQUFvQjtBQUM3WixPQUFPLFdBQVc7QUFDbEIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyxlQUFlO0FBQ3hCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcscUJBQXFCLEdBQUcsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUFBLEVBQ25FLFdBQVc7QUFBQSxFQUNYLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
