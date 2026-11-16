# AI AGROTECH — Versi Laporan Kongsi Staf

Konfigurasi Firebase projek **yp-agrotech-bioflok** sudah ditanamkan terus dalam `index.html`. Staf tidak perlu menampal JSON atau memasukkan config Firebase. Nilai authDomain asal `://firebaseapp.com` tidak sah; kod menggunakan domain standard projek **yp-agrotech-bioflok.firebaseapp.com**. Sahkan domain tersebut dalam Firebase Console sebelum deployment.

## Tingkah laku versi ini

- Firebase dimulakan secara automatik apabila laman dibuka.
- Setiap staf log masuk menggunakan akaun email/kata laluan sendiri sekali pada peranti dipercayai. Firebase memulihkan sesi pada pembukaan seterusnya, tertakluk kepada tetapan/penyimpanan pelayar dan status akaun.
- Semua staf yang diluluskan membaca dan mencipta laporan air dalam **satu koleksi yang sama**:
  `companies/yp-agrotech-bioflok/reports/{reportId}`.
- Listener Firestore `onSnapshot` mengemas kini paparan apabila laporan berubah; tiada butang Hantar/Ambil manual.
- Setiap laporan mempunyai UID pencipta, nama pelapor, masa pengukuran dan timestamp pelayan. Nama paparan membantu bacaan; UID ialah pengenal akaun sebenar.
- Staf boleh menandakan laporan sendiri sebagai dipadam; pentadbir boleh berbuat demikian untuk mana-mana laporan. Bacaan asal tidak boleh diubah melalui klien. Rekod audit kekal dalam Firestore dengan `deleted: true`; pemadaman fizikal dilarang oleh rules aplikasi.
- Laporan baharu memerlukan internet. Butang Simpan kekal menunggu sehingga pelayan mengesahkan atau memulangkan ralat. Jika rangkaian terputus selepas penghantaran, SDK boleh menunggu sambungan semula; jangan anggap laporan telah disahkan sebelum mesej kejayaan muncul.
- Semasa luar talian, paparan yang telah dimuatkan mungkin lapuk. Laporan awan tidak ditulis ke localStorage atau cache service worker; SDK Firestore menggunakan cache memori sesi lalai.
- Chat AI, draf pemasaran, kalkulator dan API key AI kekal pada peranti, dan **tidak dikongsi** kepada staf lain. Gunakan pelayar/profil berasingan bagi data peribadi pada peranti bersama.
- Log lama versi pertama kekal pada peranti asal. Ia tidak dimuat naik secara senyap. Akaun `admin` mempunyai butang pindahan dengan pengesahan.

## 1. Konfigurasi Firebase Console sekali sahaja

Buka projek `yp-agrotech-bioflok` dalam Firebase Console. Langkah ini perlu dilakukan oleh pemilik/pentadbir projek; fail HTML tidak boleh mengaktifkan provider atau menukar rules secara sendiri.

1. **Authentication → Sign-in method**: dayakan **Email/Password**. Versi ini tidak menggunakan Anonymous Authentication dan tidak menyediakan pendaftaran terbuka.
2. **Authentication → Users → Add user**: cipta satu akaun email/kata laluan bagi setiap staf. Gunakan kata laluan berbeza dan salurkan secara dalaman; jangan kongsi satu akaun untuk semua staf.
3. Salin **User UID** setiap akaun daripada senarai Users.
4. **Firestore Database**: cipta pangkalan data **(default)** jika belum ada.
5. Buka tab **Rules**, tampal keseluruhan kandungan `firestore.rules` dalam pakej ini, kemudian **Publish**. Rules mengehadkan laporan kepada ahli syarikat aktif yang disahkan melalui Email/Password. Jangan gunakan `allow read, write: if true` atau kebenaran untuk semua pengguna anonim.
6. Dalam tab **Data**, cipta koleksi `companies`, dokumen `yp-agrotech-bioflok`. Dokumen induk boleh mempunyai medan `name` (string) = `YP Agrotech Bioflok`.
7. Dalam dokumen syarikat itu, cipta subkoleksi **members**. Bagi setiap staf, cipta dokumen dengan **ID tepat sama dengan UID Firebase Authentication**. Tambah medan:

| Medan | Jenis Firestore | Nilai |
|---|---|---|
| `active` | boolean | `true` |
| `role` | string | `staff` atau `admin` |
| `name` | string | Nama staf, contoh `Hanim` |

Contoh struktur (UID di bawah ialah penanda tempat, bukan UID sebenar):

```text
companies/yp-agrotech-bioflok/members/UID_SEBENAR_STAF
```

Pastikan `active` ialah boolean **true**, bukan teks `"true"`. Tetapkan `role: admin` hanya kepada pengurus yang berkenaan. Aplikasi tidak membenarkan pengguna mencipta atau menukar keahlian sendiri, termasuk akaun yang mempunyai peranan admin dalam UI. Keahlian diurus melalui Console yang mempunyai kebenaran projek.

8. Semak **Authentication → Settings → Authorized domains** dan tambah hostname deployment Vercel sebenar jika diperlukan.
9. Semak sekatan API key dalam Google Cloud Console supaya Firebase Authentication dan Firestore serta domain laman anda dibenarkan. Config Web bukan rahsia yang memberikan akses kepada data; perlindungan data bergantung pada Authentication dan rules.

**Jika projek anda sudah mempunyai rules untuk aplikasi lain:** gabungkan seksyen `companies/.../members` dan `companies/.../reports` secara berhati-hati ke dalam rules sedia ada. Fail yang diberikan ialah rules penuh untuk aplikasi ini dan menolak laluan lain, termasuk laluan peribadi `users/...` versi lama. Ia tidak memadam data lama. Pastikan tiada rule wildcard lain memberikan akses luas; rules Firestore yang sepadan digabungkan menggunakan kebenaran OR, jadi rule umum boleh membatalkan sekatan khusus.

## 2. Kemaskini GitHub / Vercel

1. Simpan salinan fail/rules semasa.
2. Gantikan fail **index.html**, **sw.js** dan **firestore.rules** dengan fail baharu. Untuk deployment lengkap, muat naik semua kandungan pakej ke akar repositori GitHub: `index.html`, `manifest.json`, `sw.js`, `icons/`, `vercel.json` dan dokumentasi. Memuat naik fail rules ke GitHub sahaja **tidak** menerbitkannya ke Firebase; lakukan langkah Publish di Console di atas.
3. Jika Vercel sudah disambungkan, commit/push akan mencetuskan deployment mengikut tetapan projek. Untuk projek baharu: import repositori, Framework **Other**, tiada Install/Build Command, Output Directory **.**.
4. Buka laman HTTPS, muat semula. PWA menggunakan cache shell versi baharu `ai-agrotech-shell-v2-staff`; laman terpasang mungkin memerlukan penutupan dan pembukaan semula selepas kemas kini.
5. **Akaun staf / Tetapan → Log masuk staf**. Masukkan email dan kata laluan staf. Selepas keahlian disahkan, status menunjukkan laporan syarikat dikemas kini secara langsung dan butang Simpan boleh digunakan.
6. Buka peranti kedua menggunakan akaun staf lain yang sudah diluluskan. Tambah satu laporan ujian di peranti pertama; pastikan laporan sama muncul pada peranti kedua tanpa reload. Padam laporan ujian melalui akaun pencipta/pentadbir setelah semakan.

Untuk telefon/PC lain, staf menggunakan akaun yang sama milik mereka sendiri dan tidak perlu config Firebase baharu. Jangan memasukkan kata laluan staf atau API key Gemini/OpenAI dalam kod.

## 3. Pindahkan log lama (pilihan, pentadbir)

1. Gunakan **peranti/pelayar dan domain asal** yang mempunyai log versi pertama. localStorage berbeza mengikut origin.
2. Log masuk sebagai ahli dengan peranan `admin`.
3. Buka Tetapan → **Pindahkan log lama ke syarikat**. Sahkan bilangan log yang akan dikongsi.
4. Hanya log lama aktif dipindahkan. Setiap ID lama dipetakan kepada ID migrasi deterministik dan transaksi mengelakkan pendua ID yang sama. Kegagalan boleh dicuba semula. Log sama yang asalnya mempunyai ID berbeza masih boleh muncul sebagai dua laporan; semak data sebelum pindahan.
5. Migrasi tidak memadam data peranti. Jika log lama datang daripada fail JSON, Import JSON memulihkannya ke peranti dahulu; ia tidak terus menulis ke awan. Lakukan pindahan secara berasingan selepas menyemak data.

Eksport JSON peranti dan laporan syarikat mempunyai format berbeza. **Eksport laporan JSON ialah salinan audit**, bukan fail yang boleh diimport menggunakan butang Import peranti. Butang import hanya menerima format sandaran asal schema 1. Eksport CSV laporan aktif turut tersedia.

## 4. Semakan akses dan ralat

| Paparan | Perkara untuk diperiksa |
|---|---|
| Firebase sedia · log masuk staf | Klik Akaun staf dan log masuk. |
| Akaun belum diluluskan | Wujudkan `members/{UID}` dengan `active` boolean true dan role staff/admin. |
| Akses ditolak | Publish rules, semak projectId, UID dan keahlian. |
| Dayakan Email/Password | Aktifkan provider dalam Authentication. |
| API key tidak sah | Sahkan Firebase Web config milik projek sebenar. |
| Menunggu pengesahan pelayan | Semak internet. Jangan menghantar laporan berulang kali sementara permintaan sama masih menunggu. |
| UID berbeza daripada dijangka | Semak akaun email yang digunakan dan UID dalam Firebase Authentication. |

Menukar `active` kepada false menyekat permintaan seterusnya melalui rules. Listener keahlian mengosongkan paparan apabila perubahan tersebut diterima. Peranti luar talian mungkin masih memaparkan salinan memori yang telah dimuatkan; ia tidak boleh membaca perubahan baharu atau menulis tanpa kebenaran semasa pelayan.

## 5. PWA, AI dan keselamatan

Manifest, ikon, modul AI dan kalkulator asal disertakan. Penggunaan AI masih memerlukan API key pembekal pada peranti pengguna. Key AI tidak ditulis ke Firestore. localStorage tidak menyembunyikan key daripada skrip pada origin tersebut; untuk penggunaan organisasi berskala besar, pindahkan panggilan AI ke backend dengan pengesahan dan kuota.

Service worker hanya cache aset aplikasi awam. Konfigurasi Firebase Web turut berada dalam kod frontend seperti diminta. Firebase Auth mengurus persistence sesi; kod aplikasi tidak menyimpan kata laluan sendiri. Gunakan Log keluar pada peranti bersama. Firebase boleh mengenakan caj bacaan bagi listener; monitor quota dan billing, dan pertimbangkan App Check untuk penggunaan terbuka.

## Pengesahan yang dilakukan

- Sintaks JavaScript index dan service worker.
- Simulasi dua klien: laporan baharu dan soft-delete diterima oleh kedua-dua klien melalui listener yang sama.
- Pengasingan laporan syarikat daripada data localStorage, butang mengikut pemilik/peranan, perubahan keahlian, logout, sambung semula, input dokumen tidak sah dan sekatan simpan luar talian.
- Regresi pengiraan kewangan asal.
- UI desktop, panel akaun dan permulaan SDK Firebase diperiksa dalam pelayar; aplikasi mencapai keadaan log masuk staf tanpa config manual. Ini tidak membuktikan bahawa akaun, API key, rules dan akses data sebenar telah disahkan.

Ujian simulasi menggunakan SDK Firestore gantian, **bukan ujian rules sebenar pada Firebase Emulator**. Akaun staf, rules dalam projek sebenar, domain, sekatan API key, billing dan penyegerakan dua peranti sebenar belum disahkan. Tiada akaun/projek pengguna diubah atau laporan ujian ditulis ke Firebase oleh proses penyediaan kod ini. Jalankan ujian dua peranti selepas setup Console sebelum merekod data operasi.

## Rujukan

- Email/Password Auth: https://firebase.google.com/docs/auth/web/password-auth
- Auth persistence: https://firebase.google.com/docs/auth/web/auth-state-persistence
- Real-time listeners: https://firebase.google.com/docs/firestore/query-data/listen
- Rules keahlian/dokumen: https://firebase.google.com/docs/firestore/security/rules-conditions
