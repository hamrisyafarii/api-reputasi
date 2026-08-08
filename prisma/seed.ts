import { PrismaClient, Sentiment } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding...');

  // ─── Cleanup: hapus data lama (urutan reverse-dependency) ─────────────────
  console.log('🧹 Membersihkan data lama...');
  await prisma.dailyBriefing.deleteMany();
  await prisma.mention.deleteMany();
  await prisma.crisisAlert.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();

  // ─── 1. Organizations ─────────────────────────────────────────────────────
  console.log('🏢 Membuat Organizations...');

  const org1 = await prisma.organization.create({
    data: { name: 'PT Garuda Nusantara Media' },
  });
  const org2 = await prisma.organization.create({
    data: { name: 'Kementerian Komunikasi dan Informatika' },
  });
  const org3 = await prisma.organization.create({
    data: { name: 'PT Bank Rakyat Indonesia (BRI) Tbk' },
  });
  const org4 = await prisma.organization.create({
    data: { name: 'Partai Demokrasi Indonesia Perjuangan' },
  });
  const org5 = await prisma.organization.create({
    data: { name: 'PT Pertamina (Persero)' },
  });

  const organizations = [org1, org2, org3, org4, org5];
  console.log(`✅ ${organizations.length} Organizations berhasil dibuat.`);

  // ─── 2. Projects ──────────────────────────────────────────────────────────
  console.log('📁 Membuat Projects...');

  const project1 = await prisma.project.create({
    data: {
      name: 'Pantauan Isu Kebijakan Pajak 2025',
      keywords: ['pajak', 'menteri keuangan', 'sri mulyani', 'DJP', 'NPWP'],
      organizationId: org1.id,
    },
  });
  const project2 = await prisma.project.create({
    data: {
      name: 'Monitoring Regulasi Penyiaran Digital',
      keywords: ['penyiaran', 'siaran digital', 'kominfo', 'streaming', 'OTT'],
      organizationId: org2.id,
    },
  });
  const project3 = await prisma.project.create({
    data: {
      name: 'Reputasi Produk KUR BRI',
      keywords: [
        'KUR BRI',
        'kredit usaha rakyat',
        'BRI',
        'pinjaman UMKM',
        'bunga rendah',
      ],
      organizationId: org3.id,
    },
  });
  const project4 = await prisma.project.create({
    data: {
      name: 'Sentimen Pemilu dan Elektabilitas',
      keywords: [
        'PDI-P',
        'megawati',
        'pemilu 2029',
        'koalisi',
        'ganjar',
        'capres',
      ],
      organizationId: org4.id,
    },
  });
  const project5 = await prisma.project.create({
    data: {
      name: 'Pantauan Isu Kenaikan Harga BBM',
      keywords: [
        'BBM',
        'pertamina',
        'harga bensin',
        'pertalite',
        'subsidi energi',
      ],
      organizationId: org5.id,
    },
  });

  const projects = [project1, project2, project3, project4, project5];
  console.log(`✅ ${projects.length} Projects berhasil dibuat.`);

  // ─── Helper: subtract days from now ───────────────────────────────────────
  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  // ─── 3. Mentions (2 per project = 10 total) ───────────────────────────────
  console.log('💬 Membuat Mentions...');

  const mentionsData = [
    // Project 1 — Kebijakan Pajak
    {
      source: 'X/Twitter',
      author: '@infopajak_id',
      content:
        'DJP resmi meluncurkan sistem e-Filing terbaru yang lebih mudah digunakan wajib pajak. Sri Mulyani: "Kami berkomitmen untuk mempermudah kepatuhan pajak masyarakat Indonesia." #pajak #DJP',
      url: 'https://twitter.com/infopajak_id/status/1234567890',
      publishedAt: daysAgo(2),
      sentiment: Sentiment.POSITIVE,
      isCrisis: false,
      projectId: project1.id,
    },
    {
      source: 'Detikcom',
      author: 'Redaksi Detikfinance',
      content:
        'Wajib pajak mengeluhkan sulitnya akses sistem NPWP Coretax yang baru diluncurkan. Ratusan laporan masuk ke call center DJP dalam sehari. Sri Mulyani berjanji segera perbaiki.',
      url: 'https://finance.detik.com/berita-ekonomi-bisnis/coretax-error',
      publishedAt: daysAgo(5),
      sentiment: Sentiment.NEGATIVE,
      isCrisis: true,
      projectId: project1.id,
    },

    // Project 2 — Regulasi Penyiaran Digital
    {
      source: 'Kompas',
      author: 'Tim Redaksi Kompas',
      content:
        'Kominfo umumkan regulasi baru bagi platform OTT asing: wajib daftar dan bayar pajak di Indonesia mulai 2025. Netflix, YouTube, dan Spotify masuk dalam daftar platform yang terkena dampak.',
      url: 'https://nasional.kompas.com/regulasi-ott-kominfo-2025',
      publishedAt: daysAgo(8),
      sentiment: Sentiment.NEUTRAL,
      isCrisis: false,
      projectId: project2.id,
    },
    {
      source: 'Kaskus',
      author: 'ForumGansis_ID',
      content:
        'Setelah regulasi siaran digital, banyak channel TV lokal yang belum siap migrasi ke platform digital. Ancaman pemutusan siaran analog bikin resah pelanggan di daerah terpencil.',
      url: 'https://www.kaskus.co.id/thread/siaran-digital-ancam-tv-lokal',
      publishedAt: daysAgo(10),
      sentiment: Sentiment.NEGATIVE,
      isCrisis: true,
      projectId: project2.id,
    },

    // Project 3 — KUR BRI
    {
      source: 'Tribunnews',
      author: 'Redaksi Tribunnews',
      content:
        'BRI berhasil salurkan KUR senilai Rp 120 triliun di semester pertama 2025, melampaui target. Presiden Prabowo apresiasi kontribusi BRI dalam mendukung UMKM nasional.',
      url: 'https://www.tribunnews.com/bisnis/kur-bri-120-triliun',
      publishedAt: daysAgo(3),
      sentiment: Sentiment.POSITIVE,
      isCrisis: false,
      projectId: project3.id,
    },
    {
      source: 'X/Twitter',
      author: '@nasabah_bri_curhat',
      content:
        'Pengajuan KUR BRI saya ditolak tanpa alasan jelas padahal usaha sudah berjalan 3 tahun. CS BRI tidak responsif. Tolong @BankBRI_id perhatikan nasabah kecil! #KURBRI #BRI',
      url: 'https://twitter.com/nasabah_bri_curhat/status/9876543210',
      publishedAt: daysAgo(7),
      sentiment: Sentiment.NEGATIVE,
      isCrisis: false,
      projectId: project3.id,
    },

    // Project 4 — PDI-P Sentimen Pemilu
    {
      source: 'Tempo.co',
      author: 'Reporter Tempo',
      content:
        'Survei terbaru menunjukkan elektabilitas PDI-P mengalami kenaikan 3 poin menjadi 21% setelah Megawati menyatakan sikap tegas terkait isu korupsi di lingkaran pemerintahan.',
      url: 'https://nasional.tempo.co/survei-pdip-elektabilitas-naik',
      publishedAt: daysAgo(1),
      sentiment: Sentiment.POSITIVE,
      isCrisis: false,
      projectId: project4.id,
    },
    {
      source: 'Detikcom',
      author: 'Redaksi Detiknews',
      content:
        'Gelombang kritik dari internal PDI-P mencuat ke publik setelah pernyataan kader soal arah koalisi 2029. Pengamat politik sebut ini sinyal keretakan yang bisa membahayakan soliditas partai.',
      url: 'https://news.detik.com/berita/pdip-krisis-internal-koalisi',
      publishedAt: daysAgo(12),
      sentiment: Sentiment.NEGATIVE,
      isCrisis: false,
      projectId: project4.id,
    },

    // Project 5 — Kenaikan Harga BBM
    {
      source: 'Kompas',
      author: 'Tim Redaksi Kompas',
      content:
        'Pertamina pastikan tidak ada kenaikan harga Pertalite dan Solar bersubsidi hingga akhir tahun 2025. Direktur Utama Pertamina: "Kami jaga stabilitas harga demi masyarakat."',
      url: 'https://money.kompas.com/pertamina-harga-bbm-stabil',
      publishedAt: daysAgo(4),
      sentiment: Sentiment.POSITIVE,
      isCrisis: false,
      projectId: project5.id,
    },
    {
      source: 'X/Twitter',
      author: '@rakyat_protes',
      content:
        'Harga BBM non-subsidi Pertamina naik lagi! Pertamax kini Rp 14.500/liter. Rakyat kecil makin tercekik, sementara Pertamina cetak laba triliunan. Ini tidak adil! #BBMNaik #Pertamina',
      url: 'https://twitter.com/rakyat_protes/status/1122334455',
      publishedAt: daysAgo(6),
      sentiment: Sentiment.NEGATIVE,
      isCrisis: false,
      projectId: project5.id,
    },
  ];

  await prisma.mention.createMany({ data: mentionsData });
  console.log(`✅ ${mentionsData.length} Mentions berhasil dibuat.`);

  // ─── 4. DailyBriefings (2 per project = 10 total) ─────────────────────────
  console.log('📋 Membuat DailyBriefings...');

  const briefingsData = [
    // Project 1 — Kebijakan Pajak
    {
      date: daysAgo(1),
      summary:
        'Dalam 24 jam terakhir, isu utama yang mendominasi percakapan publik terkait Project "Pantauan Isu Kebijakan Pajak 2025" adalah peluncuran sistem e-Filing baru oleh DJP yang mendapat respons beragam. Sebagian besar sentimen positif datang dari pengguna yang merasakan kemudahan akses, namun keluhan teknis seputar Coretax masih signifikan di media sosial. Total 2 mention terdeteksi dengan rasio sentimen: 1 positif, 1 negatif.',
      recommendation:
        'Segera keluarkan siaran pers yang menekankan komitmen DJP dalam memperbaiki bug sistem Coretax dan berikan timeline penyelesaian yang konkret. Pertimbangkan live Q&A dengan Sri Mulyani di platform X/Twitter untuk meredam keresahan wajib pajak secara langsung.',
      projectId: project1.id,
    },
    {
      date: daysAgo(8),
      summary:
        'Pantauan minggu lalu menunjukkan tingginya volume percakapan negatif terkait error sistem NPWP Coretax. Potensi krisis reputasi terdeteksi dengan indikator: lebih dari 100 mention negatif di X/Twitter dalam 24 jam, liputan media mainstream mencapai 5 outlet besar. Sentimen keseluruhan: 70% negatif.',
      recommendation:
        'Aktivasi tim crisis communication. Prioritaskan perbaikan teknis dan komunikasikan progres secara transparan. Siapkan FAQ publik dan pastikan juru bicara DJP aktif merespons pertanyaan media dalam 2 jam ke depan.',
      projectId: project1.id,
    },

    // Project 2 — Regulasi Penyiaran Digital
    {
      date: daysAgo(7),
      summary:
        'Regulasi OTT baru dari Kominfo menjadi topik hangat di kalangan pelaku industri media digital. Isu migrasi siaran analog ke digital memunculkan kekhawatiran masyarakat di daerah yang infrastrukturnya belum siap. Media online besar seperti Kompas dan Kaskus aktif meliput isu ini dengan nada kritis.',
      recommendation:
        'Kominfo perlu memperkuat program sosialisasi di daerah terpencil dan menyediakan set-top-box bersubsidi. Komunikasi publik harus lebih empatis terhadap kondisi infrastruktur daerah agar tidak menimbulkan persepsi kebijakan yang tidak adil.',
      projectId: project2.id,
    },
    {
      date: daysAgo(14),
      summary:
        'Volume percakapan terkait regulasi penyiaran digital meningkat 40% dibanding minggu sebelumnya. Sentimen negatif mendominasi (65%) terutama terkait kebijakan yang dinilai terburu-buru. Namun terdapat segmen influencer teknologi yang menyambut positif modernisasi ekosistem penyiaran nasional.',
      recommendation:
        'Gandeng influencer teknologi dan creator konten lokal untuk menyebarkan narasi positif tentang manfaat jangka panjang siaran digital. Pertimbangkan webinar publik bersama asosiasi TV lokal untuk menampung aspirasi dan mengurangi resistensi industri.',
      projectId: project2.id,
    },

    // Project 3 — KUR BRI
    {
      date: daysAgo(2),
      summary:
        'Pencapaian penyaluran KUR BRI sebesar Rp 120 triliun mendapat respons sangat positif dari media mainstream dan pemerintah. Namun di sisi lain, keluhan nasabah terkait penolakan pengajuan KUR tanpa transparansi alasan mulai muncul di media sosial dan berpotensi merusak citra.',
      recommendation:
        'Manfaatkan momentum berita positif penyaluran KUR untuk memperkuat brand BRI sebagai bank UMKM terpercaya. Sekaligus, tinjau kembali SOP penolakan KUR agar lebih transparan dan komunikatif kepada nasabah yang ditolak.',
      projectId: project3.id,
    },
    {
      date: daysAgo(9),
      summary:
        'Minggu ini sentimen terhadap produk KUR BRI cukup stabil di angka 60% positif. Apresiasi dari Presiden Prabowo menjadi katalis pemberitaan positif. Satu potensi risiko terdeteksi: akun-akun organik di X/Twitter mulai mengorganisir keluhan kolektif terkait layanan KUR.',
      recommendation:
        'Aktifkan tim social listening 24 jam untuk memantau perkembangan keluhan di X/Twitter. Jika volume keluhan meningkat lebih dari 50 tweet per hari, segera eskalasi ke Tim Humas BRI Pusat untuk respons proaktif.',
      projectId: project3.id,
    },

    // Project 4 — PDI-P Sentimen Pemilu
    {
      date: daysAgo(0),
      summary:
        'Kenaikan elektabilitas PDI-P sebesar 3 poin berhasil menuai pemberitaan positif di media mainstream. Namun isu keretakan internal partai terkait arah koalisi 2029 mulai muncul sebagai narasi tandingan yang perlu diwaspadai. Rasio sentimen saat ini: 55% positif, 45% negatif.',
      recommendation:
        'Perlu segera dilakukan konsolidasi internal dan komunikasi resmi dari DPP PDI-P untuk meluruskan narasi soal koalisi 2029. Megawati atau juru bicara senior perlu tampil di media untuk memberikan kejelasan sikap partai sebelum isu ini berkembang menjadi krisis.',
      projectId: project4.id,
    },
    {
      date: daysAgo(13),
      summary:
        'Isu internal PDI-P terkait pernyataan kader tentang arah koalisi mendominasi liputan media politik selama 3 hari berturut-turut. Analis politik dari berbagai lembaga survei mulai memberikan komentar negatif yang berpotensi mempengaruhi persepsi publik terhadap PDI-P menjelang siklus elektoral.',
      recommendation:
        'Prioritaskan manajemen isu internal sebelum informasi lebih lanjut bocor ke media. Adakan konferensi pers terbatas bersama pimpinan senior untuk menegaskan soliditas partai. Siapkan narasi tunggal yang konsisten untuk seluruh juru bicara PDI-P di semua tingkatan.',
      projectId: project4.id,
    },

    // Project 5 — Kenaikan Harga BBM
    {
      date: daysAgo(3),
      summary:
        'Pemberitaan tentang stabilitas harga Pertalite dan Solar bersubsidi mendapat respons positif dari masyarakat umum. Di sisi lain, kenaikan harga Pertamax non-subsidi memicu protes di media sosial, terutama dari pengguna kelas menengah. Volume percakapan tentang BBM meningkat 25% dibanding minggu lalu.',
      recommendation:
        'Pertamina perlu memperkuat komunikasi tentang mekanisme harga BBM non-subsidi yang mengikuti harga pasar internasional. Edukasi publik tentang perbedaan BBM bersubsidi dan non-subsidi sangat diperlukan untuk mengelola ekspektasi masyarakat.',
      projectId: project5.id,
    },
    {
      date: daysAgo(10),
      summary:
        'Sentimen publik terhadap Pertamina minggu ini terbagi: 50% positif terkait komitmen stabilisasi harga BBM subsidi, 50% negatif terkait kenaikan harga non-subsidi. Tidak ada indikator krisis yang terdeteksi namun potensi eskalasi ada jika harga BBM non-subsidi kembali naik dalam waktu dekat.',
      recommendation:
        'Siapkan contingency plan komunikasi jika terjadi kenaikan harga BBM lanjutan. Pertimbangkan program CSR atau promo khusus yang dapat meredam sentimen negatif. Pastikan Direktur Utama Pertamina tersedia untuk wawancara media apabila diperlukan.',
      projectId: project5.id,
    },
  ];

  await prisma.dailyBriefing.createMany({ data: briefingsData });
  console.log(`✅ ${briefingsData.length} DailyBriefings berhasil dibuat.`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log('\n🎉 Seeding selesai! Ringkasan data yang dibuat:');
  console.log(`   🏢 Organizations : ${organizations.length}`);
  console.log(`   📁 Projects      : ${projects.length}`);
  console.log(`   💬 Mentions      : ${mentionsData.length}`);
  console.log(`   📋 DailyBriefings: ${briefingsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
