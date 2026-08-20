import "./globals.css";

export const metadata = {
  title: "Pivotly — Make smarter moves for your business",
  description:
    "A simple financial diagnosis for entrepreneurs and small business owners in Mexico.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
