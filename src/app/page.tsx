import { Navbar } from "@/components/common/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Welcome to Social Metrics
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md text-center">
          Your social analytics dashboard. Sign in to get started.
        </p>
      </main>
    </>
  );
}
