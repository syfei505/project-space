// ==========================================
// SUPABASE CONFIG
// ==========================================

const supabaseClient = supabase.createClient(
  window.SITE_CONFIG.supabase.url,
  window.SITE_CONFIG.supabase.publishableKey
);


// ==========================================
// PROJECT CONFIG
// ==========================================

const projectNames = {
  "qr-attendance": "QR Attendance System",
  "habit-tracker": "Habit Tracker",
  "cashier-app": "Alpukat Kocok Cashier"
};


// ==========================================
// PROJECT LINKS
// ==========================================

const projectLinks = {
  "qr-attendance":
    "https://qrstudio-byfei.vercel.app",

  "habit-tracker":
    "https://habit-tracker-byfei.vercel.app",

  "cashier-app":
    "https://cashier-app-byfei.vercel.app"
};


// ==========================================
// GET PROJECT
// ==========================================

const params = new URLSearchParams(
  window.location.search
);

const projectId = params.get("project");

const projectTitle =
  document.getElementById("projectTitle");

const pendingProject =
  document.getElementById("pendingProject");


// ==========================================
// ELEMENTS
// ==========================================

const proofImage =
  document.getElementById("proofImage");

const preview =
  document.getElementById("preview");

const previewImage =
  document.getElementById("previewImage");

const removeImage =
  document.getElementById("removeImage");

const usernameInput =
  document.getElementById("username");

const submitVerification =
  document.getElementById("submitVerification");

const formMessage =
  document.getElementById("formMessage");

const pendingBox =
  document.getElementById("pendingBox");

const approvedBox =
  document.getElementById("approvedBox");

const rejectedBox =
  document.getElementById("rejectedBox");

const accessProject =
  document.getElementById("accessProject");

const tryAgain =
  document.getElementById("tryAgain");


// ==========================================
// CHECK PROJECT
// ==========================================

if (
  projectId &&
  projectNames[projectId]
) {

  projectTitle.textContent =
    `Access ${projectNames[projectId]}`;

  pendingProject.textContent =
    projectNames[projectId];

} else {

  projectTitle.textContent =
    "Project Tidak Ditemukan";

  submitVerification.disabled = true;
}


// ==========================================
// IMAGE PREVIEW
// ==========================================

proofImage.addEventListener(
  "change",
  () => {

    const file = proofImage.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      showMessage(
        "File harus berupa gambar.",
        "error"
      );

      proofImage.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {

      showMessage(
        "Ukuran gambar maksimal 5 MB.",
        "error"
      );

      proofImage.value = "";

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {

      previewImage.src =
        reader.result;

      preview.hidden = false;

    };

    reader.readAsDataURL(file);

  }
);


// ==========================================
// REMOVE IMAGE
// ==========================================

removeImage.addEventListener(
  "click",
  () => {

    proofImage.value = "";

    previewImage.src = "";

    preview.hidden = true;

  }
);


// ==========================================
// SUBMIT VERIFICATION
// ==========================================

submitVerification.addEventListener(
  "click",
  submitVerificationRequest
);


async function submitVerificationRequest() {

  const username =
    usernameInput.value.trim();

  const file =
    proofImage.files[0];


  // -------------------------------
  // VALIDATION
  // -------------------------------

  if (!username) {

    showMessage(
      "Masukkan username Instagram.",
      "error"
    );

    return;
  }


  if (!file) {

    showMessage(
      "Upload screenshot bukti follow terlebih dahulu.",
      "error"
    );

    return;
  }


  if (!projectId) {

    showMessage(
      "Project tidak ditemukan.",
      "error"
    );

    return;
  }


  // -------------------------------
  // DISABLE BUTTON
  // -------------------------------

  submitVerification.disabled = true;

  submitVerification.innerHTML =
    "⏳ Mengirim...";


  try {

    // -------------------------------
    // UNIQUE FILE NAME
    // -------------------------------

    const cleanUsername =
      username
        .replace("@", "")
        .replace(/[^a-zA-Z0-9_-]/g, "");

    const fileName =
      `${Date.now()}-${cleanUsername}-${projectId}`;

    const filePath =
      `${fileName}.${getExtension(file.name)}`;


    // -------------------------------
    // UPLOAD IMAGE
    // -------------------------------

    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from("verification-proofs")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false
          }
        );


    if (uploadError) {

      throw uploadError;

    }


    // -------------------------------
    // GET PUBLIC URL
    // -------------------------------

    const {
      data: publicUrlData
    } =
      supabaseClient
        .storage
        .from("verification-proofs")
        .getPublicUrl(filePath);


    const proofUrl =
      publicUrlData.publicUrl;


    // -------------------------------
    // INSERT DATABASE
    // -------------------------------

    const {
      data,
      error: databaseError
    } =
      await supabaseClient
        .from("verification_requests")
        .insert({

          username:
            username.startsWith("@")
              ? username
              : `@${username}`,

          project_id:
            projectId,

          project_name:
            projectNames[projectId],

          proof_url:
            proofUrl,

          status:
            "pending"

        })
        .select()
        .single();


    if (databaseError) {

      throw databaseError;

    }


    // -------------------------------
    // SAVE REQUEST ID
    // -------------------------------

    localStorage.setItem(
      `verification_${projectId}`,
      data.id
    );


    // -------------------------------
    // SHOW PENDING
    // -------------------------------

    showPending();

  } catch (error) {

    console.error(
      "Verification error:",
      error
    );

    showMessage(
      "Gagal mengirim verifikasi. Silakan coba lagi.",
      "error"
    );

    submitVerification.disabled = false;

    submitVerification.innerHTML =
      "📨 Kirim Verifikasi";

  }

}


// ==========================================
// CHECK VERIFICATION STATUS
// ==========================================

async function checkVerificationStatus() {

  const requestId =
    localStorage.getItem(
      `verification_${projectId}`
    );

  if (!requestId) {

    return;

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("verification_requests")
      .select("*")
      .eq("id", requestId)
      .single();


  if (error) {

    console.error(error);

    return;

  }


  if (data.status === "approved") {

    showApproved();

  }


  if (data.status === "rejected") {

    showRejected();

  }


  if (data.status === "pending") {

    showPending();

  }

}


// ==========================================
// SHOW PENDING
// ==========================================

function showPending() {

  document
    .querySelector(".verify-form")
    ?.setAttribute(
      "hidden",
      ""
    );

  pendingBox.hidden = false;

  approvedBox.hidden = true;

  rejectedBox.hidden = true;

}


// ==========================================
// SHOW APPROVED
// ==========================================

function showApproved() {

  document
    .querySelector(".verify-form")
    ?.setAttribute(
      "hidden",
      ""
    );

  pendingBox.hidden = true;

  approvedBox.hidden = false;

  rejectedBox.hidden = true;


  if (
    projectLinks[projectId]
  ) {

    accessProject.href =
      projectLinks[projectId];

  }

}


// ==========================================
// SHOW REJECTED
// ==========================================

function showRejected() {

  document
    .querySelector(".verify-form")
    ?.removeAttribute(
      "hidden"
    );

  pendingBox.hidden = true;

  approvedBox.hidden = true;

  rejectedBox.hidden = false;

}


// ==========================================
// TRY AGAIN
// ==========================================

tryAgain.addEventListener(
  "click",
  () => {

    rejectedBox.hidden = true;

    document
      .querySelector(".verify-form")
      ?.removeAttribute(
        "hidden"
      );

  }
);


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
  message,
  type
) {

  formMessage.textContent =
    message;

  formMessage.className =
    `form-message ${type}`;

}


// ==========================================
// FILE EXTENSION
// ==========================================

function getExtension(
  filename
) {

  return filename
    .split(".")
    .pop()
    .toLowerCase();

}


// ==========================================
// INITIAL CHECK
// ==========================================

if (projectId) {

  checkVerificationStatus();

}
