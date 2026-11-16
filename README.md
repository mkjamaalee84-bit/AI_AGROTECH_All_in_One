# AI AGROTECH All-in-One

Aplikasi satu halaman Bahasa Melayu: HTML5, Tailwind CDN, Lucide CDN dan JavaScript tulen. Tiada npm, bundler atau build diperlukan. Semua logik aplikasi berada dalam `index.html`; fail service worker berasingan diperlukan untuk PWA luar talian.

## Fail lengkap

- `index.html` — UI, CSS tambahan, kalkulator, storan, chat, Gemini/OpenAI Vision, penjana dokumen dan kandungan, integrasi Firestore.
- `manifest.json` — metadata pemasangan PWA.
- `sw.js` — cache aset awam untuk kegunaan luar talian selepas pemasangan awal.
- `icons/` — ikon PNG 192px, 512px dan maskable.
- `firestore.rules` — peraturan Firestore berasaskan UID pengguna.
- `vercel.json` — tetapan header HTTP; tiada build.
- `README.md` — panduan ini.

## Muat naik ke GitHub dan deploy ke Vercel

1. Ekstrak ZIP. Cipta repositori GitHub baharu, contohnya `ai-agrotech` (private disarankan untuk kod organisasi).
2. GitHub → **Add file → Upload files**. Muat naik semua fail dan folder `icons` di atas terus ke akar repositori. Pastikan `index.html` berada di akar, bukan dalam satu lagi folder. Commit perubahan. Jangan muat naik API key, fail sandaran atau data operasi.
3. Vercel → **Add New → Project** → import repositori tersebut. Sambungkan akaun GitHub jika diminta.
4. Pilih **Framework Preset: Other**, **Root Directory: `./`**, tiada Build Command, tiada Install Command, dan **Output Directory: .**. Tiada pemboleh ubah persekitaran diperlukan untuk versi statik ini.
5. Klik **Deploy**. Buka URL HTTPS yang Vercel berikan. Setiap push berikutnya ke branch produksi akan mencetuskan deployment baharu.
6. Dalam aplikasi, buka **Tetapan & integrasi**, pilih pembekal, masukkan ID model yang akaun anda boleh gunakan dan API key sendiri. Klik **Simpan tetapan**, kemudian **Uji sambungan**. Ujian ini membuat satu permintaan API dan mungkin dicaj.
7. Pasang PWA: Chrome/Android → menu → Pasang aplikasi. Safari/iPhone → Kongsi → Tambah ke Skrin Utama. Jika butang Pasang belum muncul, gunakan menu pelayar selepas membuka laman melalui HTTPS.

Pratonton tempatan pilihan: dari direktori aplikasi, jalankan `python3 -m http.server 8080` dan buka `http://localhost:8080`. Jangan jalankan melalui `file://`; PWA dan beberapa API pelayar memerlukan origin HTTP/HTTPS.

## Pembekal AI dan had sebenar

- Gemini: POST `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`, header `x-goog-api-key`, sejarah `contents`, imej `inline_data` Base64.
- OpenAI: POST `https://api.openai.com/v1/chat/completions`, Bearer key, imej melalui `image_url` data URL.
- Model lalai: `gemini-2.5-flash` / `gpt-4.1-mini`. Tukar dalam Tetapan jika tidak tersedia, ditamatkan atau tidak dibenarkan oleh akaun anda. Pilih model yang menyokong teks dan imej. Nama lalai bukan jaminan akses.
- Had masa 90 saat, butang hentikan, mesej ralat kuota/kebenaran/model/rangkaian dan had output disediakan. Jika respons terpotong, ia ditandakan.
- Mod pakar membekalkan arahan khusus; ia bukan model tersuai atau sistem pengesahan fakta. Aplikasi ini tidak mempunyai carian web langsung, pelaksanaan kod, penghantaran WhatsApp atau penerbitan automatik ke media sosial. "Serba Bisa" merujuk kepada bantuan teks pelbagai kegunaan, bukan akses tanpa batas.
- Chat menggunakan 20 mesej terkini sebagai konteks API; sejarah penuh disimpan setempat. Mesej yang gagal dihantar dikeluarkan dari sejarah dan dikembalikan ke kotak mesej supaya boleh dicuba semula.
- Imej JPEG/PNG/WebP maksimum 5 MB; tidak disimpan ke log atau Firestore. Ia dihantar kepada pembekal AI apabila pengguna klik analisis. Hasil diagnosis teks boleh disimpan sebagai draf setempat.
- API key milik pengguna dan bil API berasingan daripada langganan ChatGPT/Gemini pengguna.

## Keselamatan dan storan

**localStorage bukan stor rahsia selamat.** Key dalam aplikasi frontend boleh dibaca oleh skrip yang berjalan pada origin itu, skrip CDN yang dimuatkan, sambungan pelayar dan pengguna peranti. Pilihan simpan key bermula tidak ditanda; tanpa pilihan itu key hanya berada dalam memori tab dan hilang selepas reload. Apabila ditanda, ia disimpan dalam localStorage seperti diminta. "Lupakan key" membuang salinan aplikasi ini, bukan membatalkan key di pembekal.

Untuk penggunaan organisasi atau akses berbilang pengguna, pindahkan panggilan API ke backend/proksi berautentikasi dengan kawalan kuota dan rahsia di server. Jangan kongsi API key organisasi melalui frontend. Static hosting tidak boleh menyembunyikan key; meletakkan key dalam environment Vercel tidak melindunginya jika dimasukkan ke JavaScript klien.

- Log/chat/draf disimpan pada origin pelayar semasa. Menukar domain, pelayar atau peranti menghasilkan storan berbeza. Mod incognito, pembersihan data laman dan had kuota boleh menyebabkan kehilangan data. Gunakan eksport JSON berkala.
- Eksport JSON termasuk data dan draf, tetapi tidak termasuk API key atau config Firebase. Import menggantikan data tempatan selepas pengesahan dan semakan skema. Ia tidak memadam data Firestore.
- Eksport CSV melindungi nilai bermula dengan aksara formula spreadsheet. Respons AI dan input pengguna dipaparkan menggunakan textContent/escaping untuk mengelakkan HTML disuntik.
- PWA hanya cache aset aplikasi awam, bukan permintaan AI/Firebase atau key. Muatan pertama memerlukan internet. Tailwind dan Lucide dicache secara best effort; jika CDN gagal semasa pemasangan, UI luar talian mungkin tidak lengkap. AI dan Firebase sentiasa memerlukan internet.
- Tailwind Play CDN sesuai untuk prototaip dan penggunaan ringan; untuk produksi berskala besar, hos CSS Tailwind yang telah dikompil dan skrip vendor sendiri. Ini akan menambah langkah penyediaan aset, tetapi bukan keperluan bagi versi yang diminta.
- Selepas mengubah aset shell PWA, naikkan nombor `CACHE` dalam `sw.js` supaya cache aset CDN diperbaharui. HTML/aset setempat menggunakan strategi network-first.

## Kalkulator bioflok

Contoh lalai hanyalah senario pengiraan, bukan bacaan ladang sebenar:

- 1,000 ekor × 200 g = 200 kg biomassa.
- Biomassa awal 100 kg; makanan sepanjang tempoh 150 kg → FCR = 150 ÷ (200 − 100) = 1.5.
- Kadar makanan 3% → 6 kg/hari.
- Probiotik = isipadu m³ × kadar label mL/m³. Kadar lalai 0, kerana formulasi/kepekatan produk berbeza.
- Garam kg ≈ isipadu m³ × perbezaan saliniti ppt positif. Lalai 0 ppt; tiada penambahan disyorkan secara automatik. Jika sasaran lebih rendah, garam tidak menurunkan saliniti.
- Molases: N terbuang = makanan kg/hari × pecahan protein ÷ 6.25 × pecahan N terbuang; molases = N terbuang × C:N ÷ pecahan karbon. Lalai protein 30%, N terbuang 75%, C:N 15 dan karbon 40% → 8.1 kg/hari secara teori.

**Model karbon ialah anggaran teori kasar**, bukan preskripsi dos. Ia menganggap semua karbon yang diperlukan datang daripada molases, tanpa mengkreditkan karbon daripada makanan atau sumber lain. N terbuang dan kandungan karbon perlu data sebenar. Penambahan karbon mempengaruhi permintaan oksigen dan keadaan flok; dapatkan penilaian teknikal sebelum menggunakan angka pada kolam. Jangan tambah bahan berdasarkan satu kalkulator sahaja.

FCR ringkas tidak mengira tuaian pertengahan atau pembetulan kematian; gunakan rekod biomassa lengkap bagi FCR pengeluaran rasmi. Log ammonia merekod TAN; ia tidak mengira NH₃ bebas atau menentukan air selamat. Diagnosis imej memerlukan ujian/pengesahan pakar. Tiada dos ubat dianggap tepat hanya berdasarkan gambar.

## Kewangan

Senario lalai:
- Pendapatan = 8,000 × RM9.50 × 2 pusingan = RM152,000/tahun.
- Untung kasar = RM152,000 − RM45,000 × 2 = RM62,000.
- Aliran tunai operasi = RM62,000 − RM18,000 kos tetap tunai = RM44,000.
- Untung operasi = RM44,000 − RM10,000 susut nilai = RM34,000.
- ROI operasi = RM34,000 ÷ RM100,000 = 34% setahun.
- Pulang modal mudah = RM100,000 ÷ RM44,000 = 2.27 tahun. Aliran tunai terkumpul akhir tahun 3 = RM32,000.

Tiada cukai, faedah, perubahan modal kerja, pertumbuhan, inflasi atau nilai baki dimodelkan. Operasi penuh bermula tahun 1. Projek durian atau projek dengan tempoh pembangunan memerlukan jadual berfasa; jangan gunakan aliran tunai seragam sebagai keputusan pelaburan muktamad. Angka ini contoh model, bukan nasihat kewangan atau jaminan hasil.

## Sambungan Firebase pilihan (CDN)

1. Cipta projek Firebase dan daftar aplikasi Web. Salin objek config Web sebagai JSON sah (nama medan bertanda petikan dua).
2. Firebase Console → Authentication → Sign-in method → dayakan **Anonymous**. Tambahkan domain Vercel/laman anda dalam Authorized domains jika diperlukan oleh tetapan projek.
3. Cipta Cloud Firestore. Dalam tab Rules, tampal keseluruhan `firestore.rules` dan publish. Jangan gunakan rule umum `allow read, write: if true`.
4. Tetapan aplikasi → Firebase → tampal config JSON dan klik **Sambung Firebase**.
5. **Hantar rekod & chat**: menulis dokumen setempat, maksimum 400 setiap batch. Dokumen terlalu besar ditolak; batch terdahulu mungkin sudah berjaya jika batch berikutnya gagal. Kemas kini setempat menang apabila anda hantar. Ambil & gabung dahulu jika anda perlu menyemak data awan terkini.
6. **Ambil & gabung**: membaca dokumen UID semasa dan menggabungkan ID sama mengikut timestamp terkini. Pastikan jam peranti tepat. Tiada penyegerakan automatik. Draf, formula dan API key tidak dihantar.
7. Padam dalam aplikasi ialah soft-delete (tombstone) dan hanya diselaraskan ke awan apabila Hantar diklik. Ini mengelakkan rekod lama muncul semula selepas penggabungan. Sandaran JSON mengekalkan tombstone.
8. **Putuskan** menghentikan penggunaan sambungan dalam aplikasi dan mengekalkan identiti anonim untuk sambungan semula. Reload untuk menukar projek. Jangan padam identiti anonim jika mahu mengakses data UID yang sama.

Struktur data: `users/{auth.uid}/records/{recordId}` dan `users/{auth.uid}/chats/{chatId}`. Firestore web config bukan key AI. Rules memisahkan data mengikut pengguna; uji rules di Firebase sebelum menggunakan data sebenar. Pertimbangkan App Check dan kuota bagi deployment terbuka.

Identiti anonim kekal pada pelayar tersebut sahaja, **bukan** akaun log masuk berbilang peranti. Untuk itu, tambah log masuk email/Google dan pautkan akaun anonim. Kos Firebase dan had dokumen Firestore masih terpakai.

## Pengesahan versi ini

Sintaks JavaScript, formula contoh, keadaan input tidak sah, payload AI dengan respons simulasi, pengendalian ralat dan storan tempatan disemak. UI desktop dan navigasi/log diuji melalui pelayar. Tiada API key atau projek Firebase pengguna diberikan; panggilan API berbayar dan penulisan Firestore sebenar belum diuji. Pemasangan pada peranti sebenar dan deployment Vercel dilakukan selepas anda memuat naik projek ini.

## Rujukan teknikal

- Gemini REST: https://ai.google.dev/api/generate-content
- OpenAI Chat Completions: https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
- OpenAI key security: https://developers.openai.com/api/reference/overview
- Firebase anonymous auth: https://firebase.google.com/docs/auth/web/anonymous-auth
- Firestore security: https://firebase.google.com/docs/firestore/security/get-started
- Vercel Git deployments: https://vercel.com/docs/deployments/git
- Bioflok: ICAR-CIBA, Training Manual (2021): https://ciba.res.in/wp-content/uploads/2021/11/Biolfoc-final-manual-Nov9-12-2021_compressed.pdf
