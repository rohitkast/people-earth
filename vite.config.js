import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Project Pages live at /<repo>/; local dev stays at /.
const repo = process.env.GITHUB_REPOSITORY;
const base = repo ? `/${repo.split("/")[1]}/` : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
