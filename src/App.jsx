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
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/5 last:border-0 items-center">
        <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wide">{label}</div>
        <div className={`col-span-2 text-sm font-semibold text-white ${isMono ? 'font-mono text-blue-300' : ''}`}>{children || '-'}</div>
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
        const settingsRef = doc(db, 'settings', 'app_config');
        const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.logos) setLogos(data.logos);
                if (data.bgImages) setBgImages(data.bgImages);
                if (data.passwords) setPasswords(data.passwords);
                if (data.adminPassword) setAdminPassword(data.adminPassword);
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

    const handleChangePassword = (regency, newPassword) => {
        const newPasswordsObj = { ...passwords, [regency]: newPassword };
        setPasswords(newPasswordsObj);
        handleUpdateGlobalSettings({ passwords: newPasswordsObj });
    };

    const handleResetPassword = (regency) => {
        const newPasswordsObj = { ...passwords, [regency]: DEFAULT_PASSWORDS[regency] };
        setPasswords(newPasswordsObj);
        handleUpdateGlobalSettings({ passwords: newPasswordsObj });
    };

    const handleChangeAdminPassword = (newPass) => {
        setAdminPassword(newPass);
        handleUpdateGlobalSettings({ adminPassword: newPass });
    };

    const handleResetAdminPassword = () => {
        const defaultAdminPass = "AdminPOPDA2026";
        setAdminPassword(defaultAdminPass);
        handleUpdateGlobalSettings({ adminPassword: defaultAdminPass });
    };

    if (view === 'login') return <LoginScreen onLogin={handleLogin} passwords={passwords} adminPassword={adminPassword} onResetAdmin={handleResetAdminPassword} logos={logos} />;
    if (view === 'operator') return <OperatorDashboard user={currentUser} data={pesertaList} onLogout={handleLogout} onSave={handleSavePeserta} onDelete={handleDeletePeserta} onChangePassword={handleChangePassword} logos={logos} />;
    if (view === 'admin') return <AdminDashboard data={pesertaList} onLogout={handleLogout} onUpdateStatus={handleUpdateStatus} onResetPassword={handleResetPassword} logos={logos} setLogos={setLogos} bgImages={bgImages} setBgImages={setBgImages} onChangeAdminPassword={handleChangeAdminPassword} passwords={passwords} onSyncSettings={handleUpdateGlobalSettings} />;
    
    return null;
}

// ==========================================
// VIEW 1: LOGIN SCREEN (GLASSMORPHISM)
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
        <div className="min-h-screen uppercase bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" style={{ animationDelay: '2s' }}></div>

            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-[540px] p-8 md:p-10 text-center border border-white/10 relative z-10 transform transition-all">
                <div className="flex justify-center items-center gap-6 mb-6 h-20 cursor-pointer" onClick={handleLogoClick}>
                    {logos[0] ? <img src={logos[0]} alt="Logo 1" className="h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform" /> : (!logos[1] && <div className="h-16 w-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-lg"><ShieldIcon className="w-8 h-8 text-blue-400" /></div>)}
                    {logos[1] && <img src={logos[1]} alt="Logo 2" className="h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform" />}
                </div>
                
                <h2 className="text-xs md:text-sm font-bold text-blue-400 tracking-[0.3em] mb-3">Pendaftaran</h2>
                <h1 className="text-2xl sm:text-[28px] md:text-[32px] font-black text-white tracking-tight leading-tight mb-1 whitespace-nowrap">POPDA XXIV 2026 BUOL</h1>
                <p className="text-slate-400 text-sm sm:text-[15px] md:text-[17px] font-black tracking-[0.16em] mb-8 whitespace-nowrap">SULTENG NAMBASO</p>
                
                <div className="space-y-5">
                    {showAdmin && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500 bg-black/40 p-5 rounded-2xl mb-4 border border-amber-500/30 shadow-inner text-left backdrop-blur-md">
                            {isRecovering ? (
                                <div className="animate-in fade-in">
                                    <label className="block text-xs font-bold text-teal-400 mb-2 tracking-wide">Pemulihan Sandi Admin</label>
                                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed normal-case">Masukkan Kode Master Rahasia (Developer Key) untuk mengembalikan sandi ke pengaturan pabrik.</p>
                                    <input type="password" value={recoveryKey} onChange={(e) => { setRecoveryKey(e.target.value); setRecoveryMessage(''); }} placeholder="Kode pemulihan..." className="w-full normal-case p-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 bg-white/5 text-white text-sm mb-3 outline-none transition-all" />
                                    {recoveryMessage && <p className={`text-xs font-bold mb-3 ${recoveryMessage.includes('Berhasil') ? 'text-teal-400' : 'text-rose-400'}`}>{recoveryMessage}</p>}
                                    <div className="flex gap-2">
                                        <button onClick={() => setIsRecovering(false)} className="px-4 py-3 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl font-bold transition-all text-xs border border-white/10">Batal</button>
                                        <button onClick={handleRecoverySubmit} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">Validasi Kode</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="block text-xs font-bold text-amber-400 tracking-wide">Sandi Admin Provinsi</label>
                                        <button onClick={() => setIsRecovering(true)} className="text-[10px] font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer">Lupa Sandi?</button>
                                    </div>
                                    <input type="password" value={adminPasswordInput} onChange={(e) => { setAdminPasswordInput(e.target.value); setLoginError(''); }} placeholder="Masukkan sandi admin..." className="w-full normal-case p-3.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-white/5 text-white text-sm mb-3 outline-none transition-all" />
                                    <button onClick={handleAdminLogin} disabled={!adminPasswordInput} className="w-full bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/40 text-amber-300 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ShieldIcon className="w-5 h-5" /> Masuk sebagai Admin Provinsi
                                    </button>
                                </>
                            )}
                            <div className="relative py-4 mt-2">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                                <div className="relative flex justify-center text-xs font-bold tracking-wider"><span className="px-3 bg-[#0a1122] text-slate-500 rounded-full border border-white/5">Atau Akses Operator</span></div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 text-left shadow-lg">
                        <label className="block text-xs font-bold text-slate-400 mb-2 tracking-wide pl-1">Pilih Wilayah Operasional</label>
                        <select value={selectedRegency} onChange={(e) => { setSelectedRegency(e.target.value); setLoginError(''); }} className="w-full p-4 border border-white/10 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 mb-4 bg-[#0a1122] text-white text-sm shadow-sm transition-all outline-none font-bold uppercase appearance-none cursor-pointer">
                            <option value="" disabled>-- Pilih Kabupaten/Kota --</option>
                            {REGIONS.filter(r => r !== 'Semua Wilayah').map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <label className="block text-xs font-bold text-slate-400 mb-2 tracking-wide pl-1">Kata Sandi (Password)</label>
                        <input type="password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setLoginError(''); }} placeholder="Masukkan kata sandi unit daerah..." className={`w-full normal-case p-4 border rounded-2xl focus:ring-4 outline-none mb-2 bg-[#0a1122] text-white text-sm shadow-sm transition-all font-medium ${loginError ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/10 focus:ring-blue-500/20 focus:border-blue-500'}`} />
                        {loginError && <p className="text-rose-400 text-xs font-bold mb-3 flex items-center gap-1 pl-1"><AlertCircleIcon className="w-3 h-3"/> {loginError}</p>}
                        <button onClick={handleOperatorLogin} disabled={!selectedRegency} className={`w-full font-bold py-4 px-4 rounded-2xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2 ${selectedRegency ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:-translate-y-1' : 'bg-white/5 border border-white/5 text-slate-500 cursor-not-allowed'}`}>
                            <UsersIcon className="w-5 h-5" /> Masuk Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VIEW 2: OPERATOR DASHBOARD (BENTO GLASS)
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
        <div className="flex h-screen bg-[#020617] overflow-hidden font-sans text-slate-200 uppercase relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[0%] left-[-5%] w-[30%] h-[30%] bg-indigo-900/20 blur-[100px] rounded-full"></div>
            </div>

            <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl z-20 relative">
                <div className="p-8 border-b border-white/10 text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-blue-500/10 p-2 border border-blue-500/20 shadow-lg">
                        {logos[0] ? <img src={logos[0]} alt="Logo" className="w-full h-full object-contain drop-shadow-lg" /> : <ShieldIcon className="w-8 h-8 text-blue-400" />}
                    </div>
                    <h2 className="font-extrabold text-xl tracking-tight text-white whitespace-nowrap">POPDA XXIV</h2>
                    <p className="text-blue-400 text-[10px] font-bold tracking-widest mt-1 opacity-80">Operator {user.regency}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 bg-blue-500/20 text-blue-100 rounded-xl font-semibold border border-blue-500/30 shadow-sm transition-all"><UsersIcon className="w-5 h-5 opacity-80 text-blue-400" /> Data Peserta</button>
                    <button onClick={() => setIsPasswordModalOpen(true)} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"><ShieldIcon className="w-5 h-5 opacity-80" /> Keamanan Akun</button>
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-all"><LogOutIcon className="w-5 h-5" /> Keluar Sistem</button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                <header className="bg-white/5 backdrop-blur-md p-6 border-b border-white/10 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Manajemen Kontingen</h1>
                        <p className="text-slate-400 text-sm font-medium mt-0.5 normal-case">Kelola dan tinjau pendaftaran dari wilayah Anda.</p>
                    </div>
                    <button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"><PlusIcon className="w-5 h-5" /> Tambah Peserta</button>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/10 p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-sm font-bold mb-3"><span className="text-slate-400">Kesiapan Berkas ({user.regency})</span><span className="text-emerald-400">{progressPercentage}% Selesai Diverifikasi</span></div>
                            <div className="w-full bg-white/10 rounded-full h-3.5 overflow-hidden shadow-inner border border-white/5"><div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercentage}%` }}></div></div>
                        </div>
                        <div className="text-xs text-slate-400 font-bold bg-black/20 px-6 py-4 rounded-2xl border border-white/5 text-center min-w-[160px] shadow-sm">
                            <span className="text-2xl text-white block mb-0.5">{approved} / {total}</span> Atlet Siap Tanding
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                        <StatCard title="Total Pendaftar" value={total} type="neutral" />
                        <StatCard title="Menunggu Verifikasi" value={pending} type="warning" />
                        <StatCard title="Butuh Revisi" value={revision} type="danger" />
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 flex-1 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex flex-wrap gap-4 bg-transparent shrink-0 justify-between items-center">
                            <div className="flex gap-4 flex-wrap flex-1 items-center">
                                <div className="relative flex-1 min-w-[250px] max-w-sm">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"/>
                                    <input type="text" placeholder="Cari Nama, NIK, atau ID Reg..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full normal-case pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all" />
                                </div>
                                <select value={filterCabor} onChange={(e) => setFilterCabor(e.target.value)} className="min-w-[200px] p-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm appearance-none cursor-pointer">
                                    {CABOR_LIST.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                                </select>
                            </div>
                            <button onClick={handleExportCSV} className="px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm"><FileTextIcon className="w-4 h-4"/> Export CSV</button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2">
                            <table className="w-full text-left text-sm">
                                <thead className="text-slate-400 text-[10px] tracking-widest border-b border-white/10 sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md">
                                    <tr>
                                        <th className="px-6 py-5 font-bold uppercase">Nama Lengkap & NIK</th>
                                        <th className="px-6 py-5 font-bold uppercase">Kategori & Cabor</th>
                                        <th className="px-6 py-5 font-bold uppercase">Status Berkas</th>
                                        <th className="px-6 py-5 font-bold text-right uppercase">Tindakan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredData.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-16 text-slate-500 font-medium normal-case">Tidak ada data peserta yang ditemukan.</td></tr>
                                    ) : (
                                        filteredData.map(p => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="font-bold text-white uppercase">{p.nama}</div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-slate-500 font-mono opacity-80" title="NIK">{p.nik || 'N/A'}</span>
                                                        {p.id_registrasi && <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{p.id_registrasi}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5"><div className="font-semibold text-slate-300 uppercase">{p.kategori}</div><div className="text-xs text-slate-500 mt-1 uppercase">{p.cabor}</div></td>
                                                <td className="px-6 py-5"><StatusBadge status={p.status} /></td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setPesertaToEdit(p); setIsModalOpen(true); }} className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-sm ${p.status === 'Approved' ? 'text-slate-400 bg-white/5 hover:bg-white/10 border-white/10' : 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:-translate-y-0.5'}`} title={p.status === 'Approved' ? 'Lihat Detail' : 'Perbaiki Data'}>
                                                            {p.status === 'Approved' ? <EyeIcon className="w-4 h-4"/> : <EditIcon className="w-4 h-4"/>}
                                                            <span className="hidden sm:inline">{p.status === 'Approved' ? 'DETAIL' : 'PERBAIKI'}</span>
                                                        </button>
                                                        {p.status !== 'Approved' && (
                                                            deleteConfirmId === p.id ? (
                                                                <div className="flex items-center gap-1 animate-in zoom-in-95">
                                                                    <button onClick={() => { onDelete(p.id); setDeleteConfirmId(null); }} className="px-3 py-2 text-[10px] bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition shadow-sm">HAPUS?</button>
                                                                    <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-2 text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg font-bold transition border border-white/10">BATAL</button>
                                                                </div>
                                                            ) : (
                                                                <button onClick={() => setDeleteConfirmId(p.id)} className="p-2.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl shadow-sm transition-all hover:-translate-y-0.5" title="Hapus Data"><TrashIcon className="w-4 h-4"/></button>
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
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 uppercase">
            <div className="bg-[#0a1526] rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden transform transition-all scale-100 border border-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 text-white">
                    <h2 className="font-bold text-lg tracking-wide text-blue-400">Keamanan Akun</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-transparent">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 tracking-wide">Password Baru</label>
                        <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full normal-case p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-medium outline-none shadow-sm transition-all text-white" placeholder="Ketik password baru..." />
                    </div>
                    {msg && <p className="text-emerald-400 text-xs font-bold">{msg}</p>}
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-slate-400 font-bold hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all text-sm tracking-wide uppercase">Batal</button>
                        <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm tracking-wide uppercase">Update</button>
                    </div>
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
        
        // 1. Cek apakah file adalah PDF
        if (file.type === 'application/pdf') {
            const fileSizeMB = file.size / 1024 / 1024;
            if (fileSizeMB > 1) {
                alert("GAGAL: File PDF terlalu besar (" + fileSizeMB.toFixed(2) + "MB). Maksimal hanya 1MB. Silakan kecilkan PDF Anda terlebih dahulu!");
                setDocStatus(prev => ({ ...prev, [docId]: "GAGAL: PDF > 1MB" }));
                return;
            }
        // 2. Cek apakah file adalah Gambar (JPG/PNG dll)
        } else if (file.type.startsWith('image/')) {
            setDocStatus(prev => ({ ...prev, [docId]: "MENGOMPRES GAMBAR..." }));
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
            try {
                fileToUpload = await imageCompression(file, options);
                console.log(`Gambar dikompres: ${(file.size/1024).toFixed(0)}KB -> ${(fileToUpload.size/1024).toFixed(0)}KB`);
            } catch (error) { 
                console.error("Gagal kompres:", error); 
            }
        // 3. JIKA BUKAN PDF ATAU GAMBAR, TOLAK!
        } else {
            alert("GAGAL: Format file tidak didukung! Harap unggah Gambar (JPG/PNG) atau PDF.");
            setDocStatus(prev => ({ ...prev, [docId]: "FORMAT TIDAK VALID" }));
            return; 
        }

        // 4. Proses Upload ke Firebase Storage
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

    const inputClasses = `w-full p-4 bg-white/5 backdrop-blur-md rounded-xl outline-none transition-all text-sm shadow-sm ${isReadOnly ? 'border-white/5 text-slate-500 cursor-not-allowed' : 'border-white/10 text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-white/20 appearance-none'}`;
    const labelClasses = "block text-[11px] font-bold text-slate-400 mb-2 tracking-widest uppercase flex justify-between";
    const getCounterColor = (current, target) => {
        if (!current) return 'text-slate-500';
        return current.toString().length === target ? 'text-emerald-400' : 'text-rose-400';
    };

    return (
        <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200 uppercase">
            <div className="bg-[#0a1526] rounded-[2.5rem] w-full max-w-5xl shadow-2xl shadow-blue-900/20 overflow-hidden flex flex-col max-h-[95vh] border border-white/10 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px] pointer-events-none"></div>
                
                <div className="p-8 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/20 p-3 rounded-2xl backdrop-blur-sm hidden sm:block border border-blue-500/30"><IdCardIcon className="w-6 h-6 text-blue-400" /></div>
                        <div>
                            <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-3">
                                {isReadOnly ? 'Detail Pendaftaran' : initialData ? 'Perbaiki Data Peserta' : 'Formulir Pendaftaran Baru'}
                                {initialData?.id_registrasi && <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-3 py-1 rounded-full font-mono tracking-widest">{initialData.id_registrasi}</span>}
                            </h2>
                            <p className="text-slate-400 text-xs font-bold mt-1 tracking-widest">Kontingen {regency}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-full transition-all">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden relative z-10">
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scroll-smooth">
                        {errorMsg && (
                            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-5 rounded-2xl text-sm font-bold flex justify-between items-center shadow-sm animate-in fade-in">
                                <span className="uppercase">{errorMsg}</span>
                                <button type="button" onClick={() => setErrorMsg('')} className="bg-rose-500/20 hover:bg-rose-500/40 rounded-lg px-3 py-1.5 transition-colors">&times;</button>
                            </div>
                        )}
                        {showDraftConfirm && (
                             <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-6 rounded-2xl text-sm font-bold flex flex-col gap-5 shadow-sm animate-in zoom-in-95">
                                <p className="tracking-wide text-base">Terdapat dokumen wajib yang belum lengkap. Tetap simpan sebagai Draft (Menunggu Verifikasi)?</p>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => { setShowDraftConfirm(false); executeSave(); }} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl shadow-lg tracking-wider text-xs transition-all">Ya, Simpan Draft</button>
                                    <button type="button" onClick={() => setShowDraftConfirm(false)} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-3 rounded-xl shadow tracking-wider text-xs transition-all">Batal & Lengkapi</button>
                                </div>
                            </div>
                        )}
                        {initialData?.status === 'Revision' && initialData.catatan_revisi && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-5 shadow-sm">
                                <div className="bg-rose-500/20 p-3 rounded-2xl shrink-0 shadow-sm border border-rose-500/30"><AlertCircleIcon className="w-6 h-6 text-rose-400" /></div>
                                <div><h4 className="font-bold text-rose-400 text-sm uppercase tracking-widest mb-1.5">Catatan Revisi dari Verifikator:</h4><p className="text-sm text-white/90 leading-relaxed uppercase bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">{initialData.catatan_revisi}</p></div>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/10">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-5">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">A</div>
                                <h3 className="font-black text-white text-xl tracking-widest">Informasi Dasar</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                
                                <div>
                                    <label className={labelClasses}><span>Kategori Peserta</span></label>
                                    <select name="kategori" value={formData.kategori} onChange={handleChange} disabled={isReadOnly} className={`${inputClasses} ${!isReadOnly && 'bg-blue-500/10 text-blue-300 font-bold border-blue-500/30'}`}>
                                        <option value="Olahragawan" className="bg-[#0a1526]">Olahragawan</option><option value="Pelatih" className="bg-[#0a1526]">Pelatih</option><option value="Official" className="bg-[#0a1526]">Official</option>
                                    </select>
                                </div>
                                <div className="lg:col-span-2">
                                    <label className={labelClasses}><span>{formData.kategori === 'Official' ? 'Jabatan Kontingen' : 'Cabang Olahraga'}</span></label>
                                    <select name="cabor" value={formData.cabor} onChange={handleChange} disabled={isReadOnly} className={inputClasses}>
                                        {formData.kategori === 'Official' ? (
                                            <><option value="KETUA KONTINGEN" className="bg-[#0a1526]">KETUA KONTINGEN</option><option value="SEKRETARIS KONTINGEN" className="bg-[#0a1526]">SEKRETARIS KONTINGEN</option><option value="BENDAHARA KONTINGEN" className="bg-[#0a1526]">BENDAHARA KONTINGEN</option><option value="ANGGOTA KONTINGEN" className="bg-[#0a1526]">ANGGOTA KONTINGEN</option><option value="EKSTRA ANGGOTA KONTINGEN" className="bg-[#0a1526]">EKSTRA ANGGOTA KONTINGEN</option></>
                                        ) : (
                                            <><option value="Bola Basket 5X5" className="bg-[#0a1526]">Bola Basket 5X5</option><option value="Bola Voli" className="bg-[#0a1526]">Bola Voli</option><option value="Sepak Bola" className="bg-[#0a1526]">Sepak Bola</option><option value="Sepak Takraw" className="bg-[#0a1526]">Sepak Takraw</option></>
                                        )}
                                    </select>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className={labelClasses}><span>Nama Lengkap <span className="text-blue-400 normal-case lowercase">(Otomatis Kapital)</span></span></label>
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
                                    <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} required disabled={isReadOnly} className={inputClasses}>
                                        <option value="" disabled className="bg-[#0a1526]">-- Pilih --</option><option value="Laki-laki" className="bg-[#0a1526]">Laki-laki</option><option value="Perempuan" className="bg-[#0a1526]">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}><span>Tempat Lahir</span></label>
                                    <input type="text" name="tempatLahir" value={formData.tempatLahir} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} placeholder="Nama Kota/Kabupaten" />
                                </div>
                                <div>
                                    <label className={labelClasses}><span>Tanggal Lahir</span> {formData.tanggalLahir && <span className="text-blue-400 normal-case bg-blue-500/10 px-2 py-0.5 rounded">(Usia: {calculateAge(formData.tanggalLahir)} Thn)</span>}</label>
                                    <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} required readOnly={isReadOnly} className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        {formData.kategori === 'Olahragawan' && (
                            <div className="bg-indigo-900/20 backdrop-blur-xl border border-indigo-500/20 p-8 rounded-[2rem] shadow-xl">
                                <div className="flex items-center gap-4 mb-8 border-b border-indigo-500/20 pb-5">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm shadow-md">B</div><h3 className="font-black text-white text-xl uppercase tracking-widest">Informasi Atlet</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        <select name="kelas" value={formData.kelas} onChange={handleChange} disabled={isReadOnly} className={inputClasses}>
                                            <option value="" disabled className="bg-[#0a1526]">-- Pilih --</option><option value="Kelas VII" className="bg-[#0a1526]">Kelas VII</option><option value="Kelas VIII" className="bg-[#0a1526]">Kelas VIII</option><option value="Kelas IX" className="bg-[#0a1526]">Kelas IX</option><option value="Kelas X" className="bg-[#0a1526]">Kelas X</option><option value="Kelas XI" className="bg-[#0a1526]">Kelas XI</option><option value="Kelas XII" className="bg-[#0a1526]">Kelas XII</option>
                                        </select>
                                    </div>
                                    
                                    <div className={formData.asalSentra === 'KLUB' ? "lg:col-span-1" : "lg:col-span-3"}>
                                        <label className={labelClasses}><span>Asal Sentra/Klub</span></label>
                                        <select name="asalSentra" value={formData.asalSentra} onChange={handleChange} disabled={isReadOnly} className={inputClasses}>
                                            <option value="" disabled className="bg-[#0a1526]">-- Pilih --</option><option value="SPOBNAS" className="bg-[#0a1526]">SPOBNAS</option><option value="SMANOR" className="bg-[#0a1526]">SMANOR</option><option value="KLUB" className="bg-[#0a1526]">KLUB</option>
                                        </select>
                                    </div>
                                    {formData.asalSentra === 'KLUB' && (
                                        <div className="lg:col-span-2 animate-in fade-in slide-in-from-top-2">
                                            <label className={labelClasses}><span>Nama Klub Olahraga</span></label>
                                            <input type="text" name="namaKlub" value={formData.namaKlub} onChange={handleChange} readOnly={isReadOnly} className={inputClasses} placeholder="Tuliskan nama klub..." />
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
                            <div className="bg-amber-900/20 backdrop-blur-xl border border-amber-500/20 p-8 rounded-[2rem] shadow-xl">
                                <div className="flex items-center gap-4 mb-8 border-b border-amber-500/20 pb-5"><div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm shadow-md">B</div><h3 className="font-black text-white text-xl uppercase tracking-widest">Informasi Kepelatihan</h3></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClasses}><span>Level Lisensi</span></label>
                                        <select name="lisensi" value={formData.lisensi} onChange={handleChange} disabled={isReadOnly} className={inputClasses}>
                                            <option value="" disabled className="bg-[#0a1526]">-- Pilih Level --</option><option value="Kabupaten/Kota" className="bg-[#0a1526]">Kabupaten/Kota</option><option value="Provinsi" className="bg-[#0a1526]">Provinsi</option><option value="Nasional" className="bg-[#0a1526]">Nasional</option><option value="Internasional" className="bg-[#0a1526]">Internasional</option>
                                        </select>
                                    </div>
                                    <div><label className={labelClasses}><span>BPJS Kesehatan</span><span className={`font-mono ${getCounterColor(formData.bpjsKes, 13)}`}>{formData.bpjsKes ? formData.bpjsKes.toString().length : 0}/13 Karakter</span></label><input type="text" name="bpjsKes" value={formData.bpjsKes} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} placeholder="Contoh: 0001234567890"/></div>
                                    <div><label className={labelClasses}><span>BPJS Ketenagakerjaan</span></label><input type="text" name="bpjsTk" value={formData.bpjsTk} onChange={handleChange} readOnly={isReadOnly} className={`${inputClasses} font-mono`} /></div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/10">
                            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-5">
                                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-sm">C</div>
                                <div className="flex-1 flex justify-between items-end">
                                    <h3 className="font-black text-white text-xl uppercase tracking-widest">Unggah Dokumen Berkas</h3>
                                    <div className="text-right"><span className="block text-xs font-bold text-slate-400 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-1 tracking-wider">{isReadOnly ? 'Mode Lihat Saja' : 'Pdf Maks 1MB / File'}</span></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {docsToShow.map((doc, index) => {
                                    const isUploaded = docStatus[doc.id] && docStatus[doc.id].includes('✓');
                                    return (
                                        <label key={doc.id} className={`border border-white/10 rounded-2xl p-5 bg-white/5 backdrop-blur-md transition-all flex flex-col justify-between group cursor-pointer ${!isUploaded && !isReadOnly ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-white/10 hover:border-white/20'} ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            <div className="block text-[11px] sm:text-xs font-black text-slate-300 mb-4 leading-snug tracking-widest cursor-pointer">
                                                <span className="text-blue-400 mr-2 opacity-70">{index + 1}.</span> {doc.label}
                                                {!isUploaded && !isReadOnly && <span className="text-rose-400 text-[10px] ml-2 animate-pulse bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">(Wajib)</span>}
                                            </div>
                                            <input type="file" className="hidden" accept="image/jpeg, image/png, application/pdf" disabled={isReadOnly} onChange={(e) => handleFileUpload(e, doc.id)} />
                                            <div className={`w-full border-2 border-dashed rounded-xl py-4 px-3 text-center transition-all flex flex-col items-center gap-3 tracking-wider ${isUploaded ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm' : 'border-white/20 group-hover:border-blue-400 group-hover:bg-blue-500/10 text-slate-400'}`}>
                                                {doc.id === 'foto' ? <CameraIcon className={`w-8 h-8 ${isUploaded ? 'text-emerald-400' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} /> : <FileUpIcon className={`w-8 h-8 ${isUploaded ? 'text-emerald-400' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} />}
                                                <span className="text-[11px] font-bold w-full truncate px-2">{docStatus[doc.id] ? docStatus[doc.id] : (isReadOnly ? 'Dokumen Kosong' : 'Pilih File')}</span>
                                                {formData[doc.id + '_url'] && (
                                                    <a href={formData[doc.id + '_url']} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-[10px] font-black rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center gap-1.5 shadow-sm w-fit mx-auto normal-case">
                                                        <EyeIcon className="w-3.5 h-3.5" /> CEK UNGGAHAN
                                                    </a>
                                                )}
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 flex justify-end gap-4 border-t border-white/10 bg-white/5 backdrop-blur-xl shrink-0 relative z-10">
                        <button type="button" onClick={onClose} disabled={isSaving} className="px-8 py-3.5 text-slate-300 font-bold hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 rounded-xl transition-all disabled:opacity-50 text-sm tracking-widest uppercase">
                            {isReadOnly ? 'Tutup Detail' : 'Batal'}
                        </button>
                        {!isReadOnly && !showDraftConfirm && (
                            <button type="submit" disabled={isSaving} className="px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm tracking-widest uppercase border border-blue-500">
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
// VIEW 3: ADMIN DASHBOARD (BENTO GLASS)
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
            <button onClick={() => setActiveMenu(id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all tracking-wide text-xs border ${isActive ? activeColor : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'}`}>
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
        <div className="flex h-screen uppercase bg-[#020617] overflow-hidden font-sans text-slate-200 relative">
            <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[150px] rounded-full"></div>
            </div>

            {toastMessage && (
                <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-xl border border-emerald-500/40 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-6 fade-in duration-300">
                    <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/30"><CheckCircleIcon className="w-6 h-6 text-emerald-400" /></div>
                    <div><h4 className="text-white font-black text-sm mb-0.5 tracking-wide">Berhasil!</h4><p className="text-emerald-100/80 text-xs font-bold tracking-wider">{toastMessage}</p></div>
                </div>
            )}

            <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl z-20 print:hidden relative overflow-hidden">
                <div className="p-8 border-b border-white/10 text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-amber-500/10 border border-amber-500/20 p-2 shadow-lg">
                        {logos[0] ? <img src={logos[0]} alt="Logo Utama" className="w-full h-full object-contain drop-shadow-lg" /> : <ShieldIcon className="w-8 h-8 text-amber-400" />}
                    </div>
                    <h2 className="font-black tracking-tight text-xl text-white">ADMIN PROVINSI</h2>
                    <p className="text-amber-400 text-[10px] font-bold tracking-widest mt-1">Pusat Verifikasi Data</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
                    <MenuBtn id="verifikasi" label="Verifikasi Berkas" icon={CheckCircleIcon} activeColor="bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-sm" />
                    <MenuBtn id="cetak" label="Cetak ID Card" icon={PrinterIcon} activeColor="bg-teal-500/20 text-teal-300 border-teal-500/30 shadow-sm" />
                    <MenuBtn id="akun" label="Manajemen Akun" icon={ShieldIcon} activeColor="bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-sm" />
                    <MenuBtn id="pengaturan" label="Pengaturan Tampilan" icon={SettingsIcon} activeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm" />
                </nav>
                <div className="p-4 border-t border-white/10 relative z-10">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl font-bold transition-all tracking-wide text-xs">
                        <LogOutIcon className="w-5 h-5" /> Keluar Sistem
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                <header className="bg-white/5 backdrop-blur-md p-6 md:p-8 border-b border-white/10 flex justify-between items-center shadow-sm z-10 print:hidden sticky top-0">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            {activeMenu === 'verifikasi' && 'Dashboard Verifikasi'}
                            {activeMenu === 'cetak' && 'Pencetakan ID Card Peserta'}
                            {activeMenu === 'akun' && 'Manajemen Keamanan Akun'}
                            {activeMenu === 'pengaturan' && 'Pengaturan Tampilan Aplikasi'}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-1.5 normal-case tracking-wide">
                            {activeMenu === 'verifikasi' && 'Validasi silang dokumen pendaftaran 13 wilayah.'}
                            {activeMenu === 'cetak' && 'Pilih ID Card yang akan dicetak dengan mencentang kotak.'}
                            {activeMenu === 'akun' && 'Kelola ulang kata sandi standar untuk operator wilayah.'}
                            {activeMenu === 'pengaturan' && 'Unggah logo & background khusus untuk ID Card.'}
                        </p>
                    </div>
                </header>

                <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col z-10">
                    
                    {activeMenu === 'pengaturan' && (
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-white/10 bg-transparent shrink-0">
                                <h3 className="font-black text-white text-lg tracking-widest uppercase">Manajemen Logo Identitas Website</h3>
                                <p className="text-xs text-slate-400 mt-1 normal-case font-medium">Logo yang diunggah di sini akan otomatis berubah pada halaman Login, Sidebar, dan Header ID Card (Pencetakan).</p>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-400 mb-3 tracking-widest text-center uppercase">Logo Utama (Kiri)</label>
                                    <div className="border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-[2rem] p-6 text-center hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all cursor-pointer relative min-h-[200px] flex items-center justify-center">
                                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 0)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {logos[0] ? <img src={logos[0]} alt="Logo 1" className="h-32 object-contain mx-auto drop-shadow-2xl" /> : <div className="py-4"><CameraIcon className="w-12 h-12 text-indigo-400 mx-auto mb-3" /><p className="text-sm font-bold text-indigo-300 tracking-wide uppercase">Pilih Logo Kiri</p></div>}
                                    </div>
                                    {logos[0] && <div className="text-center mt-4"><button onClick={() => {const l = [...logos]; l[0] = null; setLogos(l); onSyncSettings({ logos: l });}} className="text-xs font-black text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 px-5 py-2.5 rounded-xl transition-colors tracking-widest uppercase shadow-sm">Hapus Logo Utama</button></div>}
                                </div>
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-slate-400 mb-3 tracking-widest text-center uppercase">Logo Sekunder (Kanan)</label>
                                    <div className="border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 rounded-[2rem] p-6 text-center hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all cursor-pointer relative min-h-[200px] flex items-center justify-center">
                                        <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(e, 1)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        {logos[1] ? <img src={logos[1]} alt="Logo 2" className="h-32 object-contain mx-auto drop-shadow-2xl" /> : <div className="py-4"><CameraIcon className="w-12 h-12 text-cyan-400 mx-auto mb-3" /><p className="text-sm font-bold text-cyan-300 tracking-wide uppercase">Pilih Logo Kanan</p><p className="text-[10px] text-cyan-500/50 font-bold mt-1 tracking-widest">(Opsional)</p></div>}
                                    </div>
                                    {logos[1] && <div className="text-center mt-4"><button onClick={() => {const l = [...logos]; l[1] = null; setLogos(l); onSyncSettings({ logos: l });}} className="text-xs font-black text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 px-5 py-2.5 rounded-xl transition-colors tracking-widest uppercase shadow-sm">Hapus Logo Sekunder</button></div>}
                                </div>
                            </div>

                            <div className="p-6 border-b border-white/10 bg-transparent shrink-0 border-t">
                                <h3 className="font-black text-white text-lg tracking-widest uppercase">Manajemen Background ID Card Khusus</h3>
                                <p className="text-xs text-slate-400 mt-1 normal-case font-medium">Unggah gambar vertikal (Portrait) berukuran proporsional 90x130mm. Desain bawaan (warna-warni) akan disembunyikan otomatis jika background ini diisi.</p>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                {['Olahragawan', 'Pelatih', 'Official'].map(kategori => (
                                    <div key={kategori} className="w-full">
                                        <label className="block text-xs font-bold text-slate-400 mb-3 tracking-widest text-center uppercase">BG {kategori}</label>
                                        <div className="border-2 border-dashed border-white/20 bg-black/20 rounded-[2rem] p-4 text-center hover:border-white/40 transition-all cursor-pointer relative min-h-[280px] flex items-center justify-center overflow-hidden shadow-inner">
                                            <input type="file" accept="image/*" onChange={(e) => handleBgUpload(e, kategori)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                            {bgImages[kategori] ? (
                                                <>
                                                    <img src={bgImages[kategori]} alt={`BG ${kategori}`} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                                                    <div className="relative z-10 bg-[#020617]/80 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/10">
                                                        <p className="text-xs font-black text-emerald-400 tracking-widest uppercase">✓ Aktif</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-4 relative z-0">
                                                    <FileUpIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                                                    <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Pilih Desain BG</p>
                                                </div>
                                            )}
                                        </div>
                                        {bgImages[kategori] && (
                                            <div className="text-center mt-4">
                                                <button onClick={() => {const newBgs = {...bgImages, [kategori]: null}; setBgImages(newBgs); onSyncSettings({ bgImages: newBgs });}} className="text-xs font-black text-rose-400 hover:text-white bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 px-5 py-2.5 rounded-xl transition-all tracking-widest shadow-sm hover:-translate-y-0.5 uppercase">
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

                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 flex-1 flex flex-col overflow-hidden">
                                
                                <div className="flex flex-col gap-4 p-6 border-b border-white/10 bg-transparent shrink-0">
                                    <div className="flex gap-4 flex-wrap items-center justify-between">
                                        <div className="relative flex-1 min-w-[250px] max-w-lg">
                                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"/>
                                            <input 
                                                type="text" 
                                                placeholder="Pencarian Cepat Nama / NIK / ID Reg..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full normal-case pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            {selectedForApproval.length > 0 && (
                                                showBulkConfirm ? (
                                                    <div className="flex gap-2 items-center bg-amber-500/20 border border-amber-500/30 px-5 py-2.5 rounded-xl shadow-sm animate-in zoom-in-95">
                                                        <span className="text-xs font-black text-amber-400 tracking-widest uppercase">Setujui {selectedForApproval.length} Data?</span>
                                                        <button onClick={executeBulkApprove} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-black transition uppercase tracking-wider shadow-sm">YA</button>
                                                        <button onClick={() => setShowBulkConfirm(false)} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg text-xs font-black transition uppercase tracking-wider border border-white/10">BATAL</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setShowBulkConfirm(true)} className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap animate-in fade-in tracking-widest text-xs uppercase border border-blue-500">
                                                        <CheckCircleIcon className="w-5 h-5"/> Setujui ({selectedForApproval.length}) Terpilih
                                                    </button>
                                                )
                                            )}
                                            <button onClick={handleExportCSV} className="px-6 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-black flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap text-xs tracking-widest uppercase">
                                                <FileTextIcon className="w-5 h-5"/> Export Data
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 flex-wrap mt-2">
                                        <select value={filterRegency} onChange={(e) => setFilterRegency(e.target.value)} className="flex-1 min-w-[150px] p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm uppercase appearance-none cursor-pointer">
                                            {REGIONS.map(r => <option key={r} value={r} className="bg-[#0a1526]">{r}</option>)}
                                        </select>
                                        <select value={filterCabor} onChange={(e) => setFilterCabor(e.target.value)} className="flex-1 min-w-[150px] p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm uppercase appearance-none cursor-pointer">
                                            {CABOR_LIST.map(c => <option key={c} value={c} className="bg-[#0a1526]">{c}</option>)}
                                        </select>
                                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 min-w-[150px] p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm uppercase appearance-none cursor-pointer">
                                            <option value="Semua" className="bg-[#0a1526]">Semua Status</option>
                                            <option value="Pending" className="bg-[#0a1526]">Menunggu (Pending)</option>
                                            <option value="Approved" className="bg-[#0a1526]">Disetujui (Approved)</option>
                                            <option value="Revision" className="bg-[#0a1526]">Revisi (Revision)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="overflow-y-auto flex-1 p-2">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-slate-400 text-[10px] tracking-widest border-b border-white/10 sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md">
                                            <tr>
                                                <th className="px-6 py-5 w-12">
                                                    <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer rounded border-white/20 bg-white/5" onChange={handleSelectAllForApproval} checked={filteredData.filter(p => p.status !== 'Approved').length > 0 && selectedForApproval.length === filteredData.filter(p => p.status !== 'Approved').length} />
                                                </th>
                                                <th className="px-2 py-5 font-bold uppercase">Data Peserta & Profil</th>
                                                <th className="px-6 py-5 font-bold uppercase">Asal Kontingen</th>
                                                <th className="px-6 py-5 font-bold uppercase">Status Berkas</th>
                                                <th className="px-6 py-5 font-bold text-right uppercase">Tindakan Admin</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredData.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-16 text-slate-500 font-medium normal-case">Tidak ada data pendaftaran yang sesuai dengan pencarian/filter.</td></tr>
                                            ) : (
                                                filteredData.map(p => (
                                                    <tr key={p.id} className={`transition-colors group ${p.status === 'Pending' ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-white/5'}`}>
                                                        <td className="px-6 py-5">
                                                            {p.status !== 'Approved' && (
                                                                <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer rounded border-white/20 bg-white/5" checked={selectedForApproval.includes(p.id)} onChange={() => toggleSelectForApproval(p.id)} />
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-5">
                                                            <div className="font-extrabold text-white flex items-center gap-2 text-base">
                                                                {p.nama}
                                                                {p.tanggalLahir && <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider border ${p.kategori === 'Olahragawan' && new Date(p.tanggalLahir) < new Date('2009-01-01') ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/10 text-slate-300 border-white/20'}`}>UMUR: {calculateAge(p.tanggalLahir)}</span>}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-xs text-slate-400 font-bold tracking-wider">{p.kategori} <span className="mx-1 text-slate-600">•</span> {p.cabor}</span>
                                                                {p.id_registrasi && <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{p.id_registrasi}</span>}
                                                            </div>
                                                            <div className="text-xs text-slate-500 font-mono mt-1 normal-case font-bold">NIK. {p.nik}</div>
                                                        </td>
                                                        <td className="px-6 py-5 font-black text-slate-300 text-xs tracking-widest">{p.regency}</td>
                                                        <td className="px-6 py-5"><StatusBadge status={p.status} /></td>
                                                        <td className="px-6 py-5 text-right">
                                                            <button onClick={() => { setSelectedParticipant(p); setVerifikasiModalOpen(true); }} className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 ml-auto shadow-sm group-hover:-translate-y-0.5 tracking-widest uppercase ${p.status === 'Pending' ? 'text-white bg-blue-600 hover:bg-blue-500 border-blue-500 shadow-blue-500/20' : 'text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white border-white/10'}`}>
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
                        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col h-full">
                            
                            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center bg-transparent shrink-0 print:hidden gap-6">
                                <div>
                                    <p className="font-bold text-slate-400 text-sm tracking-wide">Terdapat <span className="text-teal-400 text-xl mx-1 font-black">{printCount}</span> dari {approvedParticipants.length} peserta siap cetak.</p>
                                    <div className="flex gap-3 mt-3">
                                        <button onClick={handleIncludeAll} className="text-xs font-black bg-teal-500/20 border border-teal-500/30 text-teal-400 px-4 py-2 rounded-xl hover:bg-teal-500/30 transition-all shadow-sm tracking-widest uppercase">Pilih Semua</button>
                                        <button onClick={handleExcludeAll} className="text-xs font-black bg-white/10 border border-white/10 text-slate-300 px-4 py-2 rounded-xl hover:bg-white/20 transition-all shadow-sm tracking-widest uppercase">Batal Pilih Semua</button>
                                    </div>
                                </div>
                                <button onClick={() => { try { window.print() } catch(e) { console.error("Print blocked in sandbox"); } }} disabled={printCount === 0} className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black shadow-lg shadow-teal-600/30 hover:bg-teal-500 transition-all hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed tracking-widest text-sm uppercase border border-teal-500">
                                    <PrinterIcon className="w-5 h-5" /> Jalankan Mesin Cetak
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto flex-1 bg-black/20 print:bg-white flex flex-wrap gap-8 justify-center content-start border-t border-white/5">
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
                                        <div className="text-center py-20 text-slate-500 font-bold print:hidden">Tidak ada ID Card yang memenuhi syarat cetak.</div>
                                    ) : (
                                        approvedParticipants.map(p => {
                                            const isExcluded = excludedFromPrint.includes(p.id);
                                            const hasCustomBg = !!bgImages[p.kategori];

                                            return (
                                                <div 
                                                    key={p.id} 
                                                    style={hasCustomBg ? { backgroundImage: `url(${bgImages[p.kategori]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                                    className={`w-[90mm] h-[130mm] ${hasCustomBg ? 'bg-transparent border-none' : 'bg-white border-slate-200'} rounded-[1.25rem] shadow-2xl shadow-black/50 overflow-hidden flex flex-col relative shrink-0 transition-all duration-300 ${isExcluded ? 'opacity-30 grayscale scale-95 print:hidden' : 'print:shadow-none print:rounded-none'} print:border-slate-800 border`}
                                                >
                                                    <div className="absolute top-3 right-3 z-50 print:hidden bg-black/50 p-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20">
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
                        <div className="flex flex-col h-full gap-8">
                            <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-[2rem] shadow-2xl shadow-orange-900/20 flex flex-col sm:flex-row justify-between items-center p-8 md:p-10 border border-orange-500/50 shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-[40px] -translate-y-1/2 translate-x-1/4"></div>
                                <div className="text-white mb-6 sm:mb-0 relative z-10">
                                    <h3 className="font-black text-2xl flex items-center gap-3 tracking-tight"><ShieldIcon className="w-8 h-8 text-amber-300"/> Akun Admin Provinsi</h3>
                                    <p className="text-orange-100 text-sm mt-2 font-medium normal-case tracking-wide">Ubah kata sandi akses utama Administrator Anda untuk keamanan ekstra.</p>
                                </div>
                                <button onClick={() => setIsAdminPasswordModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black transition-all border border-white/20 hover:-translate-y-1 shadow-lg text-sm tracking-widest uppercase relative z-10">
                                    Ubah Sandi Admin
                                </button>
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col flex-1 overflow-hidden">
                                <div className="p-6 border-b border-white/10 bg-transparent">
                                    <h3 className="font-black text-white text-lg tracking-widest uppercase">Otoritas Akses Wilayah (Operator)</h3>
                                    <p className="text-xs text-slate-400 mt-1 normal-case font-medium">Kembalikan akses masuk ke sandi bawaan (default) jika operator lupa kata sandinya.</p>
                                </div>
                                <div className="overflow-y-auto flex-1 p-2">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#020617]/80 backdrop-blur-md text-slate-400 text-[10px] tracking-widest border-b border-white/10 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-5 font-bold uppercase">Wilayah Otoritas Operasional</th>
                                                <th className="px-6 py-5 font-bold uppercase">Kata Sandi Standar (Default)</th>
                                                <th className="px-6 py-5 font-bold text-right uppercase">Tindakan Sistem</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {REGIONS.filter(r => r !== 'Semua Wilayah').map(r => (
                                                <tr key={r} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-5 font-extrabold text-white text-base">{r}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg inline-block border border-blue-500/20 shadow-sm normal-case tracking-wider">{passwords[r]}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button onClick={() => handleResetWithToast(r)} className="px-5 py-2.5 text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 tracking-widest uppercase">Reset Sandi</button>
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
        <div className="fixed inset-0 uppercase bg-[#020617]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-[#0a1526] rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100 border border-white/10">
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5 text-white">
                    <h2 className="font-black text-xl flex items-center gap-3 tracking-widest"><ShieldIcon className="w-6 h-6 text-amber-400"/> Sandi Utama</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-transparent">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-3 tracking-widest">Kata Sandi Baru</label>
                        <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full normal-case p-4 border border-white/10 bg-white/5 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 font-bold outline-none shadow-sm transition-all text-white" placeholder="Ketik password baru admin..." />
                    </div>
                    {msg && <p className="text-emerald-400 text-xs font-bold">{msg}</p>}
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-slate-400 font-bold hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-colors text-sm tracking-widest">BATAL</button>
                        <button type="submit" className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-1 text-sm tracking-widest border border-amber-500">UBAH SANDI</button>
                    </div>
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
        <div className="fixed inset-0 uppercase bg-[#020617]/80 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-[#0a1526] rounded-[2.5rem] w-full max-w-6xl h-[95vh] shadow-2xl flex flex-col overflow-hidden border border-white/10 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px] pointer-events-none"></div>
                
                <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center shrink-0 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded-2xl backdrop-blur-sm hidden sm:block"><EyeIcon className="w-6 h-6 text-blue-400" /></div>
                        <div>
                            <h2 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-3">
                                Validasi Berkas Fisik 
                                {participant.id_registrasi && <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] px-3 py-1 rounded-full font-mono tracking-widest">{participant.id_registrasi}</span>}
                            </h2>
                            <p className="text-slate-400 text-xs font-medium mt-1 normal-case tracking-wide">Pemeriksaan manual data operator dan lampiran digital.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-full transition-all">&times;</button>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10">
                    <div className="w-full md:w-5/12 bg-white/5 backdrop-blur-md p-6 md:p-10 border-r border-white/10 overflow-y-auto shadow-sm">
                        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-6 mb-10 pb-10 border-b border-white/10 text-center xl:text-left">
                            <div className="w-32 h-40 bg-[#020617] border-4 border-white/10 shadow-2xl flex items-center justify-center rounded-[1.5rem] shrink-0 overflow-hidden relative">
                                {participant.foto_url ? <img src={participant.foto_url} alt="Foto" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} /> : <span className="text-xs text-slate-500 font-bold tracking-widest">FOTO</span>}
                            </div>
                            <div className="pt-2">
                                <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black tracking-widest rounded-full mb-4">{participant.regency}</div>
                                <h3 className="font-black text-3xl text-white leading-tight mb-3 tracking-tight">{participant.nama}</h3>
                                <p className="text-sm font-mono font-bold text-slate-400 mb-5 bg-black/20 border border-white/5 px-3 py-1.5 rounded-lg inline-block normal-case">NIK. {participant.nik || 'Tidak Tersedia'}</p>
                                <div><StatusBadge status={participant.status} /></div>
                            </div>
                        </div>
                        
                        <h4 className="font-black text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl tracking-widest mb-5 inline-block uppercase">Data Input Form</h4>
                        <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] shadow-inner">
                            <InfoRow label="Kategori">{participant.kategori}</InfoRow>
                            <InfoRow label="Cabor/Posisi">{participant.cabor}</InfoRow>
                            <InfoRow label="Kelamin">{participant.jenisKelamin}</InfoRow>
                            <InfoRow label="Lahir">
                                {participant.tempatLahir || '-'}, {participant.tanggalLahir || '-'}
                                {participant.tanggalLahir && <span className={`ml-3 inline-block px-2.5 py-1 font-black rounded-lg text-[10px] tracking-wider border ${participant.kategori === 'Olahragawan' && new Date(participant.tanggalLahir) < new Date('2009-01-01') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>Usia: {calculateAge(participant.tanggalLahir)} THN</span>}
                            </InfoRow>
                            {participant.kategori === 'Olahragawan' && (
                                <><div className="my-3 border-t border-white/5 border-dashed"></div><InfoRow label="Sekolah">{participant.asalSekolah}</InfoRow><InfoRow label="Kelas">{participant.kelas}</InfoRow><InfoRow label="NISN/NPSN" isMono>{`${participant.nisn || '-'} / ${participant.npsn || '-'}`}</InfoRow><InfoRow label="Klub/Sentra">{participant.asalSentra === 'KLUB' ? participant.namaKlub : participant.asalSentra}</InfoRow></>
                            )}
                            {participant.kategori === 'Pelatih' && (
                                <><div className="my-3 border-t border-white/5 border-dashed"></div><InfoRow label="Lisensi">{participant.lisensi}</InfoRow></>
                            )}
                            {(participant.kategori === 'Olahragawan' || participant.kategori === 'Pelatih') && (
                                <><div className="my-3 border-t border-white/5 border-dashed"></div><InfoRow label="BPJS Kes" isMono>{participant.bpjsKes}</InfoRow><InfoRow label="BPJS Naker" isMono>{participant.bpjsTk}</InfoRow></>
                            )}
                        </div>
                    </div>
                    
                    <div className="w-full md:w-7/12 flex flex-col overflow-hidden bg-transparent">
                        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                            <h4 className="font-black text-white mb-6 flex justify-between items-center tracking-widest text-lg uppercase">Arsip Digital <span className="text-[10px] font-bold bg-white/10 text-slate-300 border border-white/10 px-4 py-1.5 rounded-full tracking-wider">Simulasi Berkas</span></h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 content-start">
                                {docsToVerify.map((doc, idx) => (
                                    <div key={doc.id} className="p-5 border border-white/10 bg-white/5 backdrop-blur-md rounded-[1.5rem] flex items-start gap-4 hover:shadow-lg hover:bg-white/10 transition-all cursor-pointer group">
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 shadow-sm"><FileUpIcon className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 tracking-widest mb-1.5">Doc {idx + 1}</p>
                                            <p className="text-xs font-black text-white leading-snug tracking-wide">{doc.label}</p>
                                            {participant[doc.id + '_url'] ? <a href={participant[doc.id + '_url']} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 font-black mt-3 flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg transition-all w-fit normal-case tracking-widest"><EyeIcon className="w-3.5 h-3.5"/> LIHAT DOKUMEN</a> : <p className="text-[10px] text-rose-400 font-bold mt-3 flex items-center gap-1.5 opacity-80"><AlertCircleIcon className="w-3.5 h-3.5"/> BELUM ADA FILE</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="p-6 md:p-8 bg-white/5 backdrop-blur-xl border-t border-white/10 shrink-0 z-20 relative shadow-[0_-20px_40px_rgba(0,0,0,0.3)]">
                            {isRejecting ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <label className="block text-sm font-black text-rose-400 mb-3 tracking-widest uppercase">Alasan Penolakan / Permintaan Revisi:</label>
                                    {errorMsg && <p className="text-rose-400 bg-rose-500/10 p-2 rounded-lg text-xs font-bold mb-3 border border-rose-500/20">{errorMsg}</p>}
                                    <textarea className="w-full normal-case p-5 border border-rose-500/30 bg-rose-500/5 rounded-2xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm transition-all text-white font-medium" rows="3" placeholder="Tuliskan secara spesifik dokumen apa yang kurang atau salah..." value={catatanRevisi} onChange={(e) => {setCatatanRevisi(e.target.value); setErrorMsg('');}} autoFocus></textarea>
                                    <div className="flex gap-4 justify-end mt-5"><button onClick={() => setIsRejecting(false)} className="px-6 py-3.5 text-slate-400 font-bold hover:bg-white/10 border border-transparent hover:border-white/10 rounded-xl transition-all tracking-widest text-sm uppercase">Batal</button><button onClick={handleReject} className="px-8 py-3.5 bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-500 flex items-center gap-2 hover:-translate-y-1 transition-all tracking-widest text-sm uppercase border border-rose-500">Kirim Notifikasi Revisi</button></div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-xs font-black text-slate-400 mb-4 tracking-[0.2em] text-center uppercase">Keputusan Verifikasi Akhir</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setIsRejecting(true)} className="flex-1 py-4 bg-transparent border-2 border-rose-500 text-rose-500 font-black rounded-[1.2rem] hover:bg-rose-500/10 hover:-translate-y-1 shadow-lg shadow-rose-500/10 transition-all flex justify-center items-center gap-3 tracking-widest text-sm uppercase"><AlertCircleIcon className="w-5 h-5" /> Tolak & Revisi</button>
                                        <button onClick={handleApprove} className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-[1.2rem] hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 hover:-translate-y-1 transition-all flex justify-center items-center gap-3 tracking-widest text-sm uppercase border border-emerald-500"><CheckCircleIcon className="w-5 h-5" /> Validasi & Setujui Dokumen</button>
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
        neutral: 'border-blue-500/20 group-hover:border-blue-500/40 shadow-blue-500/10',
        success: 'border-emerald-500/20 group-hover:border-emerald-500/40 shadow-emerald-500/10',
        warning: 'border-amber-500/20 group-hover:border-amber-500/40 shadow-amber-500/10',
        danger: 'border-rose-500/20 group-hover:border-rose-500/40 shadow-rose-500/10'
    };
    const textColors = { neutral: 'text-blue-400', success: 'text-emerald-400', warning: 'text-amber-400', danger: 'text-rose-400' };
    const bgGlow = { neutral: 'bg-blue-500/20', success: 'bg-emerald-500/20', warning: 'bg-amber-500/20', danger: 'bg-rose-500/20' };

    return (
        <div className={`p-6 rounded-[2rem] bg-white/5 backdrop-blur-xl border shadow-xl ${styling[type]} relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${bgGlow[type]} blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2 relative z-10">{title}</p>
            <p className={`text-5xl font-black tracking-tight ${textColors[type]} relative z-10 drop-shadow-md`}>{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const badges = {
        Approved: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"><CheckCircleIcon className="w-3.5 h-3.5"/> Berkas Disetujui</span>,
        Pending: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30"><ClockIcon className="w-3.5 h-3.5 animate-pulse"/> Menunggu Verifikasi</span>,
        Revision: <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30"><AlertCircleIcon className="w-3.5 h-3.5"/> Butuh Revisi Form</span>
    };
    return badges[status] || <span>{status}</span>;
}