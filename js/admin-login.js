// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

// Membuat koneksi ke Supabase
const supabaseClient = window.supabase.createClient(
  window.SITE_CONFIG.supabase.url,
  window.SITE_CONFIG.supabase.publishableKey
);


// ==========================================
// ELEMENT HTML
// ==========================================

const loginForm =
  document.getElementById("adminLoginForm");

const emailInput =
  document.getElementById("adminEmail");

const passwordInput =
  document.getElementById("adminPassword");

const loginButton =
  document.getElementById("loginButton");

const loginMessage =
  document.getElementById("loginMessage");


// ==========================================
// CEK LOGIN YANG SUDAH ADA
// ==========================================

async function checkExistingSession() {

  try {

    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();


    if (error) {

      console.error(
        "Session check error:",
        error
      );

      return;

    }


    // Jika sudah login,
    // langsung arahkan ke dashboard admin

    if (session) {

      window.location.href = "admin.html";

    }

  } catch (error) {

    console.error(
      "Session error:",
      error
    );

  }

}


// ==========================================
// PROSES LOGIN
// ==========================================

loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    // Ambil input
    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    // ======================================
    // VALIDASI
    // ======================================

    if (!email) {

      loginMessage.textContent =
        "Silakan masukkan email admin.";

      emailInput.focus();

      return;

    }


    if (!password) {

      loginMessage.textContent =
        "Silakan masukkan password.";

      passwordInput.focus();

      return;

    }


    // ======================================
    // LOADING
    // ======================================

    loginButton.disabled = true;

    loginButton.innerHTML =
      "<span>⏳</span><span>Memproses...</span>";

    loginMessage.textContent = "";


    try {

      // ====================================
      // LOGIN SUPABASE
      // ====================================

      const {
        data,
        error
      } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });


      // Jika Supabase mengembalikan error

      if (error) {

        throw error;

      }


      // ====================================
      // CEK SESSION
      // ====================================

      if (!data || !data.session) {

        throw new Error(
          "Session login tidak berhasil dibuat."
        );

      }


      // ====================================
      // LOGIN BERHASIL
      // ====================================

      loginMessage.textContent =
        "✓ Login berhasil. Membuka dashboard...";


      // Tunggu sebentar agar pesan terlihat

      setTimeout(function () {

        window.location.href =
          "admin.html";

      }, 700);


    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      // ====================================
      // LOGIN GAGAL
      // ====================================

      loginMessage.textContent =
        "Email atau password salah.";


      loginButton.disabled = false;

      loginButton.innerHTML =
        "<span>🔐</span><span>Login Admin</span>";

    }

  }
);


// ==========================================
// JALANKAN CEK SESSION
// ==========================================

checkExistingSession();