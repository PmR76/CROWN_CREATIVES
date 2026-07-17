// ============================================================
// Layout.jsx — Global Layout Wrapper
// ============================================================

export default function Layout({ children }) {
  return (
    <>
      <header></header>

      <main>
        {children}
      </main>

      <footer></footer>
    </>
  );
}
