import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

// --- INISIALISASI FIREBASE CLOUD ---
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const DATABASE_ID = typeof __app_id !== 'undefined' ? __app_id : 'popda-sulteng-2026';

// --- ICONS ---
const UsersIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const CheckCircleIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const AlertCircleIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const ClockIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const LogOutIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const PlusIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ShieldIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const FileUpIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><polyline points="9 15 12 12 15 15"/></svg>;
const CameraIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const EyeIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const PrinterIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const EditIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SettingsIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const FileTextIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const SearchIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TrashIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const IdCardIcon = (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h3"/><path d="M14 17h1"/></svg>;

const calculateAge = (dateString) => {
    if (!dateString) return '-';
    const birthDate = new Date(dateString);
    if (isNaN(birthDate)) return '-';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const InfoRow = ({ label, children, isMono }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 last:border-0 items-center">
        <div className="col-span-1 text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</div>
        <div className={`col-span-2 text-sm font-semibold text-slate-800 ${isMono ? 'font-mono' : ''}`}>{children || '-'}</div>
    </div>
);

const REGIONS = [
    'Semua Wilayah', 'Kab. Banggai', 'Kab. Banggai Kepulauan', 'Kab. Banggai Laut', 
    'Kab. Buol', 'Kab. Donggala', 'Kab. Morowali', 'Kab. Morowali Utara', 
    'Kab. Parigi Moutong', 'Kab. Poso', 'Kab. Sigi', 'Kab. Tojo Una-Una', 
    'Kab. Tolitoli', 'Kota Palu'
];

const CABOR_LIST = [
    'Semua Cabor', 'Bola Basket 5X5', 'Bola Voli', 'Sepak Bola', 'Sepak Takraw', 
    'KETUA KONTINGEN', 'SEKRETARIS KONTINGEN', 'BENDAHARA KONTINGEN', 'ANGGOTA KONTINGEN', 'EKSTRA ANGGOTA KONTINGEN'
];

const DEFAULT_PASSWORDS = {
    'Kab. Banggai': 'Banggai2026', 'Kab. Banggai Kepulauan': 'Bangkep2026', 'Kab. Banggai Laut': 'Balut2026',
    'Kab. Buol': 'Buol2026', 'Kab. Donggala': 'Donggala2026', 'Kab. Morowali': 'Morowali2026',
    'Kab. Morowali Utara': 'Morut2026', 'Kab. Parigi Moutong': 'Parimo2026', 'Kab. Poso': 'Poso2026',
    'Kab. Sigi': 'Sigi2026', 'Kab. Tojo Una-Una': 'Touna2026', 'Kab. Tolitoli': 'Tolitoli2026', 'Kota Palu': 'Palu2026'
};

const REQUIRED_DOCS = [
    { id: 'sitenor', label: 'KARTU SITENOR', categories: ['Pelatih'] },
    { id: 'ktp_kia', label: 'KTP/KIA', categories: ['Olahragawan'] },
    { id: 'ktp', label: 'KTP', categories: ['Pelatih', 'Official'] },
    { id: 'akta', label: 'AKTA KELAHIRAN', categories: ['Olahragawan'] },
    { id: 'kk', label: 'KARTU KELUARGA', categories: ['Olahragawan'] },
    { id: 'rapor', label: 'RAPOR (HALAMAN BIODATA DAN SEMESTER TERAKHIR)', categories: ['Olahragawan'] },
    { id: 'ijazah', label: 'IJAZAH TERAKHIR', categories: ['Olahragawan'] },
    { id: 'nisn_doc', label: 'NISN', categories: ['Olahragawan'] },
    { id: 'ket_sekolah', label: 'SURAT KETERANGAN SEKOLAH', categories: ['Olahragawan'] },
    { id: 'rek_sekolah', label: 'SURAT REKOMENDASI SEKOLAH', categories: ['Olahragawan'] },
    { id: 'lisensi', label: 'LISENSI/SERTIFIKAT', categories: ['Pelatih'] },
    { id: 'ket_sehat', label: 'SURAT KETERANGAN SEHAT (MAKS 2 BULAN SEBELUM)', categories: ['Olahragawan'] },
    { id: 'bpjs_kes', label: 'KARTU BPJS KESEHATAN', categories: ['Olahragawan', 'Pelatih'] },
    { id: 'bpjs_tk', label: 'KARTU BPJS KETENAGAKERJAAN', categories: ['Olahragawan', 'Pelatih'] },
    { id: 'foto', label: 'PAS FOTO WARNA TERBARU (MAKS 2 BULAN SEBELUM)', categories: ['Olahragawan', 'Pelatih', 'Official'] }
];

export default function App() {
    const [view, setView] = useState('login'); 
    const [currentUser, setCurrentUser] = useState(null);
    const [pesertaList, setPesertaList] = useState([]);
    const [authUser, setAuthUser] = useState(null);

    const [logos, setLogos] = useState([null, null]);
    const [bgImages, setBgImages] = useState({ Olahragawan: null, Pelatih: null, Official: null });
    
    const [passwords, setPasswords] = useState(DEFAULT_PASSWORDS);
    const [adminPassword, setAdminPassword] = useState("AdminPOPDA2026");

    // --- INISIALISASI AUTH ---
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (e) {
                console.error("Firebase Auth Error:", e);
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
        });
        return () => unsubscribe();
    }, []);

    // --- EFEK PERMANEN: AMBIL PENGATURAN LOGO SECARA REALTIME ---
    useEffect(() => {
        if (!authUser) return;
        // Alamat sudah dibenarkan menjadi 'settings', 'app_config'
        const settingsRef = doc(db, 'settings', 'app_config');
        const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.logos) setLogos(data.logos);
                if (data.bgImages) setBgImages(data.bgImages);
            }
        }, (error) => {
            console.error("Gagal mengambil pengaturan permanen:", error);
        });
        
        return () => unsubscribeSettings();
    }, [authUser]);

    // --- EFEK: AMBIL DATA PESERTA ---
    useEffect(() => {
        if (!authUser) return;
        const dataRef = collection(db, 'artifacts', DATABASE_ID, 'public', 'data', 'peserta');
        const unsubscribeData = onSnapshot(dataRef, (snapshot) => {
            const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            allData.sort((a, b) => b.timestamp - a.timestamp);
            setPesertaList(allData);
        }, (error) => {
            console.error("Firestore error:", error);
        });
        return () => unsubscribeData();
    }, [authUser]);

    // --- FUNGSI PRO: SIMPAN PENGATURAN LOGO/BG KE CLOUD SECARA PERMANEN ---
    const handleUpdateGlobalSettings = async (newData) => {
        if (!authUser) return;
        try {
            // Alamat sudah dibenarkan menjadi 'settings', 'app_config'
            const settingsRef = doc(db, 'settings', 'app_config');
            await setDoc(settingsRef, newData, { merge: true });
        } catch (error) {
            console.error("Gagal simpan pengaturan permanen:", error);
        }
    };

    const handleLogin = (role, regency = null) => {
        setCurrentUser({ role, regency });
        setView(role);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('login');
    };

    const handleSavePeserta = async (peserta) => {
        if (!authUser) return;
        let idReg = peserta.id_registrasi;
        if (!idReg) {
            const regCode = peserta.regency.replace(/Kab\.|Kota /g, '').trim().substring(0, 3).toUpperCase();
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            idReg = `P26-${regCode}-${randomNum}`;
        }
        const docId = peserta.id ? peserta.id.toString() : Date.now().toString();
        const dataToSave = { 
            ...peserta, id_registrasi: idReg, status: peserta.status || 'Pending', 
            timestamp: Date.now(), catatan_revisi: peserta.catatan_revisi || '' 
        };
        try {
            const docRef = doc(db, 'artifacts', DATABASE_ID, 'public', 'data', 'peserta', docId);
            await setDoc(docRef, dataToSave);
        } catch (error) {
            console.error("Gagal menyimpan ke Firebase:", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus, catatan = '') => {
        if (!authUser) return;
        try {
            const docRef = doc(db, 'artifacts', DATABASE_ID, 'public', 'data', 'peserta', id.toString());
            await updateDoc(docRef, { status: newStatus, catatan_revisi: catatan, timestamp: Date.now() });
        } catch (error) {
            console.error("Gagal update status di Firebase:", error);
        }
    };

    const handleDeletePeserta = async (id) => {
        if (!authUser) return;
        try {
            const docRef = doc(db, 'artifacts', DATABASE_ID, 'public', 'data', 'peserta', id.toString());
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Gagal menghapus data di Firebase:", error);
        }
    };

    const handleChangePassword = (regency, newPassword) => setPasswords(prev => ({ ...prev, [regency]: newPassword }));
    const handleResetPassword = (regency) => setPasswords(prev => ({ ...prev, [regency]: DEFAULT_PASSWORDS[regency] }));
    const handleResetAdminPassword = () => setAdminPassword("AdminPOPDA2026");

    if (view === 'login') return <LoginScreen onLogin={handleLogin} passwords={passwords} adminPassword={adminPassword} onResetAdmin={handleResetAdminPassword} logos={logos} />;
    if (view === 'operator') return <OperatorDashboard user={currentUser} data={pesertaList} onLogout={handleLogout} onSave={handleSavePeserta} onDelete={handleDeletePeserta} onChangePassword={handleChangePassword} logos={logos} />;
    if (view === 'admin') return <AdminDashboard data={pesertaList} onLogout={handleLogout} onUpdateStatus={handleUpdateStatus} onResetPassword={handleResetPassword} logos={logos} setLogos={setLogos} bgImages={bgImages} setBgImages={setBgImages} onChangeAdminPassword={setAdminPassword} passwords={passwords} onSyncSettings={handleUpdateGlobalSettings} />;
    
    return null;
}

// ==========================================
// VIEW 1: LOGIN SCREEN
// ==========================================
function LoginScreen({ onLogin, passwords, adminPassword, onResetAdmin, logos }) {
    const [secretClick, setSecretClick] = useState(0);
    const [showAdmin, setShowAdmin] = useState(false);
    const [selectedRegency, setSelectedRegency] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isRecovering, setIsRecovering] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const [recoveryMessage, setRecoveryMessage] = useState('');

    const handleLogoClick = () => {
        if (secretClick >= 2) setShowAdmin(true);
        else setSecretClick(prev => prev + 1);
        setTimeout(() => setSecretClick(0), 1000);
    };

    const handleOperatorLogin = () => {
        if (!selectedRegency) return;
        if (passwordInput === passwords[selectedRegency]) {
            setLoginError(''); onLogin('operator', selectedRegency);
        } else setLoginError('Kata sandi tidak sesuai!');
    };

    const handleAdminLogin = () => {
        if (adminPasswordInput === adminPassword) {
            setLoginError(''); onLogin('admin');
        } else setLoginError('Kata sandi Admin salah!');
    };

    const handleRecoverySubmit = () => {
        if (recoveryKey === 'SULTENG2026') {
            onResetAdmin(); setRecoveryMessage('Berhasil! Sandi dikembalikan ke: AdminPOPDA2026');
            setTimeout(() => { setIsRecovering(false); setRecoveryKey(''); setRecoveryMessage(''); }, 4000);
        } else setRecoveryMessage('Kode pemulihan salah!');
    };

    return (
        <div className="min-h-screen uppercase bg-gradient-to-br from-indigo-950 via-blue-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-[540px] p-8 md:p-10 text-center border border-white/20 relative z-10 transform transition-all">
                <div className="flex justify-center items-center gap-6 mb-6 h-20 cursor-pointer" onClick={handleLogoClick}>
                    {logos[0] ? <img src={logos[0]} alt="Logo 1" className="h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform" /> : (!logos[1] && <div className="h-16 w-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"><ShieldIcon className="w-8 h-8 text-white" /></div>)}
                    {logos[1] && <img src={logos[1]} alt="Logo 2" className="h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform" />}
                </div>
                
                <h2 className="text-xs md:text-sm font-bold text-indigo-400 tracking-[0.3em] mb-3">Pendaftaran</h2>
                <h1 className="text-2xl sm:text-[28px] md:text-[32px] font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-cyan-800 tracking-tight leading-tight mb-1 whitespace-nowrap">POPDA XXIV SULTENG NAMBASO</h1>
                <p className="text-slate-600 text-sm sm:text-[15px] md:text-[17px] font-black tracking-[0.16em] mb-8 whitespace-nowrap">TAHUN 2026</p>
                
                <div className="space-y-5">
                    {showAdmin && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-slate-900 p-5 rounded-2xl mb-4 border border-amber-500/30 shadow-inner text-left">
                            {isRecovering ? (
                                <div className="animate-in fade-in">
                                    <label className="block text-xs font-bold text-teal-400 mb-2 tracking-wide">Pemulihan Sandi Admin</label>
                                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed normal-case">Masukkan Kode Master Rahasia (Developer Key) untuk mengembalikan sandi ke pengaturan pabrik.</p>
                                    <input type="password" value={recoveryKey} onChange={(e) => { setRecoveryKey(e.target.value); setRecoveryMessage(''); }} placeholder="Kode pemulihan..." className="w-full normal-case p-3.5 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-slate-800 text-white text-sm mb-3 outline-none transition-all" />
                                    {recoveryMessage && <p className={`text-xs font-bold mb-3 ${recoveryMessage.includes('Berhasil') ? 'text-teal-400' : 'text-rose-400'}`}>{recoveryMessage}</p>}
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsRecovering(false)} className="px-4 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-bold transition-all text-xs">Batal</button>
                                        <button onClick={handleRecoverySubmit} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">Validasi Kode</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-bold text-amber-400 tracking-wide">Sandi Admin Provinsi</label>
                                        <button onClick={() => setIsRecovering(true)} className="text-[10px] font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">Lupa Sandi?</button>
                                    </div>
                                    <input type="password" value={adminPasswordInput} onChange={(e) => { setAdminPasswordInput(e.target.value); setLoginError(''); }} placeholder="Masukkan sandi admin..." className="w-full normal-case p-3.5 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-slate-800 text-white text-sm mb-3 outline-none transition-all" />
                                    <button onClick={handleAdminLogin} disabled={!adminPasswordInput} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ShieldIcon className="w-5 h-5" /> Masuk sebagai Admin Provinsi
                                    </button>
                                </>
                            )}
                            <div className="relative py-4 mt-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                                <div className="relative flex justify-center text-xs font-bold tracking-wider"><span className="px-3 bg-slate-900 text-slate-500">Atau Akses Operator</span></div>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-left">
                        <label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">Pilih Wilayah Operasional</label>
                        <select value={selectedRegency} onChange={(e) => { setSelectedRegency(e.target.value); setLoginError(''); }} className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 mb-4 bg-white text-sm shadow-sm transition-all outline-none font-medium uppercase">
                            <option value="" disabled>-- Pilih Kabupaten/Kota --</option>
                            {REGIONS.filter(r => r !== 'Semua Wilayah').map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">Kata Sandi (Password)</label>
                        <input type="password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }} placeholder="Masukkan kata sandi unit daerah..." className={`w-full normal-case p-3.5 border rounded-xl focus:ring-2 outline-none mb-2 bg-white text-sm shadow-sm transition-all font-medium ${loginError ? 'border-rose-300 focus:ring-rose-500/50' : 'border-slate-200 focus:ring-indigo-500/50 focus:border-indigo-500'}`} />
                        {loginError && <p className="text-rose-500 text-xs font-bold mb-3 flex items-center gap-1"><AlertCircleIcon className="w-3 h-3"/> {loginError}</p>}
                        <button onClick={handleOperatorLogin} disabled={!selectedRegency} className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2 ${selectedRegency ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white hover:shadow-indigo-500/30 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                            <UsersIcon className="w-5 h-5" /> Masuk Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VIEW 2: OPERATOR DASHBOARD
// ==========================================
function OperatorDashboard({ user, data, onLogout, onSave, onDelete, onChangePassword, logos }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [pesertaToEdit, setPesertaToEdit] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCabor, setFilterCabor] = useState("Semua Cabor");

    const baseData = data.filter(p => p.regency === user.regency);
    const total = baseData.length;
    const approved = baseData.filter(p => p.status === 'Approved').length;
    const pending = baseData.filter(p => p.status === 'Pending').length;
    const revision = baseData.filter(p => p.status === 'Revision').length;
    const progressPercentage = total === 0 ? 0 : Math.round((approved / total) * 100);

    const filteredData = baseData.filter(p => {
        const matchCabor = filterCabor === 'Semua Cabor' || p.cabor === filterCabor;
        const matchSearch = (p.nama && p.nama.toLowerCase().includes(searchTerm.toLowerCase())) || (p.nik && p.nik.includes(searchTerm)) || (p.id_registrasi && p.id_registrasi.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchCabor && matchSearch;
    }).sort((a,b) => b.timestamp - a.timestamp);

    const openAddForm = () => { setPesertaToEdit(null); setIsModalOpen(true); };

    const handleExportCSV = () => {
        if (filteredData.length === 0) return;
        const headers = ['ID Registrasi', 'Nama Lengkap', 'NIK', 'NISN', 'Kategori', 'Cabor', 'Status Verifikasi'];
        const csvRows = [headers.join(',')];
        filteredData.forEach(p => {
            const row = [`"${p.id_registrasi || '-'}"`, `"${p.nama}"`, `"${p.nik}"`, `"${p.nisn || '-'}"`, `"${p.kategori}"`, `"${p.cabor}"`, `"${p.status}"`];
            csvRows.push(row.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        try {
            const link = document.createElement("a"); link.href = URL.createObjectURL(blob);
            link.download = `Rekap_Peserta_${user.regency.replace(/\s+/g, '_')}_POPDA.csv`;
            link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
        } catch(e) { console.error("Preview mode blocks file download"); }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800 uppercase">
            <aside className="w-72 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-white/10 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/5 p-2">
                        {logos[0] ? <img src={logos[0]} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" /> : <ShieldIcon className="w-8 h-8 text-cyan-400" />}
                    </div>
                    <h2 className="font-extrabold text-xl tracking-tight text-white whitespace-nowrap">POPDA XXIV</h2>
                    <p className="text-cyan-400 text-[10px] font-bold tracking-widest mt-1 opacity-80">Operator {user.regency}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/10 text-cyan-50 rounded-xl font-semibold border-l-4 border-cyan-400 shadow-sm transition-all"><UsersIcon className="w-5 h-5 opacity-80" /> Data Peserta</button>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"><ShieldIcon className="w-5 h-5 opacity-80" /> Keamanan Akun</button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-all"><LogOutIcon className="w-5 h-5" /> Keluar Sistem</button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none z-0"></div>
                <header className="bg-white/80 backdrop-blur-md p-6 border-b border-slate-200/60 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Kontingen</h1>
                        <p className="text-slate-500 text-sm font-medium mt-0.5 normal-case">Kelola dan tinjau pendaftaran dari wilayah Anda.</p>
                    </div>
                    <button onClick={openAddForm} className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"><PlusIcon className="w-5 h-5" /> Tambah Peserta</button>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 z-10 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-sm font-bold mb-3"><span className="text-slate-700">Kesiapan Berkas ({user.regency})</span><span className="text-emerald-600">{progressPercentage}% Selesai Diverifikasi</span></div>
                            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden shadow-inner"><div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
                        </div>
                        <div className="text-xs text-slate-500 font-bold bg-slate-50 px-5 py-3 rounded-xl border border-slate-100 text-center min-w-[140px] shadow-sm">
                            <span className="text-lg text-slate-800 block mb-0.5">{approved} / {total}</span> Atlet Siap Tanding
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                        <StatCard title="Total Pendaftar" value={total} type="neutral" />
                        <StatCard title="Menunggu Verifikasi" value={pending} type="warning" />
                        <StatCard title="Butuh Revisi" value={revision} type="danger" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 bg-slate-50/50 shrink-0 justify-between items-center">
                            <div className="flex gap-4 flex-wrap flex-1 items-center">
                                <div className="relative flex-1 min-w-[250px] max-w-sm">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                                    <input type="text" placeholder="Cari Nama, NIK, atau ID Reg..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full normal-case pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm transition-all" />
                                </div>
                                <select value={filterCabor} onChange={(e) => setFilterCabor(e.target.value)} className="min-w-[200px] p-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm">
                                    {CABOR_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <button onClick={handleExportCSV} className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm"><FileTextIcon className="w-4 h-4"/> Export CSV</button>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white text-slate-500 text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-5 font-bold">Nama Lengkap & NIK</th>
                                        <th className="px-6 py-5 font-bold">Kategori & Cabor</th>
                                        <th className="px-6 py-5 font-bold">Status Berkas</th>
                                        <th className="px-6 py-5 font-bold text-right">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-16 text-slate-400 font-medium bg-slate-50/30 normal-case">Tidak ada data peserta yang ditemukan.</td></tr>
                                    ) : (
                                        filteredData.map(p => (
                                            <tr key={p.id} className="hover:bg-indigo-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 uppercase">{p.nama}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-500 font-mono opacity-80" title="NIK">{p.nik || 'N/A'}</span>
                                                        {p.id_registrasi && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{p.id_registrasi}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><div className="font-semibold text-slate-700 uppercase">{p.kategori}</div><div className="text-xs text-slate-500 mt-1 uppercase">{p.cabor}</div></td>
                                                <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setPesertaToEdit(p); setIsModalOpen(true); }} className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${p.status === 'Approved' ? 'text-slate-600 bg-white hover:bg-slate-100 border-slate-200 hover:border-slate-300 shadow-sm' : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 hover:border-indigo-300 shadow-sm hover:-translate-y-0.5'}`} title={p.status === 'Approved' ? 'Lihat Detail' : 'Perbaiki Data'}>
                                                            {p.status === 'Approved' ? <EyeIcon className="w-4 h-4"/> : <EditIcon className="w-4 h-4"/>}
                                                            <span className="hidden sm:inline">{p.status === 'Approved' ? 'DETAIL' : 'PERBAIKI'}</span>
                                                        </button>
                                                        {p.status !== 'Approved' && (
                                                            deleteConfirmId === p.id ? (
                                                                <div className="flex items-center gap-1 animate-in zoom-in-95">
                                                                    <button onClick={() => { onDelete(p.id); setDeleteConfirmId(null); }} className="px-2 py-1.5 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded font-bold transition">HAPUS?</button>
                                                                    <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1.5 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-bold transition">BATAL</button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 text-rose-500 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-lg shadow-sm transition-all hover:-translate-y-0.5" title="Hapus Data"><TrashIcon className="w-4 h-4"/></button>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            {isModalOpen && <AddPesertaModal regency={user.regency} initialData={pesertaToEdit} onClose={() => setIsModalOpen(false)} onSave={onSave} />}
            {isPasswordModalOpen && <ChangePasswordModal regency={user.regency} onClose={() => setIsPasswordModalOpen(false)} onChangePassword={onChangePassword} />}
        </div>
    );
}

function ChangePasswordModal({ regency, onClose, onChangePassword }) {
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if(!newPassword) return; onChangePassword(regency, newPassword); setMsg("Berhasil diubah!"); setTimeout(() => onClose(), 1500); };
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 uppercase">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-900 to-cyan-800 text-white">
                    <h2 className="font-bold text-lg tracking-wide">Keamanan Akun</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-slate-50/50">
                    <div><label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">Password Baru</label><input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full normal-case p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium outline-none shadow-sm transition-all" placeholder="Ketik password baru..." /></div>
                    {msg && <p className="text-emerald-500 text-xs font-bold">{msg}</p>}
                    <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm tracking-wide uppercase">Batal</button><button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 text-sm tracking-wide uppercase">Update</button></div>
                </form>
            </div>
        </div>
    );
}

function AddPesertaModal({ regency, initialData, onClose, onSave }) {
    const defaultForm = { 
        nama: '', nik: '', cabor: 'Bola Basket 5X5', kategori: 'Olahragawan',
        jenisKelamin: '', tempatLahir: '', tanggalLahir: '', 
        domisiliOrtu: '', asalSekolah: '', kelas: '', nisn: '', npsn: '', 
        asalSentra: '', namaKlub: '', bpjsKes: '', bpjsTk: '', lisensi: ''
    };
    const [formData, setFormData] = useState(initialData || defaultForm);
    const [docStatus, setDocStatus] = useState({});
    const [isSaving, setIsSaving] = useState(false); 
    const [errorMsg, setErrorMsg] = useState('');
    const [showDraftConfirm, setShowDraftConfirm] = useState(false);
    const isReadOnly = initialData?.status === 'Approved';
    const docsToShow = REQUIRED_DOCS.filter(doc => doc.categories.includes(formData.kategori));

    useEffect(() => {
        if (initialData) {
            const currentDocs = REQUIRED_DOCS.filter(doc => doc.categories.includes(initialData.kategori));
            const simulatedDocs = {};
            currentDocs.forEach(d => simulatedDocs[d.id] = 'File Tersedia ✓');
            setDocStatus(simulatedDocs);
        }
    }, [initialData]);

    const handleChange = (e) => {
        if (isReadOnly) return;
        const { name, value } = e.target;
        setErrorMsg(''); 
        setFormData(prev => {
            const newData = { ...prev };
            let finalValue = value;
            if (['nik', 'nisn', 'npsn'].includes(name)) finalValue = finalValue.replace(/[^0-9]/g, '');
            else if (['bpjsKes', 'bpjsTk'].includes(name)) finalValue = finalValue.replace(/[^0-9A-Z]/g, '').toUpperCase();
            if (['nama', 'tempatLahir', 'asalSekolah', 'namaKlub'].includes(name)) finalValue = finalValue.toUpperCase();
            newData[name] = finalValue;
            if (name === 'kategori') {
                if (finalValue === 'Official') newData.cabor = 'KETUA KONTINGEN';
                else newData.cabor = 'Bola Basket 5X5';
            }
            return newData;
        });
    };

    const handleFileUpload = async (e, docId) => {
        if (isReadOnly) return;
        const file = e.target.files[0];
        if (!file) return;

        let fileToUpload = file;
        if (file.type === 'application/pdf') {
            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > 1) {
                alert("GAGAL: File PDF terlalu besar (" + fileSizeMB.toFixed(2) + "MB). Maksimal hanya 1MB. Silakan kecilkan PDF Anda terlebih dahulu!");
                setDocStatus(prev => ({ ...prev, [docId]: "GAGAL: PDF > 1MB" }));
                return;
            }
        } else if (file.type.startsWith('image/')) {
            setDocStatus(prev => ({ ...prev, [docId]: "MENGOMPRES GAMBAR..." }));
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
            try {
                fileToUpload = await imageCompression(file, options);
                console.log(`Gambar dikompres: ${(file.size/1024).toFixed(0)}KB -> ${(fileToUpload.size/1024).toFixed(0)}KB`);
            } catch (error) { console.error("Gagal kompres:", error); }
        }

        setDocStatus(prev => ({ ...prev, [docId]: "SEDANG MENGUNGGAH..." }));
        try {
            const storageRef = ref(storage, `berkas/${DATABASE_ID}/${formData.nik || 'atlet'}/${docId}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, fileToUpload);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setFormData(prev => ({ ...prev, [docId + '_url']: downloadURL }));
            setDocStatus(prev => ({ ...prev, [docId]: `✓ BERHASIL DIUNGGAH` }));
        } catch (error) {
            console.error("GAGAL UPLOAD:", error);
            setDocStatus(prev => ({ ...prev, [docId]: "GAGAL UNGGAH!" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isReadOnly || isSaving) return;
        setErrorMsg('');
        if(!formData.nama || !formData.nik) return setErrorMsg("Nama dan NIK wajib diisi!");
        if (formData.nik.toString().length !== 16) return setErrorMsg("Peringatan: NIK harus terdiri dari tepat 16 digit angka!");
        if (formData.kategori === 'Olahragawan') {
            if (!formData.nisn || formData.nisn.toString().length !== 10) return setErrorMsg("Peringatan: NISN wajib 10 digit angka untuk Olahragawan!");
        }
        if (formData.kategori === 'Olahragawan' || formData.kategori === 'Pelatih') {
            if (formData.bpjsKes && formData.bpjsKes.toString().length !== 13) return setErrorMsg("Peringatan: No. BPJS Kesehatan wajib 13 karakter!");
        }
        if (formData.kategori === 'Olahragawan' && formData.tanggalLahir) {
            if (new Date(formData.tanggalLahir) < new Date('2009-01-01')) return setErrorMsg("PERINGATAN! Sesuai regulasi POPDA, batas usia paling tua kategori Atlet adalah kelahiran 1 Jan 2009. Sistem menolak data ini.");
        }

        const uploadedCount = docsToShow.filter(doc => docStatus[doc.id] && docStatus[doc.id].includes('✓')).length;
        if (uploadedCount < docsToShow.length) { setShowDraftConfirm(true); return; }
        executeSave();
    };

    const executeSave = () => {
        setIsSaving(true);
        setTimeout(() => { onSave({ ...formData, regency }); setIsSaving(false); onClose(); }, 500);
    };

    const inputClasses = `w-full p-3.5 border rounded-xl outline-none transition-all text-sm shadow-sm ${isReadOnly ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 hover:border-slate-300'}`;
    const labelClasses = "block text-[11px] font-bold text-slate-500 mb-1.5 tracking-wide flex justify-between";
    const getCounterColor = (current, target) => {
        if (!current) return 'text-slate-400';
        return current.toString().length === target ? 'text-emerald-500' : 'text-rose-500';
    };

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200 uppercase">
            <div className="bg-slate-50 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                <div className="p-6 bg-gradient-to-r from-indigo-900 to-cyan-800 text-white flex justify-between items-center shrink-0 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm hidden sm:block"><IdCardIcon className="w-6 h-6 text-cyan-300" /></div>
                        <div>
                            <h2 className="font-extrabold text-xl tracking-tight flex items-center gap-2">
                                {isReadOnly ? 'Detail Pendaftaran' : initialData ? 'Perbaiki Data Peserta' : 'Formulir Pendaftaran Baru'}
                                {initialData?.id_registrasi && <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono tracking-widest">{initialData.id_registrasi}</span>}
                            </h2>
                            <p className="text-cyan-200 text-xs font-medium mt-1">Kontingen {regency}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="relative z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth">
                        {errorMsg && (
                            <div className="bg-rose-100 text-rose-700 p-4 rounded-xl text-sm font-bold flex justify-between items-center shadow-sm animate-in fade-in">
                                <span className="uppercase">{errorMsg}</span>
                                <button type="button" onClick={() => setErrorMsg('')} className="bg-rose-200 hover:bg-rose-300 rounded px-2 py-1">&times;</button>
                            </div>
                        )}
                        {showDraftConfirm && (
                             <div className="bg-amber-100 border border-amber-200 text-amber-800 p-5 rounded-xl text-sm font-bold flex flex-col gap-4 shadow-sm animate-in zoom-in-95">
                                <p className="tracking-wide">Terdapat dokumen wajib yang belum lengkap. Tetap simpan sebagai Draft (Menunggu Verifikasi)?</p>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => { setShowDraftConfirm(false); executeSave(); }} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg shadow tracking-wider text-xs">Ya, Simpan Draft</button>
                                    <button type="button" onClick={() => setShowDraftConfirm(false)} className="bg-white hover:bg-amber-50 text-amber-800 px-5 py-2.5 rounded-lg shadow tracking-wider text-xs">Batal & Lengkapi</button>
                                </div>
                            </div>
                        )}
                        {initialData?.status === 'Revision' && initialData.catatan_revisi && (
                            <div className="p-5 bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200 rounded-2xl flex items-start gap-4 shadow-sm">
                                <div className="bg-rose-500 p-2 rounded-full shrink-0 shadow-sm"><AlertCircleIcon className="w-5 h-5 text-white" /></div>
                                <div><h4 className="font-bold text-rose-900 text-sm uppercase">Catatan Revisi dari Verifikator:</h4><p className="text-sm text-rose-800 mt-1.5 leading-relaxed uppercase">{initialData.catatan_revisi}</p></div>
                            </div>
                        )}

                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">A</div>
                                <h3 className="font-bold text-slate-800 text-lg tracking-wide">Informasi Dasar</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                
                                <div>
                                    <label className={labelClasses}><span>Kategori Peserta</span></label>
                                    <select name="kategori" value={formData.kategori} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} uppercase ${!isReadOnly && 'bg-indigo-50/50 text-indigo-900 font-bold border-indigo-200'}`}>
                                        <option value="Olahragawan">Olahragawan</option><option value="Pelatih">Pelatih</option><option value="Official">Official</option>
                                    </select>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className={labelClasses}><span>{formData.kategori === 'Official' ? 'Jabatan Kontingen' : 'Cabang Olahraga'}</span></label>
                                    <select name="cabor" value={formData.cabor} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} uppercase`}>
                                        {formData.kategori === 'Official' ? (
                                            <><option value="KETUA KONTINGEN">KETUA KONTINGEN</option><option value="SEKRETARIS KONTINGEN">SEKRETARIS KONTINGEN</option><option value="BENDAHARA KONTINGEN">BENDAHARA KONTINGEN</option><option value="ANGGOTA KONTINGEN">ANGGOTA KONTINGEN</option><option value="EKSTRA ANGGOTA KONTINGEN">EKSTRA ANGGOTA KONTINGEN</option></>
                                        ) : (
                                            <><option value="Bola Basket 5X5">Bola Basket 5X5</option><option value="Bola Voli">Bola Voli</option><option value="Sepak Bola">Sepak Bola</option><option value="Sepak Takraw">Sepak Takraw</option></>
                                        )}
                                    </select>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelClasses}><span>Nama Lengkap <span className="text-indigo-500 normal-case lowercase">(Otomatis Kapital)</span></span></label>
                                    <input type="text" name="nama" value={formData.nama} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} placeholder="Sesuai Akte Kelahiran" />
                                </div>
                                <div>
                                    <label className={labelClasses}>
                                        <span>NIK</span><span className={`font-mono ${getCounterColor(formData.nik, 16)}`}>{formData.nik ? formData.nik.toString().length : 0}/16 Digit</span>
                                    </label>
                                    <input type="text" inputMode="numeric" name="nik" value={formData.nik} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} placeholder="Nomor Induk Kependudukan" />
                                </div>
                                
                                <div>
                                    <label className={labelClasses}><span>Jenis Kelamin</span></label>
                                    <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} required disabled={isReadOnly} className={`${inputClasses} uppercase`}>
                                        <option value="" disabled>-- Pilih --</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}><span>Tempat Lahir</span></label>
                                    <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} placeholder="Nama Kota/Kabupaten" />
                                </div>
                                <div>
                                    <label className={labelClasses}><span>Tanggal Lahir</span> {formData.tanggalLahir && <span className="text-indigo-600 normal-case">(Usia: {calculateAge(formData.tanggalLahir)} Thn)</span>}</label>
                                    <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        {formData.kategori === 'Olahragawan' && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 md:p-8 rounded-2xl border border-blue-100/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 border-b border-blue-200/50 pb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">B</div><h3 className="font-bold text-blue-900 text-lg uppercase tracking-wide">Informasi Atlet</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="lg:col-span-2">
                                        <label className={labelClasses}><span>Asal Sekolah</span></label>
                                        <input type="text" name="asalSekolah" value={formData.asalSekolah} onChange={handleChange} readOnly={isReadOnly} className={inputClasses} placeholder="Tuliskan nama sekolah lengkap..." />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><span>NPSN</span></label>
                                        <input type="text" inputMode="numeric" name="npsn" value={formData.npsn} onChange={handleChange} readOnly={isReadOnly} className={inputClasses} placeholder="Nomor Pokok Sekolah Nasional" />
                                    </div>
                                    
                                    <div className="lg:col-span-2">
                                        <label className={labelClasses}><span>NISN</span><span className={`font-mono ${getCounterColor(formData.nisn, 10)}`}>{formData.nisn ? formData.nisn.toString().length : 0}/10 Digit</span></label>
                                        <input type="text" inputMode="numeric" name="nisn" value={formData.nisn} onChange={handleChange} readOnly={isReadOnly} className={inputClasses} placeholder="Nomor Induk Siswa Nasional" />
                                    </div>
                                    <div>
                                        <label className={labelClasses}><span>Kelas</span></label>
                                        <select name="kelas" value={formData.kelas} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} uppercase`}>
                                            <option value="" disabled>-- Pilih --</option><option value="Kelas VII">Kelas VII</option><option value="Kelas VIII">Kelas VIII</option><option value="Kelas IX">Kelas IX</option><option value="Kelas X">Kelas X</option><option value="Kelas XI">Kelas XI</option><option value="Kelas XII">Kelas XII</option>
                                        </select>
                                    </div>
                                    
                                    <div className={formData.asalSentra === 'KLUB' ? "lg:col-span-1" : "lg:col-span-3"}>
                                        <label className={labelClasses}><span>Asal Sentra/Klub</span></label>
                                        <select name="asalSentra" value={formData.asalSentra} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} uppercase`}>
                                            <option value="" disabled>-- Pilih --</option><option value="SPOBNAS">SPOBNAS</option><option value="SMANOR">SMANOR</option><option value="KLUB">KLUB</option>
                                        </select>
                                    </div>
                                    {formData.asalSentra === 'KLUB' && (
                                        <div className="lg:col-span-2 animate-in fade-in slide-in-from-top-2">
                                            <label className={labelClasses}><span>Nama Klub Olahraga</span></label>
                                            <input type="text" name="namaKlub" value={formData.namaKlub} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} border-blue-300 focus:ring-blue-500`} placeholder="Tuliskan nama klub..." />
                                        </div>
                                    )}
                                    
                                    <div className="lg:col-span-1 md:col-span-1">
                                        <label className={labelClasses}><span>BPJS Kesehatan</span><span className={`font-mono ${getCounterColor(formData.bpjsKes, 13)}`}>{formData.bpjsKes ? formData.bpjsKes.toString().length : 0}/13</span></label>
                                        <input type="text" name="bpjsKes" value={formData.bpjsKes} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} placeholder="Contoh: 0001234567890"/>
                                    </div>
                                    <div className="lg:col-span-2 md:col-span-1">
                                        <label className={labelClasses}><span>BPJS Ketenagakerjaan</span></label>
                                        <input type="text" name="bpjsTk" value={formData.bpjsTk} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} placeholder="Contoh 0001234567890" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {formData.kategori === 'Pelatih' && (
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-6 md:p-8 rounded-2xl border border-amber-100/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 border-b border-amber-200/50 pb-4"><div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">B</div><h3 className="font-bold text-amber-900 text-lg uppercase tracking-wide">Informasi Kepelatihan</h3></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div>
                                        <label className={labelClasses}><span>Level Lisensi</span></label>
                                        <select name="lisensi" value={formData.lisensi} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} uppercase`}>
                                            <option value="" disabled>-- Pilih Level --</option><option value="Kabupaten/Kota">Kabupaten/Kota</option><option value="Provinsi">Provinsi</option><option value="Nasional">Nasional</option><option value="Internasional">Internasional</option>
                                        </select>
                                    </div>
                                    <div><label className={labelClasses}><span>BPJS Kesehatan</span><span className={`font-mono ${getCounterColor(formData.bpjsKes, 13)}`}>{formData.bpjsKes ? formData.bpjsKes.toString().length : 0}/13 Karakter</span></label><input type="text" name="bpjsKes" value={formData.bpjsKes} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} placeholder="Contoh: 0001234567890"/></div>
                                    <div><label className={labelClasses}><span>BPJS Ketenagakerjaan</span></label><input type="text" name="bpjsTk" value={formData.bpjsTk} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} /></div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">C</div>
                                <div className="flex-1 flex justify-between items-end">
                                    <h3 className="font-bold text-slate-800 text-lg uppercase tracking-wide">Unggah Dokumen Berkas</h3>
                                    <div className="text-right"><span className="block text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full mb-1 tracking-wider">{isReadOnly ? 'Mode Lihat Saja' : 'Pdf Maks 1MB / File'}</span></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {docsToShow.map((doc, index) => {
                                    const isUploaded = docStatus[doc.id] && docStatus[doc.id].includes('✓');
                                    return (
                                        <label key={doc.id} className={`border rounded-xl p-4 bg-slate-50/50 transition-colors flex flex-col justify-between group cursor-pointer ${!isUploaded && !isReadOnly ? 'border-amber-200/60 bg-amber-50/30 hover:bg-amber-50' : 'border-slate-200/60 hover:bg-slate-50'} ${isReadOnly ? 'opacity-70 cursor-default' : ''}`}>
                                            <div className="block text-[10px] sm:text-xs font-bold text-slate-600 mb-3 leading-snug tracking-wide cursor-pointer">
                                                <span className="text-indigo-400 mr-1">{index + 1}.</span> {doc.label}
                                                {!isUploaded && !isReadOnly && <span className="text-rose-500 text-[9px] ml-2 animate-pulse">(Wajib)</span>}
                                            </div>
                                            <input type="file" className="hidden" accept="image/jpeg, image/png, application/pdf" disabled={isReadOnly} onChange={(e) => handleFileUpload(e, doc.id)} />
                                            <div className={`w-full border-2 border-dashed rounded-xl py-3 px-2 text-center transition-all flex flex-col items-center gap-2 tracking-wider ${isUploaded ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-300 group-hover:border-indigo-400 group-hover:bg-indigo-50/50 text-slate-500'}`}>
                                                {doc.id === 'foto' ? <CameraIcon className={`w-6 h-6 ${isUploaded ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} /> : <FileUpIcon className={`w-6 h-6 ${isUploaded ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} />}
                                                <span className="text-[10px] font-bold w-full truncate px-2">{docStatus[doc.id] ? docStatus[doc.id] : (isReadOnly ? 'Dokumen Kosong' : 'Pilih File')}</span>
                                                {formData[doc.id + '_url'] && (
                                                    <a href={formData[doc.id + '_url']} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-2 px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-full hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-sm w-fit mx-auto normal-case">
                                                        <EyeIcon className="w-3 h-3" /> CEK UNGGAHAN
                                                    </a>
                                                )}
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm shrink-0">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50 text-sm tracking-wide">
                            {isReadOnly ? 'Tutup Detail' : 'Batal'}
                        </button>
                        {!isReadOnly && !showDraftConfirm && (
                            <button type="submit" disabled={isSaving} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm tracking-wide">
                                {isSaving ? <><ClockIcon className="w-5 h-5 animate-spin" /> Menyimpan...</> : <><CheckCircleIcon className="w-5 h-5" /> Simpan Data</>}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// VIEW 3: ADMIN DASHBOARD
// ==========================================
function AdminDashboard({ data, onLogout, onUpdateStatus, onResetPassword, logos, setLogos, bgImages, setBgImages, onChangeAdminPassword, passwords, onSyncSettings }) {
    const [activeMenu, setActiveMenu] = useState('verifikasi');
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCabor, setFilterCabor] = useState("Semua Cabor");
    const [filterRegency, setFilterRegency] = useState('Semua Wilayah');
    const [filterStatus, setFilterStatus] = useState('Pending');
    
    const [verifikasiModalOpen, setVerifikasiModalOpen] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const [selectedForApproval, setSelectedForApproval] = useState([]);
    const [showBulkConfirm, setShowBulkConfirm] = useState(false);

    const [excludedFromPrint, setExcludedFromPrint] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);

    const total = data.length;
    const approvedParticipants = data.filter(p => p.status === 'Approved');
    const pending = data.filter(p => p.status === 'Pending').length;
    const revision = data.filter(p => p.status === 'Revision').length;
    const printCount = approvedParticipants.length - excludedFromPrint.length;

    const filteredData = data.filter(p => {
        const matchRegency = filterRegency === 'Semua Wilayah' || p.regency === filterRegency;
        const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
        const matchCabor = filterCabor === 'Semua Cabor' || p.cabor === filterCabor;
        const matchSearch = (p.nama && p.nama.toLowerCase().includes(searchTerm.toLowerCase())) || (p.nik && p.nik.includes(searchTerm)) || (p.id_registrasi && p.id_registrasi.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchRegency && matchStatus && matchCabor && matchSearch;
    }).sort((a,b) => b.timestamp - a.timestamp);

    const MenuBtn = ({ id, label, icon: Icon, activeColor }) => {
        const isActive = activeMenu === id;
        return (
            <button onClick={() => setActiveMenu(id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all tracking-wide text-xs ${isActive ? activeColor : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'}`}>
                <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} /> {label}
            </button>
        );
    };

    const handleExportCSV = () => {
        if (filteredData.length === 0) return;
        const headers = ['ID Registrasi', 'Wilayah', 'Nama Lengkap', 'NIK', 'NISN', 'Kategori', 'Cabor', 'Status Verifikasi'];
        const csvRows = [headers.join(',')];
        filteredData.forEach(p => {
            const row = [`"${p.id_registrasi || '-'}"`, `"${p.regency}"`, `"${p.nama}"`, `"${p.nik}"`, `"${p.nisn || '-'}"`, `"${p.kategori}"`, `"${p.cabor}"`, `"${p.status}"`];
            csvRows.push(row.join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        try {
            const link = document.createElement("a"); link.href = URL.createObjectURL(blob);
            link.download = `Database_POPDA_Sulteng.csv`; link.click();
        } catch(e) { console.error("Preview sandbox blocks file downloads."); }
    };

    const handleLogoUpload = async (e, index) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const storageRef = ref(storage, `pengaturan/logo_${index}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                const newLogos = [...logos];
                newLogos[index] = url;
                setLogos(newLogos);
                // SIMPAN KE CLOUD
                onSyncSettings({ logos: newLogos });
            } catch (err) { console.error(err); }
        }
    };

    const handleBgUpload = async (e, kategori) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const storageRef = ref(storage, `pengaturan/bg_${kategori}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                const newBgs = { ...bgImages, [kategori]: url };
                setBgImages(newBgs);
                // SIMPAN KE CLOUD
                onSyncSettings({ bgImages: newBgs });
            } catch (err) { console.error(err); }
        }
    };

    const handleTogglePrint = (id) => setExcludedFromPrint(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const handleIncludeAll = () => setExcludedFromPrint([]);
    const handleExcludeAll = () => setExcludedFromPrint(approvedParticipants.map(p => p.id));

    const handleResetWithToast = (regency) => { onResetPassword(regency); setToastMessage(`Sandi unit ${regency} berhasil direset ke default!`); setTimeout(() => setToastMessage(""), 4000); };
    const toggleSelectForApproval = (id) => setSelectedForApproval(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const handleSelectAllForApproval = (e) => { if (e.target.checked) { const pendingIds = filteredData.filter(p => p.status !== 'Approved').map(p => p.id); setSelectedForApproval(pendingIds); } else setSelectedForApproval([]); };
    
    const executeBulkApprove = () => {
        selectedForApproval.forEach(id => { onUpdateStatus(id, 'Approved'); });
        const count = selectedForApproval.length;
        setSelectedForApproval([]); setShowBulkConfirm(false); setToastMessage(`${count} Data berhasil diverifikasi massal!`); setTimeout(() => setToastMessage(""), 4000);
    };

    const getIdCardGradient = (kategori) => {
        if (kategori === 'Pelatih') return 'from-orange-700 via-red-700 to-rose-800'; 
        if (kategori === 'Official') return 'from-emerald-800 via-teal-700 to-cyan-800'; 
        return 'from-indigo-900 via-blue-900 to-cyan-800'; 
    };

    const getIdCardAccent = (kategori) => {
        if (kategori === 'Pelatih') return 'from-orange-400 to-rose-500';
        if (kategori === 'Official') return 'from-emerald-400 to-teal-500';
        return 'from-amber-400 to-amber-500';
    };

    return (
        <div className="flex h-screen uppercase bg-slate-50 overflow-hidden font-sans text-slate-800">
            {toastMessage && (
                <div className="fixed bottom-8 right-8 bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-6 fade-in duration-300">
                    <div className="bg-emerald-500/20 p-2 rounded-full"><CheckCircleIcon className="w-6 h-6 text-emerald-400" /></div>
                    <div><h4 className="text-white font-extrabold text-sm mb-0.5 tracking-wide">Berhasil!</h4><p className="text-emerald-100 text-xs font-medium tracking-wider">{toastMessage}</p></div>
                </div>
            )}

            <aside className="w-72 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white flex flex-col shadow-2xl z-20 print:hidden relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-48 bg-cyan-500/10 filter blur-3xl"></div>
                <div className="p-8 border-b border-white/10 text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/5 p-2">
                        {logos[0] ? <img src={logos[0]} alt="Logo Utama" className="w-full h-full object-contain drop-shadow-lg" /> : <ShieldIcon className="w-8 h-8 text-amber-400" />}
                    </div>
                    <h2 className="font-extrabold tracking-tight text-lg text-white">ADMIN PROVINSI</h2>
                    <p className="text-amber-400 text-[10px] font-bold tracking-widest mt-1">Pusat Verifikasi Data</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
                    <MenuBtn id="verifikasi" label="Verifikasi Berkas" icon={CheckCircleIcon} activeColor="bg-white/10 text-blue-400 border-l-4 border-blue-400 shadow-sm" />
                    <MenuBtn id="cetak" label="Cetak ID Card" icon={PrinterIcon} activeColor="bg-white/10 text-teal-400 border-l-4 border-teal-400 shadow-sm" />
                    <MenuBtn id="akun" label="Manajemen Akun" icon={ShieldIcon} activeColor="bg-white/10 text-amber-400 border-l-4 border-amber-400 shadow-sm" />
                    <MenuBtn id="pengaturan" label="Pengaturan Tampilan" icon={SettingsIcon} activeColor="bg-white/10 text-indigo-400 border-l-4 border-indigo-400 shadow-sm" />
                </nav>
                <div className="p-4 border-t border-white/10 relative z-10">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-all tracking-wide text-xs">
                        <LogOutIcon className="w-5 h-5" /> Keluar Sistem
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none z-0"></div>
                <header className="bg-white/80 backdrop-blur-md p-6 md:p-8 border-b border-slate-200/60 flex justify-between items-center shadow-sm z-10 print:hidden sticky top-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {activeMenu === 'verifikasi' && 'Dashboard Verifikasi'}
                            {activeMenu === 'cetak' && 'Pencetakan ID Card Peserta'}
                            {activeMenu === 'akun' && 'Manajemen Keamanan Akun'}
                            {activeMenu === 'pengaturan' && 'Pengaturan Tampilan Aplikasi'}
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1 normal-case">
                            {activeMenu === 'verifikasi' && 'Validasi silang dokumen pendaftaran 13 wilayah.'}
                            {activeMenu === 'cetak' && 'Pilih ID Card yang akan dicetak dengan mencentang kotak.'}
                            {activeMenu === 'akun' && 'Kelola ulang kata sandi standar untuk operator wilayah.'}
                            {activeMenu === 'pengaturan' && 'Unggah logo & background khusus untuk ID Card.'}
                        </p>
                    </div>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col z-10">
                    
                    {activeMenu === 'pengaturan' && (
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden flex flex-col">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
                                <h3 className="font-bold text-slate-700">Manajemen Logo Identitas Website</h3>
                                <p className="text-xs text-slate-500 mt-1 normal-case">Logo yang diunggah di sini akan otomatis berubah pada halaman Login, Sidebar, dan Header ID Card (Pencetakan).</p>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="w-full">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-widest text-center">Logo Utama (Kiri)</label>
                                    <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-6 text-center hover:bg-indigo-50 transition cursor-pointer relative min-h-[200px] flex items-center justify-center">
                                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 0)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {logos[0] ? <img src={logos[0]} alt="Logo 1" className="h-32 object-contain mx-auto drop-shadow-md" /> : <div className="py-4"><CameraIcon className="w-10 h-10 text-indigo-300 mx-auto mb-2" /><p className="text-sm font-bold text-indigo-500 tracking-wide">Pilih Logo Kiri</p></div>}
                                    </div>
                                    {logos[0] && <div className="text-center mt-3"><button onClick={() => {const l = [...logos]; l[0] = null; setLogos(l); onSyncSettings({ logos: l });}} className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-lg transition-colors tracking-wider">Hapus Logo Utama</button></div>}
                                </div>
                                <div className="w-full">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 tracking-widest text-center">Logo Sekunder (Kanan)</label>
                                    <div className="border-2 border-dashed border-cyan-200 bg-cyan-50/30 rounded-2xl p-6 text-center hover:bg-cyan-50 transition cursor-pointer relative min-h-[200px] flex items-center justify-center">
                                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 1)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {logos[1] ? <img src={logos[1]} alt="Logo 2" className="h-32 object-contain mx-auto drop-shadow-md" /> : <div className="py-4"><CameraIcon className="w-10 h-10 text-cyan-300 mx-auto mb-2" /><p className="text-sm font-bold text-cyan-500 tracking-wide">Pilih Logo Kanan</p><p className="text-xs text-cyan-400 font-medium mt-1 tracking-widest">(Opsional)</p></div>}
                                    </div>
                                    {logos[1] && <div className="text-center mt-3"><button onClick={() => {const l = [...logos]; l[1] = null; setLogos(l); onSyncSettings({ logos: l });}} className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-lg transition-colors tracking-wider">Hapus Logo Sekunder</button></div>}
                                </div>
                            </div>

                            <div className="p-5 border-b border-slate-100 bg-slate-50/80 shrink-0 border-t border-slate-200">
                                <h3 className="font-bold text-slate-700">Manajemen Background ID Card Khusus</h3>
                                <p className="text-xs text-slate-500 mt-1 normal-case">Unggah gambar vertikal (Portrait) berukuran proporsional 90x130mm. Desain bawaan (warna-warni) akan disembunyikan otomatis jika background ini diisi.</p>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {['Olahragawan', 'Pelatih', 'Official'].map(kategori => (
                                    <div key={kategori} className="w-full">
                                        <label className="block text-sm font-bold text-slate-700 mb-2 tracking-widest text-center">BG {kategori}</label>
                                        <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl p-4 text-center hover:bg-slate-100 transition cursor-pointer relative min-h-[250px] flex items-center justify-center overflow-hidden shadow-inner">
                                            <input type="file" accept="image/*" onChange={(e) => handleBgUpload(e, kategori)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {bgImages[kategori] ? (
                                                <>
                                                    <img src={bgImages[kategori]} alt={`BG ${kategori}`} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                                    <div className="relative z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                                                        <p className="text-xs font-bold text-emerald-600 tracking-wide">✓ Aktif</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-4 relative z-0">
                                                    <FileUpIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                    <p className="text-xs font-bold text-slate-500 tracking-wide">Pilih Desain BG</p>
                                                </div>
                                            )}
                                        </div>
                                        {bgImages[kategori] && (
                                            <div className="text-center mt-3">
                                                <button onClick={() => {const newBgs = {...bgImages, [kategori]: null}; setBgImages(newBgs); onSyncSettings({ bgImages: newBgs });}} className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-4 py-2 rounded-lg transition-colors tracking-wider shadow-sm border border-rose-100 hover:-translate-y-0.5">
                                                    Hapus Background
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeMenu === 'verifikasi' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 shrink-0">
                                <StatCard title="Total Pendaftar (Global)" value={total} type="neutral" />
                                <StatCard title="Telah Disetujui" value={approvedParticipants.length} type="success" />
                                <StatCard title="Antrean Periksa" value={pending} type="warning" />
                                <StatCard title="Butuh Perbaikan" value={revision} type="danger" />
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
                                
                                <div className="flex flex-col gap-4 p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                                    <div className="flex gap-4 flex-wrap items-center justify-between">
                                        <div className="relative flex-1 min-w-[250px] max-w-lg">
                                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                                            <input 
                                                type="text" 
                                                placeholder="Pencarian Cepat Nama / NIK / ID Reg..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full normal-case pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            {selectedForApproval.length > 0 && (
                                                showBulkConfirm ? (
                                                    <div className="flex gap-2 items-center bg-amber-100 px-4 py-2 rounded-xl shadow-sm animate-in zoom-in-95">
                                                        <span className="text-xs font-bold text-amber-800">Setujui {selectedForApproval.length} Data?</span>
                                                        <button onClick={executeBulkApprove} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition">YA</button>
                                                        <button onClick={() => setShowBulkConfirm(false)} className="px-3 py-1.5 bg-white text-amber-800 rounded text-xs font-bold transition hover:bg-amber-50">BATAL</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setShowBulkConfirm(true)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md shadow-indigo-500/30 transition-all hover:-translate-y-0.5 whitespace-nowrap animate-in fade-in tracking-wide text-xs">
                                                        <CheckCircleIcon className="w-4 h-4"/> Setujui ({selectedForApproval.length}) Terpilih
                                                    </button>
                                                )
                                            )}
                                            <button onClick={handleExportCSV} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                                                <FileTextIcon className="w-5 h-5"/> Export Data
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 flex-wrap">
                                        <select value={filterRegency} onChange={(e) => setFilterRegency(e.target.value)} className="flex-1 min-w-[150px] p-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm uppercase">
                                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <select value={filterCabor} onChange={(e) => setFilterCabor(e.target.value)} className="flex-1 min-w-[150px] p-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm uppercase">
                                            {CABOR_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 min-w-[150px] p-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/30 outline-none shadow-sm uppercase">
                                            <option value="Semua">Semua Status</option>
                                            <option value="Pending">Menunggu (Pending)</option>
                                            <option value="Approved">Disetujui (Approved)</option>
                                            <option value="Revision">Revisi (Revision)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="overflow-y-auto flex-1">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-slate-500 text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-6 py-5 w-12">
                                                    <input type="checkbox" className="w-4 h-4 accent-indigo-600 cursor-pointer rounded border-slate-300" onChange={handleSelectAllForApproval} checked={filteredData.filter(p => p.status !== 'Approved').length > 0 && selectedForApproval.length === filteredData.filter(p => p.status !== 'Approved').length} />
                                                </th>
                                                <th className="px-2 py-5 font-bold">Data Peserta & Profil</th>
                                                <th className="px-6 py-5 font-bold">Asal Kontingen</th>
                                                <th className="px-6 py-5 font-bold">Status Berkas</th>
                                                <th className="px-6 py-5 font-bold text-right">Tindakan Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredData.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-16 text-slate-400 font-medium bg-slate-50/30 normal-case">Tidak ada data pendaftaran yang sesuai dengan pencarian/filter.</td></tr>
                                            ) : (
                                                filteredData.map(p => (
                                                    <tr key={p.id} className={`transition-colors group ${p.status === 'Pending' ? 'bg-amber-50/20 hover:bg-amber-50/60' : 'hover:bg-indigo-50/30'}`}>
                                                        <td className="px-6 py-4">
                                                            {p.status !== 'Approved' && (
                                                                <input type="checkbox" className="w-4 h-4 accent-indigo-600 cursor-pointer rounded border-slate-300" checked={selectedForApproval.includes(p.id)} onChange={() => toggleSelectForApproval(p.id)} />
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-4">
                                                            <div className="font-extrabold text-slate-800 flex items-center gap-2">
                                                                {p.nama}
                                                                {p.tanggalLahir && <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${p.kategori === 'Olahragawan' && new Date(p.tanggalLahir) < new Date('2009-01-01') ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>UMUR: {calculateAge(p.tanggalLahir)}</span>}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-slate-500 font-medium">{p.kategori} <span className="mx-1 text-slate-300">•</span> {p.cabor}</span>
                                                                {p.id_registrasi && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{p.id_registrasi}</span>}
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-mono mt-0.5 normal-case">NIK. {p.nik}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-slate-600 text-xs tracking-wide">{p.regency}</td>
                                                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => { setSelectedParticipant(p); setVerifikasiModalOpen(true); }} className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ml-auto shadow-sm group-hover:-translate-y-0.5 tracking-wide ${p.status === 'Pending' ? 'text-blue-700 bg-blue-50 hover:bg-blue-600 hover:text-white border-blue-200' : 'text-slate-600 bg-white hover:bg-slate-100 border-slate-200'}`}>
                                                                <EyeIcon className="w-4 h-4"/> {p.status === 'Pending' ? 'Periksa' : 'Tinjau Detail'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {activeMenu === 'cetak' && (
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden flex flex-col h-full">
                            
                            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/80 shrink-0 print:hidden gap-4">
                                <div>
                                    <p className="font-bold text-slate-600 text-sm">Terdapat <span className="text-teal-600 text-xl mx-1">{printCount}</span> dari {approvedParticipants.length} peserta siap cetak.</p>
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={handleIncludeAll} className="text-xs font-bold bg-teal-100 text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-200 transition shadow-sm tracking-wide">Pilih Semua</button>
                                        <button onClick={handleExcludeAll} className="text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition shadow-sm tracking-wide">Batal Pilih Semua</button>
                                    </div>
                                </div>
                                <button onClick={() => { try { window.print() } catch(e) { console.error("Print blocked in sandbox"); } }} disabled={printCount === 0} className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:from-teal-600 hover:to-emerald-600 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed tracking-wide text-sm">
                                    <PrinterIcon className="w-5 h-5" /> Jalankan Mesin Cetak
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto flex-1 bg-slate-200/50 print:bg-white flex flex-wrap gap-8 justify-center content-start border-t border-slate-200/50">
                                <style>{`
                                    @media print {
                                        @page { margin: 10mm; }
                                        body * { visibility: hidden; }
                                        .print-container, .print-container * { 
                                            visibility: visible; 
                                            -webkit-print-color-adjust: exact !important; 
                                            print-color-adjust: exact !important;
                                        }
                                        .print-container { position: absolute; left: 0; top: 0; width: 100%; display: flex; flex-wrap: wrap; gap: 15px; justify-content: flex-start; }
                                    }
                                `}</style>
                                <div className="print-container flex flex-wrap gap-6 justify-center w-full">
                                    {approvedParticipants.length === 0 ? (
                                        <div className="text-center py-20 text-slate-400 font-bold print:hidden">Tidak ada ID Card yang memenuhi syarat cetak.</div>
                                    ) : (
                                        approvedParticipants.map(p => {
                                            const isExcluded = excludedFromPrint.includes(p.id);
                                            const hasCustomBg = !!bgImages[p.kategori];

                                            return (
                                                <div 
                                                    key={p.id} 
                                                    style={hasCustomBg ? { backgroundImage: `url(${bgImages[p.kategori]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                                    className={`w-[90mm] h-[130mm] ${hasCustomBg ? 'bg-transparent border-none' : 'bg-white border-slate-200'} rounded-[1.25rem] shadow-2xl shadow-slate-300/60 overflow-hidden flex flex-col relative shrink-0 transition-all duration-300 ${isExcluded ? 'opacity-40 grayscale scale-95 print:hidden' : 'print:shadow-none print:rounded-none'} print:border-slate-800 border`}
                                                >
                                                    <div className="absolute top-3 right-3 z-50 print:hidden bg-white/90 p-1.5 rounded-lg shadow-sm backdrop-blur-sm border border-slate-200">
                                                        <input type="checkbox" checked={!isExcluded} onChange={() => handleTogglePrint(p.id)} className="w-5 h-5 accent-teal-500 cursor-pointer block" />
                                                    </div>
                                                    
                                                    <div className={`h-[30mm] ${hasCustomBg ? 'bg-transparent' : `bg-gradient-to-br ${getIdCardGradient(p.kategori)}`} flex items-center justify-between px-3 text-white text-center shrink-0 relative overflow-hidden drop-shadow-md`}>
                                                        {!hasCustomBg && <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full filter blur-xl -translate-y-1/2 translate-x-1/4"></div>}
                                                        <div className="w-[16mm] flex items-center justify-center z-10">
                                                            {logos[0] && <img src={logos[0]} alt="L1" className="max-h-[16mm] max-w-[16mm] object-contain drop-shadow-md" />}
                                                        </div>
                                                        <div className="relative z-10 flex-1 px-1">
                                                            <h2 className="font-black text-[13.5px] tracking-widest leading-tight">POPDA XXIV</h2>
                                                            <p className="text-[7.5px] font-bold opacity-90 mt-1 tracking-[0.1em]">Provinsi Sulawesi Tengah 2026</p>
                                                        </div>
                                                        <div className="w-[16mm] flex items-center justify-center z-10">
                                                            {logos[1] && <img src={logos[1]} alt="L2" className="max-h-[16mm] max-w-[16mm] object-contain drop-shadow-md" />}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex justify-center -mt-6 shrink-0 relative z-20">
                                                        <div className="w-[32mm] h-[42mm] bg-slate-100 border-4 border-white shadow-lg flex flex-col items-center justify-center text-slate-400 rounded-xl overflow-hidden shrink-0">
                                                            {p.foto_url ? <img src={p.foto_url} alt="Foto" className="w-full h-full object-cover" /> : <><CameraIcon className="w-6 h-6 mb-1 opacity-50" /><span className="text-[8px] font-bold text-center">FOTO<br/>PESERTA</span></>}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 px-4 py-3 text-center flex flex-col justify-start relative z-10 mt-1">
                                                        <h3 className="font-black text-[14px] text-slate-900 leading-tight line-clamp-2 tracking-tight">{p.nama}</h3>
                                                        <div className="inline-block mx-auto mt-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full">
                                                            <p className="text-[10px] font-black text-slate-700 tracking-wider">{p.kategori}</p>
                                                        </div>
                                                        <p className="text-[9px] text-slate-500 font-bold mt-2 tracking-wide">{p.cabor}</p>
                                                    </div>
                                                    
                                                    <div className={`h-[25mm] ${hasCustomBg ? 'bg-transparent' : 'bg-slate-50 border-t border-slate-100'} shrink-0 flex items-center px-4 relative`}>
                                                        <div className="w-[18mm] h-[18mm] bg-white p-1 rounded-lg shadow-sm border border-slate-200 flex-shrink-0">
                                                            <img src={`https://quickchart.io/qr?text=${encodeURIComponent(`https://popda.sulteng.go.id/peserta/${p.id}`)}&size=100`} alt="QR" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <p className="text-[6px] text-slate-400 font-bold tracking-widest mb-0.5">ID Registrasi / Kontingen</p>
                                                            <p className="font-black text-[10px] text-indigo-600 leading-tight mb-0.5 tracking-wider normal-case">{p.id_registrasi}</p>
                                                            <p className="font-black text-[11px] text-slate-800 leading-tight line-clamp-1">{p.regency}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    {!hasCustomBg && <div className={`h-[4mm] w-full bg-gradient-to-r ${getIdCardAccent(p.kategori)} absolute bottom-0 shrink-0`}></div>}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeMenu === 'akun' && (
                        <div className="flex flex-col h-full gap-6">
                            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl shadow-xl shadow-indigo-900/20 flex flex-col sm:flex-row justify-between items-center p-6 border border-indigo-700/50 shrink-0">
                                <div className="text-white mb-4 sm:mb-0">
                                    <h3 className="font-extrabold text-lg flex items-center gap-2 tracking-wide"><ShieldIcon className="w-5 h-5 text-amber-400"/> Akun Admin Provinsi</h3>
                                    <p className="text-indigo-200 text-xs mt-1 font-medium normal-case">Ubah kata sandi akses utama Administrator Anda untuk keamanan ekstra.</p>
                                </div>
                                <button onClick={() => setIsAdminPasswordModalOpen(true)} className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20 hover:-translate-y-0.5 shadow-sm text-sm tracking-wide">
                                    Ubah Sandi Admin
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60 flex flex-col flex-1 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 bg-slate-50/80">
                                    <h3 className="font-bold text-slate-700 tracking-wide">Otoritas Akses Wilayah (Operator)</h3>
                                    <p className="text-xs text-slate-500 mt-1 normal-case">Kembalikan akses masuk ke sandi bawaan (default) jika operator lupa kata sandinya.</p>
                                </div>
                                <div className="overflow-y-auto flex-1">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-slate-500 text-[10px] tracking-wider border-b border-slate-200 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-4 font-bold">Wilayah Otoritas Operasional</th>
                                                <th className="px-6 py-4 font-bold">Kata Sandi Standar (Default)</th>
                                                <th className="px-6 py-4 font-bold text-right">Tindakan Sistem</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {REGIONS.filter(r => r !== 'Semua Wilayah').map(r => (
                                                <tr key={r} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-800">{r}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block border border-indigo-100 shadow-sm normal-case">{passwords[r]}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => handleResetWithToast(r)} className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-all hover:shadow-sm hover:-translate-y-0.5 tracking-wide">Reset Sandi</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {verifikasiModalOpen && <VerifikasiModal participant={selectedParticipant} onClose={() => setVerifikasiModalOpen(false)} onUpdateStatus={onUpdateStatus} />}
            {isAdminPasswordModalOpen && <ChangeAdminPasswordModal onClose={() => setIsAdminPasswordModalOpen(false)} onChangePassword={onChangeAdminPassword} />}
        </div>
    );
}

function ChangeAdminPasswordModal({ onClose, onChangePassword }) {
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if(!newPassword) return; onChangePassword(newPassword); setMsg("Sandi Admin berhasil diubah!"); setTimeout(() => onClose(), 1500); };
    return (
        <div className="fixed inset-0 uppercase bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100 border border-white/20">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white">
                    <h2 className="font-bold text-lg flex items-center gap-2 tracking-wide"><ShieldIcon className="w-5 h-5"/> Sandi Utama</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-slate-50/50">
                    <div><label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">Kata Sandi Baru</label><input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full normal-case p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium outline-none shadow-sm transition-all" placeholder="Ketik password baru admin..." /></div>
                    {msg && <p className="text-emerald-500 text-xs font-bold">{msg}</p>}
                    <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors text-sm tracking-wide">Batal</button><button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-0.5 text-sm tracking-wide">Ubah Sandi</button></div>
                </form>
            </div>
        </div>
    );
}

function VerifikasiModal({ participant, onClose, onUpdateStatus }) {
    const [isRejecting, setIsRejecting] = useState(false);
    const [catatanRevisi, setCatatanRevisi] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    if (!participant) return null;
    const docsToVerify = REQUIRED_DOCS.filter(doc => doc.categories.includes(participant.kategori));

    const handleReject = () => { if (!catatanRevisi.trim()) { setErrorMsg("Alasan revisi wajib ditulis!"); return; } onUpdateStatus(participant.id, 'Revision', catatanRevisi); onClose(); };
    const handleApprove = () => { onUpdateStatus(participant.id, 'Approved'); onClose(); };

    return (
        <div className="fixed inset-0 uppercase bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[95vh] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                <div className="p-6 bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-800 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm hidden sm:block"><EyeIcon className="w-6 h-6 text-cyan-300" /></div>
                        <div>
                            <h2 className="font-extrabold text-lg tracking-tight flex items-center gap-2">Validasi Berkas Fisik {participant.id_registrasi && <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-mono tracking-widest">{participant.id_registrasi}</span>}</h2>
                            <p className="text-cyan-200 text-xs font-medium mt-0.5 normal-case">Pemeriksaan manual data operator dan lampiran digital.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="relative z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">&times;</button>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50/50">
                    <div className="w-full md:w-5/12 bg-white p-6 md:p-8 border-r border-slate-200/60 overflow-y-auto shadow-sm z-10">
                        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-5 mb-8 pb-8 border-b border-slate-100 text-center xl:text-left">
                            <div className="w-28 h-36 bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center rounded-xl shrink-0 overflow-hidden">
                                {participant.foto_url ? <img src={participant.foto_url} alt="Foto" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} /> : <span className="text-xs text-slate-400 font-bold tracking-widest">FOTO</span>}
                            </div>
                            <div className="pt-2">
                                <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black tracking-widest rounded-full mb-3">{participant.regency}</div>
                                <h3 className="font-black text-2xl text-slate-900 leading-none mb-2">{participant.nama}</h3>
                                <p className="text-sm font-mono font-bold text-slate-500 mb-4 bg-slate-100 px-2 py-1 rounded inline-block normal-case">NIK. {participant.nik || 'Tidak Tersedia'}</p>
                                <div><StatusBadge status={participant.status} /></div>
                            </div>
                        </div>
                        
                        <h4 className="font-bold text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg tracking-widest mb-4 inline-block">Data Input Form</h4>
                        <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl">
                            <InfoRow label="Kategori">{participant.kategori}</InfoRow>
                            <InfoRow label="Cabor/Posisi">{participant.cabor}</InfoRow>
                            <InfoRow label="Kelamin">{participant.jenisKelamin}</InfoRow>
                            <InfoRow label="Lahir">
                                {participant.tempatLahir || '-'}, {participant.tanggalLahir || '-'}
                                {participant.tanggalLahir && <span className={`ml-2 inline-block px-2 py-0.5 font-black rounded text-[10px] ${participant.kategori === 'Olahragawan' && new Date(participant.tanggalLahir) < new Date('2009-01-01') ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>Usia: {calculateAge(participant.tanggalLahir)} THN</span>}
                            </InfoRow>
                            {participant.kategori === 'Olahragawan' && (
                                <><div className="my-2 border-t border-slate-200 border-dashed"></div><InfoRow label="Sekolah">{participant.asalSekolah}</InfoRow><InfoRow label="Kelas">{participant.kelas}</InfoRow><InfoRow label="NISN/NPSN" isMono>{`${participant.nisn || '-'} / ${participant.npsn || '-'}`}</InfoRow><InfoRow label="Klub/Sentra">{participant.asalSentra === 'KLUB' ? participant.namaKlub : participant.asalSentra}</InfoRow></>
                            )}
                            {participant.kategori === 'Pelatih' && (
                                <><div className="my-2 border-t border-slate-200 border-dashed"></div><InfoRow label="Lisensi">{participant.lisensi}</InfoRow></>
                            )}
                            {(participant.kategori === 'Olahragawan' || participant.kategori === 'Pelatih') && (
                                <><div className="my-2 border-t border-slate-200 border-dashed"></div><InfoRow label="BPJS Kes" isMono>{participant.bpjsKes}</InfoRow><InfoRow label="BPJS Naker" isMono>{participant.bpjsTk}</InfoRow></>
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full md:w-7/12 flex flex-col overflow-hidden">
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <h4 className="font-bold text-slate-800 mb-5 flex justify-between items-center tracking-wide">Arsip Digital <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-3 py-1 rounded-full tracking-wider">Simulasi Berkas</span></h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                                {docsToVerify.map((doc, idx) => (
                                    <div key={doc.id} className="p-4 border border-slate-200/70 bg-white rounded-2xl flex items-start gap-4 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                                        <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0 shadow-sm"><FileUpIcon className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 tracking-widest mb-1">Doc {idx + 1}</p>
                                            <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors">{doc.label}</p>
                                            {participant[doc.id + '_url'] ? <a href={participant[doc.id + '_url']} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-black mt-2 flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-2 py-1 rounded transition-all w-fit normal-case"><EyeIcon className="w-3.5 h-3.5"/> LIHAT DOKUMEN</a> : <p className="text-[10px] text-rose-500 font-bold mt-2 flex items-center gap-1 opacity-70"><AlertCircleIcon className="w-3 h-3"/> BELUM ADA FILE</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-6 md:p-8 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] shrink-0 z-20 relative">
                            {isRejecting ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <label className="block text-sm font-black text-rose-700 mb-2 tracking-wide">Alasan Penolakan / Permintaan Revisi:</label>
                                    {errorMsg && <p className="text-rose-500 text-xs font-bold mb-2">{errorMsg}</p>}
                                    <textarea className="w-full normal-case p-4 border border-rose-200 bg-rose-50/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:bg-white outline-none text-sm transition-all" rows="3" placeholder="Tuliskan secara spesifik dokumen apa yang kurang atau salah..." value={catatanRevisi} onChange={(e) => {setCatatanRevisi(e.target.value); setErrorMsg('');}} autoFocus></textarea>
                                    <div className="flex gap-3 justify-end mt-4"><button onClick={() => setIsRejecting(false)} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors tracking-wide text-sm">Batal</button><button onClick={handleReject} className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-700 flex items-center gap-2 hover:-translate-y-0.5 transition-all tracking-wide text-sm">Kirim Notifikasi Revisi</button></div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-extrabold text-slate-800 mb-4 tracking-widest text-center">Keputusan Verifikasi Akhir</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsRejecting(true)} className="flex-1 py-3.5 bg-white border-2 border-rose-500 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:-translate-y-0.5 shadow-sm transition-all flex justify-center items-center gap-2 tracking-wide text-sm"><AlertCircleIcon className="w-5 h-5" /> Tolak & Revisi</button>
                                        <button onClick={handleApprove} className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 tracking-wide text-sm"><CheckCircleIcon className="w-5 h-5" /> Validasi & Setujui Dokumen</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, type }) {
    const styling = {
        neutral: 'bg-white border-slate-200/60 shadow-indigo-500/5',
        success: 'bg-gradient-to-br from-emerald-50/50 to-white border-emerald-100 shadow-emerald-500/5',
        warning: 'bg-gradient-to-br from-amber-50/50 to-white border-amber-100 shadow-amber-500/5',
        danger: 'bg-gradient-to-br from-rose-50/50 to-white border-rose-100 shadow-rose-500/5'
    };
    const textColors = { neutral: 'text-indigo-900', success: 'text-emerald-700', warning: 'text-amber-700', danger: 'text-rose-700' };

    return (
        <div className={`p-6 rounded-2xl border shadow-lg ${styling[type]} relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${type === 'neutral' ? 'bg-indigo-400' : type === 'success' ? 'bg-emerald-400' : type === 'warning' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest mb-1.5">{title}</p>
            <p className={`text-4xl font-black tracking-tight ${textColors[type]}`}>{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const badges = {
        Approved: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-emerald-100/80 text-emerald-700 border border-emerald-200"><CheckCircleIcon className="w-3.5 h-3.5"/> Berkas Disetujui</span>,
        Pending: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-amber-100/80 text-amber-700 border border-amber-200"><ClockIcon className="w-3.5 h-3.5 animate-pulse"/> Menunggu Verifikasi</span>,
        Revision: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-rose-100/80 text-rose-700 border border-rose-200"><AlertCircleIcon className="w-3.5 h-3.5"/> Butuh Revisi Form</span>
    };
    return badges[status] || <span>{status}</span>;
}
