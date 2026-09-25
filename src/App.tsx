import { BrowserRouter } from "react-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./App.router";
import { OfflineBanner } from "./components/ui/offlineBanner/OfflineBanner";
import { Toaster } from "./components/ui/chadCn/sonner";
import { Footer } from "./components/ui/footer/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas de retención en caché
      staleTime: 1000 * 60 * 5, // 5 minutos de datos frescos
      networkMode: "offlineFirst",
    },
  },
});

// El persistidor asíncrono envuelve localStorage automáticamente
const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});
const App = () => {
  return (
    <main className="relative min-h-dvh max-w-3xl mx-auto flex flex-col pb-20">
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <BrowserRouter>
          <AuthProvider>
            <Toaster richColors position="bottom-right" />
            <OfflineBanner />
            <AppRouter />
            <Footer/>
          </AuthProvider>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </main>
  );
};

export default App;
