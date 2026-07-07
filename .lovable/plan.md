Aku akan menambah 3 fitur utama ke xurts_shop. Karena akun user & review butuh database + login, aku akan mengaktifkan **Lovable Cloud** dulu (backend bawaan Lovable — tanpa setup akun eksternal).

---

## 1. Pencarian Produk (Search)
- Ikon search di header (desktop + mobile) → buka **dialog pencarian (Command Menu)**.
- Ketik nama/kategori → hasil real-time dari data produk (nama, deskripsi, kategori).
- Klik hasil → langsung ke halaman produk.
- Shortcut keyboard `⌘K` / `Ctrl+K`.
- **Frontend only** — pakai data produk yang sudah ada, tidak butuh backend.

## 2. Akun User (Login / Register)
- Halaman `/auth` dengan tab **Sign In** dan **Sign Up** (email + password).
- Google sign-in (opsional, satu klik).
- Ikon user di header:
  - Belum login → tombol "Sign In"
  - Sudah login → dropdown (nama user, "My Wishlist", "My Orders" *(placeholder)*, "Sign Out")
- Wishlist yang tadinya di localStorage → **sync ke database** kalau user login (biar tidak hilang saat ganti browser).
- Tabel: `profiles` (nama, avatar), `wishlist_items`.

## 3. Review & Rating Produk
- Di halaman **Product Detail**, tambah section **Reviews**:
  - Rating rata-rata + jumlah review (di atas dekat harga).
  - Daftar review: bintang 1–5, judul, komentar, nama user, tanggal.
  - Form tulis review — **khusus user yang login**. Kalau belum login, tampilkan tombol "Sign in to write a review".
- Tabel: `product_reviews` (product_id, user_id, rating, title, comment).
- RLS: semua orang bisa baca; hanya user login yang bisa insert review-nya sendiri.

---

### Detail teknis (singkat)
- **Auth**: Lovable Cloud Auth (email/password + Google), listener `onAuthStateChange` di `App.tsx`, session pakai `getUser()` untuk validasi.
- **Database**: `profiles` (trigger auto-create on signup), `wishlist_items`, `product_reviews` — semua dengan RLS + grants.
- **Search**: komponen `SearchDialog` pakai `cmdk` (sudah tersedia via shadcn).
- **Header**: tambah tombol Search & User (di samping Wishlist + Cart).
- **useWishlist hook**: kalau user login, fetch/sync ke DB; kalau tidak, tetap localStorage.

### File yang akan berubah/dibuat
- Baru: `src/pages/Auth.tsx`, `src/components/SearchDialog.tsx`, `src/components/UserMenu.tsx`, `src/components/ProductReviews.tsx`, `src/hooks/useAuth.tsx`, `src/hooks/useReviews.ts`.
- Diubah: `Header.tsx`, `App.tsx`, `ProductDetail.tsx`, `useWishlist.ts`.
- Migrasi database untuk 3 tabel.

Setuju aku lanjut implementasi? Atau ada bagian yang mau kamu ubah dulu (misal skip Google sign-in, atau bikin fiturnya bertahap)?