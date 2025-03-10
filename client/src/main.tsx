import { StrictMode } from "react";
import "./i18n";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./hooks/useAuth";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: undefined!,
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// React Query
const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}

export function App() {
  const authentication = useAuth();
  return (
    <>
      <RouterProvider router={router} context={{ authentication }} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </>
  );
}
