import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL = 'http://localhost:5001/api';
const USER_DATA = {
    name: "Naufal",
    email: "naufal@golearn.id",
    password: "password123"
};

const SAMPLE_FILES = {
    pdf: 'sample.pdf',
    ppt: 'sample.pptx',
    video: 'sample.mp4',
    thumbnail: 'cover.png'
};

let GLOBAL_PATHS = {
    pdf: 'uploads/materials/pdf-1770737302173-254483282.pdf',
    ppt: 'uploads/materials/ppt-1770737302173-254483282.pptx',
    video: 'uploads/materials/video-1770737302173-254483282.mp4',
};

const checkFiles = () => {
    let missing = [];
    Object.values(SAMPLE_FILES).forEach(f => {
        if (!fs.existsSync(f)) missing.push(f);
    });
    if (missing.length > 0) {
        console.error(`\x1b[31mError: Missing sample files: ${missing.join(', ')}\x1b[0m`);
        console.error(`Please create dummy files with these names in root folder.`);
        process.exit(1);
    }
};

const DATA_SOURCE = {
    "kelas_10": {
        "grade": 10,
        "mata_pelajaran": [
        { "img": "mtk.png", "nama": "Matematika Dasar", "bab": [ "Operasi Aljabar dan Bilangan Real", "Persamaan dan Pertidaksamaan Linear", "Sistem Persamaan Linear Dua Variabel", "Fungsi dan Grafik Fungsi", "Statistika Dasar" ] },
        { "img": "bio.png", "nama": "Biologi Umum", "bab": [ "Ruang Lingkup Biologi dan Metode Ilmiah", "Ciri-ciri dan Tingkatan Kehidupan", "Keanekaragaman Hayati", "Virus dan Monera", "Ekosistem dan Lingkungan" ] },
        { "img": "fisika.png", "nama": "Fisika Dasar", "bab": [ "Besaran, Satuan, dan Pengukuran", "Vektor dan Skalar", "Gerak Lurus", "Hukum Newton tentang Gerak", "Usaha dan Energi" ] },
        { "img": "sejarah.png", "nama": "Sejarah Indonesia Awal", "bab": [ "Konsep Dasar Sejarah", "Kehidupan Praaksara di Indonesia", "Perkembangan Kerajaan Hindu-Buddha", "Masuk dan Berkembangnya Islam di Indonesia", "Akulturasi Budaya Nusantara" ] },
        { "img": "code.png", "nama": "Informatika Dasar", "bab": [ "Pengenalan Sistem Komputer", "Perangkat Keras dan Perangkat Lunak", "Dasar Algoritma dan Flowchart", "Logika Berpikir Komputasional", "Etika dan Keamanan Digital" ] }
        ]
    },
    "kelas_11": {
        "grade": 11,
        "mata_pelajaran": [
        { "img": "mtk.png", "nama": "Matematika Lanjutan", "bab": [ "Matriks dan Operasinya", "Determinan dan Invers Matriks", "Program Linear", "Barisan dan Deret", "Limit Fungsi" ] },
        { "img": "chem.png", "nama": "Kimia Dasar", "bab": [ "Struktur Atom dan Sistem Periodik", "Ikatan Kimia", "Stoikiometri", "Larutan dan Konsentrasi", "Reaksi Kimia dan Energi" ] },
        { "img": "geo.png", "nama": "Geografi Fisik", "bab": [ "Dinamika Litosfer", "Dinamika Atmosfer", "Hidrosfer dan Dampaknya", "Biosfer dan Persebaran Flora Fauna", "Bencana Alam dan Mitigasi" ] },
        { "img": "sosio.png", "nama": "Sosiologi", "bab": [ "Konsep Dasar Sosiologi", "Interaksi Sosial", "Nilai dan Norma Sosial", "Diferensiasi dan Stratifikasi Sosial", "Konflik dan Integrasi Sosial" ] },
        { "img": "eko.png", "nama": "Ekonomi Mikro", "bab": [ "Masalah Pokok Ekonomi", "Permintaan dan Penawaran", "Elastisitas", "Perilaku Konsumen dan Produsen", "Pasar dan Struktur Pasar" ] }
        ]
    },
    "kelas_12": {
        "grade": 12,
        "mata_pelajaran": [
        { "img": "mtk.png", "nama": "Kalkulus Dasar", "bab": [ "Konsep Limit Lanjutan", "Turunan Fungsi Aljabar", "Aplikasi Turunan", "Integral Tak Tentu", "Aplikasi Integral" ] },
        { "img": "fisika.png", "nama": "Fisika Modern", "bab": [ "Gelombang Mekanik", "Gelombang Elektromagnetik", "Optik Geometris", "Listrik Arus Bolak-Balik", "Fisika Atom dan Inti" ] },
        { "img": "bio.png", "nama": "Bioteknologi", "bab": [ "Konsep Dasar Bioteknologi", "Enzim dan Fermentasi", "Rekayasa Genetika", "Bioteknologi Konvensional dan Modern", "Dampak Bioteknologi bagi Kehidupan" ] },
        { "img": "eko.png", "nama": "Ekonomi Makro", "bab": [ "Pendapatan Nasional", "Inflasi dan Pengangguran", "Kebijakan Fiskal", "Kebijakan Moneter", "Perdagangan Internasional" ] },
        { "img": "code.png", "nama": "Sistem Informasi dan Data", "bab": [ "Konsep Sistem Informasi", "Basis Data dan Manajemen Data", "Analisis Data Sederhana", "Pemanfaatan Teknologi Informasi", "Dampak Transformasi Digital" ] }
        ]
    }
};

const logStep = (step, msg) => console.log(`\n\x1b[36m[STEP ${step}]\x1b[0m ${msg}`);
const logSuccess = (msg) => console.log(`\x1b[32m  ✔ SUCCESS:\x1b[0m ${msg}`);
const logInfo = (msg) => console.log(`\x1b[33m  ℹ INFO:\x1b[0m ${msg}`);
const logError = (err) => {
    console.log(`\x1b[31m  ✖ FAILED:\x1b[0m ${err.message}`);
    if (err.response) {
        console.log(`     Status: ${err.response.status}`);
        console.log(`     Data:`, JSON.stringify(err.response.data, null, 2));
    }
};

const runMigration = async () => {
    console.log(`\n🚀 STARTING USER SEEDING...`);
    console.log(`Target: ${BASE_URL}`);
    
    let authToken = null;
    let userId = null;

    try {
        logStep(1, `Registering User [${USER_DATA.email}]...`);
        
        try {
            const registerRes = await axios.post(`${BASE_URL}/auth/register`, USER_DATA);
            
            authToken = registerRes.data.data.token;
            userId = registerRes.data.data._id;
            
            logSuccess(`User registered successfully.`);
            logInfo(`Name: ${registerRes.data.data.name}`);
            logInfo(`XP: ${registerRes.data.data.xp}`);

        } catch (error) {
            if (error.response && (error.response.status === 400 || error.response.data.message.includes('exists'))) {
                logInfo(`User already exists. Attempting login...`);
                
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: USER_DATA.email,
                    password: USER_DATA.password
                });

                authToken = loginRes.data.data.token;
                userId = loginRes.data.data._id;

                logSuccess(`User logged in successfully.`);
                logInfo(`XP Current: ${loginRes.data.data.xp}`);
            } else {
                throw error;
            }
        }

        const axiosAuth = axios.create({
            baseURL: BASE_URL,
            headers: { Authorization: `Bearer ${authToken}` }
        });

        const classes = ['kelas_10', 'kelas_11', 'kelas_12'];

        for (const classKey of classes) {
            const gradeData = DATA_SOURCE[classKey];
            const gradeLevel = gradeData.grade; 

            logStep(`Processing ${classKey} (Grade ${gradeLevel})`);

            for (const subject of gradeData.mata_pelajaran) {
                logInfo(`Creating Subject: ${subject.nama}`);
                const subjectForm = new FormData();
                subjectForm.append('title', subject.nama);
                subjectForm.append('description', `Materi pelajaran ${subject.nama} untuk kelas ${gradeLevel}`);
                subjectForm.append('category', 'Umum'); 
                subjectForm.append('thumbnail', fs.createReadStream(subject.img));

                const subjectRes = await axiosAuth.post('/migrate/subjects', subjectForm, {
                    headers: { ...subjectForm.getHeaders() }
                });
                const subjectId = subjectRes.data.data._id;

                let chapterOrder = 1;
                for (const babTitle of subject.bab) {
                    const chapterRes = await axiosAuth.post('/migrate/chapters', {
                        subjectId,
                        title: babTitle,
                        grade: gradeLevel,
                        order: chapterOrder++
                    });
                    const chapterId = chapterRes.data.data._id;

                    await createMaterialsForChapter(axiosAuth, chapterId, babTitle);
                }
            }
        }
        
        console.log(`\n---------------------------------------------`);
        console.log(`\x1b[32m✅ MIGRATION COMPLETED!\x1b[0m`);
        console.log(`Global Paths Used:`);
        console.log(GLOBAL_PATHS);
        console.log(`---------------------------------------------\n`);

    } catch (err) {
        logError(err);
        process.exit(1);
    }
};

const createMaterialsForChapter = async (client, chapterId, babTitle) => {
    const materialTypes = [
        { suffix: 'Rangkuman', type: 'pdf', fileKey: 'pdf' },
        { suffix: 'Slide Powerpoint', type: 'ppt', fileKey: 'ppt' },
        { suffix: 'Video Pembahasan', type: 'video', fileKey: 'video' }
    ];

    for (const mat of materialTypes) {
        const title = `${mat.suffix} - ${babTitle}`;
        
        if (GLOBAL_PATHS[mat.fileKey]) {
            try {
                await client.post('/migrate/materials', {
                    chapterId,
                    title,
                    type: mat.type,
                    contentUrl: GLOBAL_PATHS[mat.fileKey] 
                });
            } catch (e) {
                console.error(`Failed linking material ${title}:`, e.message);
            }
        } else {
            logInfo(`[First Upload] Uploading master file for: ${mat.type.toUpperCase()}`);
            try {
                const form = new FormData();
                form.append('chapterId', chapterId);
                form.append('title', title);
                form.append('type', mat.type);
                form.append('file', fs.createReadStream(SAMPLE_FILES[mat.fileKey]));

                const res = await client.post('/migrate/materials', form, {
                    headers: { ...form.getHeaders() }
                });

                const uploadedUrl = res.data.data.contentUrl;
                GLOBAL_PATHS[mat.fileKey] = uploadedUrl;
                
                logSuccess(`Master file stored at: ${uploadedUrl}`);
            } catch (e) {
                console.error(`Failed uploading master file ${title}:`, e.message);
                if(e.response) console.error(e.response.data);
            }
        }
    }
};

runMigration();