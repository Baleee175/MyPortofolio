// 1. Fungsi untuk membuka link project
function openProject(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

// 2. Handling Navigasi Hamburger (Mobile)
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle class active pada menu dan hamburger (untuk animasi X)
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Tutup menu otomatis saat salah satu link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Tutup menu jika pengguna mengklik di luar area menu
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

// 3. Handling Filter Sertifikat (Show More / Less)
const toggleBtn = document.getElementById('toggleCertificateBtn');
const extraCertificates = document.querySelectorAll('.extra-certificate');
let isExpanded = false;

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        extraCertificates.forEach(card => {
            if (isExpanded) {
                card.style.display = 'block';
                // Delay sedikit agar animasi terasa
                setTimeout(() => card.classList.add('show'), 10);
            } else {
                card.classList.remove('show');
                card.style.display = 'none';
            }
        });

        // Update teks tombol
        toggleBtn.textContent = isExpanded 
            ? 'Show Less' 
            : 'View More';
            
        // Scroll kembali jika ditutup
        if (!isExpanded) {
            document.getElementById('certificates').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const backToTopButton = document.getElementById('backToTop');
// Logika untuk menampilkan/menyembunyikan tombol saat scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) { // Muncul setelah scroll sedalam 400px
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Logika saat tombol diklik
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Efek scroll halus ke atas
    });
});

// Menampilkan tahun saat ini secara otomatis
document.getElementById('currentYear').textContent = new Date().getFullYear();