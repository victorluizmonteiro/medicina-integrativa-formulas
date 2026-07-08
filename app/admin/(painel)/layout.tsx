import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessaoValida, ADMIN_COOKIE } from "@/lib/admin-auth";

export const metadata = {
  title: "Painel — Vitalyx Health",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!sessaoValida(jar.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F2F6F8", fontFamily: "var(--font-dm-sans)" }}>
      <header style={{ background: "#0A1D34", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>
          vitalyx <span style={{ color: "#8FD64B", fontSize: "0.7rem", letterSpacing: 2 }}>ADMIN</span>
        </span>
        <nav style={{ display: "flex", gap: 18 }}>
          {[
            ["/admin", "Pedidos"],
            ["/admin/parceiros", "Parceiros"],
            ["/admin/perguntas", "Perguntas"],
            ["/admin/precos", "Preços"],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ color: "#9ABFA8", fontSize: "0.82rem", textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </nav>
      </header>
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>{children}</main>
    </div>
  );
}
