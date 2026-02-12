import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';


const BASE_URL = 'http://localhost:5001/api'


const PRE_UPLOADED = {
    pdf: 'uploads/materials/pdf-1770737302173-254483282.pdf',
    ppt: 'uploads/materials/ppt-1770737302173-254483282.pptx',
    video: 'uploads/materials/video-1770737302173-254483282.mp4',
};

const IMAGE_DIR = './assets';


const USER_NAMES = [
    "Admin Guru", 
    "Andi Pratama", "Siti Aminah", "Budi Santoso", "Dewi Lestari", 
    "Rizky Ramadhan", "Putri Ayu", "Fajar Nugraha"
];

const REALISTIC_COMMENTS = [
    
    "Izin bertanya, kalau angkanya negatif, cara hitungnya tetap sama kah?",
    "Bagian akhir videonya agak kecepetan kak, belum sempat catat.",
    "Kak, ini materi semester 1 atau semester 2?",
    "Ada contoh soal yang lebih susah gak kak? Ini terlalu dasar.",
    "Rumus ini berlaku universal atau cuma untuk kasus tertentu?",
    
    
    "Wah, gila sih. Baru paham konsep ini setelah nonton video ini. Thanks min!",
    "Penjelasannya singkat, padat, jelas. Mantap!",
    "Akhirnya nemu penjelasan yang masuk akal. Guru di sekolah jelasinnya muter-muter wkwk.",
    "Sangat membantu buat persiapan UTBK besok. Doain ya guys!",
    "Auto paham! Makasih ilmunya kak.",
    "Kualitas videonya HD banget, enak ditonton.",

    
    "Min, file PDF-nya kok gak bisa dibuka di HP saya ya?",
    "Suaranya agak kecil di pertengahan video, tolong diperbaiki next time.",
    "Kok loading videonya lama banget ya? Padahal internet lancar.",
    "Slide PPT-nya font-nya kekecilan kak, susah dibaca di HP.",

    
    "Ada yang mau bikin grup belajar WA/Telegram gak guys?",
    "Yang mau latihan soal bareng dm ya.",
    "Wkwkwk sama, gue juga baru ngerti sekarang.",
    "Semangat pejuang nilai 100!",
    "Gokil, bab ini emang paling susah sih kata gue.",
    "Jangan lupa kerjain kuisnya guys, lumayan XP-nya gede."
];

const DATA_SOURCE = {
  "kelas_10": {
    "grade": 10,
    "mata_pelajaran": [
      {
        "img": "mtk.png",
        "nama": "Matematika Dasar",
        "bab": [
          "Operasi Aljabar dan Bilangan Real",
          "Persamaan dan Pertidaksamaan Linear",
          "Sistem Persamaan Linear Dua Variabel",
          "Fungsi dan Grafik Fungsi",
          "Statistika Dasar"
        ]
      },
      {
        "img": "bio.png",
        "nama": "Biologi Umum",
        "bab": [
          "Ruang Lingkup Biologi dan Metode Ilmiah",
          "Ciri-ciri dan Tingkatan Kehidupan",
          "Keanekaragaman Hayati",
          "Virus dan Monera",
          "Ekosistem dan Lingkungan"
        ]
      },
      {
        "img": "fisika.png",
        "nama": "Fisika Dasar",
        "bab": [
          "Besaran, Satuan, dan Pengukuran",
          "Vektor dan Skalar",
          "Gerak Lurus",
          "Hukum Newton tentang Gerak",
          "Usaha dan Energi"
        ]
      },
      {
        "img": "sejarah.png",
        "nama": "Sejarah Indonesia Awal",
        "bab": [
          "Konsep Dasar Sejarah",
          "Kehidupan Praaksara di Indonesia",
          "Perkembangan Kerajaan Hindu-Buddha",
          "Masuk dan Berkembangnya Islam di Indonesia",
          "Akulturasi Budaya Nusantara"
        ]
      },
      {
        "img": "code.png",
        "nama": "Informatika Dasar",
        "bab": [
          "Pengenalan Sistem Komputer",
          "Perangkat Keras dan Perangkat Lunak",
          "Dasar Algoritma dan Flowchart",
          "Logika Berpikir Komputasional",
          "Etika dan Keamanan Digital"
        ]
      }
    ]
  },

  "kelas_11": {
    "grade": 11,
    "mata_pelajaran": [
      {
        "img": "mtk.png",
        "nama": "Matematika Lanjutan",
        "bab": [
          "Matriks dan Operasinya",
          "Determinan dan Invers Matriks",
          "Program Linear",
          "Barisan dan Deret",
          "Limit Fungsi"
        ]
      },
      {
        "img": "chem.png",
        "nama": "Kimia Dasar",
        "bab": [
          "Struktur Atom dan Sistem Periodik",
          "Ikatan Kimia",
          "Stoikiometri",
          "Larutan dan Konsentrasi",
          "Reaksi Kimia dan Energi"
        ]
      },
      {
        "img": "geo.png",
        "nama": "Geografi Fisik",
        "bab": [
          "Dinamika Litosfer",
          "Dinamika Atmosfer",
          "Hidrosfer dan Dampaknya",
          "Biosfer dan Persebaran Flora Fauna",
          "Bencana Alam dan Mitigasi"
        ]
      },
      {
        "img": "sosio.png",
        "nama": "Sosiologi",
        "bab": [
          "Konsep Dasar Sosiologi",
          "Interaksi Sosial",
          "Nilai dan Norma Sosial",
          "Diferensiasi dan Stratifikasi Sosial",
          "Konflik dan Integrasi Sosial"
        ]
      },
      {
        "img": "eko.png",
        "nama": "Ekonomi Mikro",
        "bab": [
          "Masalah Pokok Ekonomi",
          "Permintaan dan Penawaran",
          "Elastisitas",
          "Perilaku Konsumen dan Produsen",
          "Pasar dan Struktur Pasar"
        ]
      }
    ]
  },

  "kelas_12": {
    "grade": 12,
    "mata_pelajaran": [
      {
        "img": "mtk.png",
        "nama": "Kalkulus Dasar",
        "bab": [
          "Konsep Limit Lanjutan",
          "Turunan Fungsi Aljabar",
          "Aplikasi Turunan",
          "Integral Tak Tentu",
          "Aplikasi Integral"
        ]
      },
      {
        "img": "fisika.png",
        "nama": "Fisika Modern",
        "bab": [
          "Gelombang Mekanik",
          "Gelombang Elektromagnetik",
          "Optik Geometris",
          "Listrik Arus Bolak-Balik",
          "Fisika Atom dan Inti"
        ]
      },
      {
        "img": "bio.png",
        "nama": "Bioteknologi",
        "bab": [
          "Konsep Dasar Bioteknologi",
          "Enzim dan Fermentasi",
          "Rekayasa Genetika",
          "Bioteknologi Konvensional dan Modern",
          "Dampak Bioteknologi bagi Kehidupan"
        ]
      },
      {
        "img": "eko.png",
        "nama": "Ekonomi Makro",
        "bab": [
          "Pendapatan Nasional",
          "Inflasi dan Pengangguran",
          "Kebijakan Fiskal",
          "Kebijakan Moneter",
          "Perdagangan Internasional"
        ]
      },
      {
        "img": "code.png",
        "nama": "Sistem Informasi dan Data",
        "bab": [
          "Konsep Sistem Informasi",
          "Basis Data dan Manajemen Data",
          "Analisis Data Sederhana",
          "Pemanfaatan Teknologi Informasi",
          "Dampak Transformasi Digital"
        ]
      }
    ]
  }
};



const registerUser = async (name, email) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/register`, {
            name, email, password: 'password123'
        });
        return res.data.data.token;
    } catch (error) {
        console.log(error.response);
        
        if (error.response?.status === 400) {
            try {
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email, password: 'password123'
                });
                return loginRes.data.data.token;
            } catch (loginErr) {
                console.error(`Gagal login user ${name}:`, loginErr.message);
                return null;
            }
        }
        console.error(`Gagal register user ${name}:`, error.message);
        return null;
    }
};


const createSubject = async (token, title, grade, category, imgFileName) => {
    try {
        const form = new FormData();
        form.append('title', title);
        form.append('grade', grade);
        form.append('category', category);
        form.append('description', `Materi lengkap pelajaran ${title}`);
        form.append('thumbnail', fs.createReadStream(IMAGE_DIR + '/'+ imgFileName));

        
        const config = {
            headers: {
                ...form.getHeaders(),
                // 'Authorization': `Bearer ${token}`
            }
        };

        const res = await axios.post(`${BASE_URL}/migrate/subjects`, form, config);
        return res.data.data._id;
    } catch (error) {
        console.log(error);
        console.error(` Gagal create subject ${title}:`, error.response?.data?.message || error.message);
        return null;
    }
};


const createChapter = async (grade, title, subjectId, order) => {
    try {
        const res = await axios.post(
            `${BASE_URL}/migrate/chapters`, 
            { title, subjectId, order, grade }, 
            // { headers: { 'Authorization': `Bearer ${token}` } }
        );
        return res.data.data._id;
    } catch (error) {
        console.error(` Gagal create chapter ${title}:`, error.message);
        return null;
    }
};


const createMaterial = async (token, chapterId, data) => {
    try {
        await axios.post(
            `${BASE_URL}/migrate/materials`,
            { ...data, chapterId },
            // { headers: { 'Authorization': `Bearer ${token}` } }
        );
    } catch (error) {
        console.error(` Gagal create material ${data.title}:`, error.message);
    }
};


const postComment = async (token, chapterId, content) => {
    try {
        await axios.post(
            `${BASE_URL}/interactions/comment`,
            { chapterId, content },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
    } catch (error) {
        
    }
};



const runMigration = async () => {
    console.log(" Starting Full API Migration...");
    console.log(` Target: ${BASE_URL}`);

    
    console.log("\n Registering Users...");
    const userTokens = [];
    
    for (let i = 0; i < USER_NAMES.length; i++) {
        const email = `student${i+1}@school.id`;
        const token = await registerUser(USER_NAMES[i], email);
        if (token) userTokens.push(token);
    }

    if (userTokens.length === 0) {
        console.error(" No users created. Aborting.");
        process.exit(1);
    }

    const adminToken = userTokens[0]; 
    console.log(` ${userTokens.length} Users ready.`);

    
    console.log("\n Uploading Subjects & Materials...");

    for (const key of Object.keys(DATA_SOURCE)) {
        const gradeData = DATA_SOURCE[key];
        
        console.log(`\n--- Processing Grade ${gradeData.grade} ---`);

        for (const mapel of gradeData.mata_pelajaran) {
            
            
            process.stdout.write(`Uploading Subject: ${mapel.nama}... `);
            const subjectId = await createSubject(
                adminToken, 
                mapel.nama, 
                gradeData.grade, 
                mapel.nama.split(' ')[0], 
                mapel.img
            );

            if (!subjectId) {
                console.log("FAILED");
                continue;
            }
            console.log("OK");

            
            for (let i = 0; i < mapel.bab.length; i++) {
                const babTitle = mapel.bab[i];
                const chapterId = await createChapter(gradeData.grade, babTitle, subjectId, i + 1);

                if (chapterId) {
                    
                    
                    await createMaterial(adminToken, chapterId, {
                        title: `Video Pembelajaran: ${babTitle}`,
                        type: 'video',
                        contentUrl: PRE_UPLOADED.video,
                        order: 1,
                        xpReward: 50
                    });

                    
                    await createMaterial(adminToken, chapterId, {
                        title: `Rangkuman Materi: ${babTitle}`,
                        type: 'pdf',
                        contentUrl: PRE_UPLOADED.pdf,
                        order: 2,
                        xpReward: 30
                    });

                    
                    await createMaterial(adminToken, chapterId, {
                        title: `Slide Presentasi: ${babTitle}`,
                        type: 'ppt',
                        contentUrl: PRE_UPLOADED.ppt,
                        order: 3,
                        xpReward: 20
                    });

                    
                    const commentCount = Math.floor(Math.random() * 3) + 1;
                    for (let k = 0; k < commentCount; k++) {
                        const randomToken = userTokens[Math.floor(Math.random() * userTokens.length)];
                        const randomText = REALISTIC_COMMENTS[Math.floor(Math.random() * REALISTIC_COMMENTS.length)];
                        await postComment(randomToken, chapterId, randomText);
                    }
                }
            }
        }
    }

    console.log("\n Migration Finished Successfully!");
};

runMigration();