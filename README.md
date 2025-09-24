# Zenith POS
A minimalist, web-based Point of Sale (POS) system with integrated barcode scanning, designed for speed and simplicity, built on Cloudflare Workers.
## About The Project
Zenith POS is a modern, minimalist, and blazing-fast web-based Point of Sale system designed for retail environments. It leverages a clean, intuitive interface to streamline the checkout process. The system features a dynamic product catalog, an interactive order summary, and seamless barcode scanner integration.
This application is built on a scalable, serverless web architecture using Cloudflare Workers and Durable Objects, ensuring global low-latency access and zero-maintenance infrastructure. The primary interface allows cashiers to add items by clicking on a product grid or by using a standard USB barcode scanner, which acts as a keyboard input. The order total is calculated in real-time, and transactions are processed with a simple, elegant workflow.
## Key Features
-   **Modern & Minimalist UI**: A clean, intuitive interface designed for high-speed cashier operations.
-   **Dynamic Product Grid**: A responsive grid layout to display the product catalog.
-   **Real-time Order Summary**: The cart and totals update instantly as items are added, removed, or adjusted.
-   **Barcode Scanner Integration**: Works out-of-the-box with standard USB barcode scanners that emulate keyboard input.
-   **Product & Transaction Management**: Interfaces for managing products and viewing transaction history.
-   **User Authentication**: Secure login for cashiers to track sales.
-   **Responsive Perfection**: Flawless layout and functionality across desktops, tablets, and mobile devices.
-   **Serverless Architecture**: Built on Cloudflare Workers for high performance, scalability, and reliability.
-   **Persistent State**: Utilizes Cloudflare Durable Objects for reliable data storage.
## Technology Stack
-   **Frontend**:
    -   React & Vite
    -   TypeScript
    -   Tailwind CSS
    -   shadcn/ui
    -   Zustand (State Management)
    -   TanStack Query (Data Fetching)
    -   Framer Motion (Animations)
-   **Backend**:
    -   Cloudflare Workers
    -   Hono (Web Framework)
    -   Durable Objects (Stateful Storage)
-   **Tooling**:
    -   Bun
    -   Wrangler CLI
## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
### Installation
1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith-pos.git
    cd zenith-pos
    ```
2.  **Install dependencies:**
    ```sh
    bun install
    ```
### Local Development
To run the application locally, which includes the Vite dev server for the frontend and a local instance of the Cloudflare Worker, use the following command:
```sh
bun dev
```
This will start the development server, typically on `http://localhost:3000`. The frontend will automatically proxy API requests to your local worker instance.
## Project Structure
-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Main application views (POS, Login, Management, History).
    -   `components/`: Reusable React components.
    -   `store/`: Zustand state management stores.
    -   `lib/`: Utilities and helper functions.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The worker entrypoint.
    -   `user-routes.ts`: Application-specific API routes.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and schemas shared between the frontend and the worker.
## Deployment
This project is configured for seamless deployment to Cloudflare.
### Manual Deployment via Wrangler
1.  **Build the application:**
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    Make sure you are logged in to your Cloudflare account via the Wrangler CLI (`wrangler login`). Then, run the deploy command:
    ```sh
    bun run deploy
    ```
    Wrangler will handle the process of uploading your assets and deploying your worker.
## License
Distributed under the MIT License.