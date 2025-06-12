import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Tennis Service Analyzer",
  description: "Analyseur d'efficacité des services au tennis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
