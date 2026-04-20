import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FUEGO | Comida Real, Rápido",
  description:
    "No hacemos comida rápida. Hacemos comida real, rápido. Ingredientes de origen, sabor legendario.",
  keywords: [
    "FUEGO",
    "comida rápida premium",
    "hamburguesas",
    "restaurant",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>

      <body className={`${inter.variable} ${archivoBlack.variable} antialiased bg-black text-white`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
