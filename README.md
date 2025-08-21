<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1daQ91rA6zKpPzBBsD4jDeEDDGvDCSjk4

## Run Locally

**Prerequisites:**  Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of the project and add your Supabase project credentials:
    ```env
    VITE_SUPABASE_URL=https://your-project-url.supabase.co
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
    ```
    You can find these keys in your Supabase project's "API Settings".

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

For a complete guide on the architecture and how to deploy the final AI Chat feature, please see `DOCUMENTATION.md`.
