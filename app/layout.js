import "./globals.css";

export const metadata = {
  title: "Homie - Student Housing",
  description: "Students helping students find housing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
