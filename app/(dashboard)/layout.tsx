import { Toaster } from "sonner"
import Sidebar from "@/components/layout/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
            borderRadius: "0",
          },
        }}
      />
    </div>
  )
}
