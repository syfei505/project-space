// ==========================================
// SUPABASE CONFIG
// ==========================================

const supabaseClient =
  window.supabase.createClient(
    window.SITE_CONFIG.supabase.url,
    window.SITE_CONFIG.supabase.publishableKey
  );


// ==========================================
// ELEMENTS
// ==========================================

const requests =
  document.getElementById("requests");

const loading =
  document.getElementById("loading");

const empty =
  document.getElementById("empty");

const refreshBtn =
  document.getElementById("refreshBtn");

const logoutBtn =
  document.getElementById("logoutBtn");


// ==========================================
// CHECK ADMIN LOGIN
// ==========================================

async function checkAdminLogin() {

  try {

    const {
      data: {
        session
      },
      error
    } =
      await supabaseClient.auth.getSession();


    if (error) {

      console.error(
        "Gagal mengecek session:",
        error
      );

      window.location.href =
        "admin-login.html";

      return false;

    }


    // Belum login
    if (!session) {

      window.location.href =
        "admin-login.html";

      return false;

    }


    console.log(
      "Admin login:",
      session.user.email
    );


    return true;

  } catch (error) {

    console.error(
      "Session error:",
      error
    );

    window.location.href =
      "admin-login.html";

    return false;

  }

}


// ==========================================
// LOAD REQUESTS
// ==========================================

async function loadRequests() {

  loading.hidden = false;

  empty.hidden = true;

  requests.innerHTML = "";


  const {
    data,
    error
  } =
    await supabaseClient
      .from("verification_requests")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  loading.hidden = true;


  if (error) {

    console.error(
      "Gagal mengambil data:",
      error
    );


    requests.innerHTML = `
      <div class="error">
        ❌ Gagal mengambil data.
        <br>
        <small>
          ${escapeHTML(error.message)}
        </small>
      </div>
    `;

    return;

  }


  if (!data || !data.length) {

    empty.hidden = false;

    return;

  }


  requests.innerHTML =
    data
      .map(requestCard)
      .join("");

}


// ==========================================
// REQUEST CARD
// ==========================================

function requestCard(
  request
) {

  const date =
    new Date(
      request.created_at
    ).toLocaleString(
      "id-ID"
    );


  let actionButtons = "";


  if (
    request.status ===
    "pending"
  ) {

    actionButtons = `

      <button
        class="btn approve"
        onclick="approveRequest('${request.id}')"
        type="button"
      >
        ✅ Approve
      </button>

      <button
        class="btn reject"
        onclick="rejectRequest('${request.id}')"
        type="button"
      >
        ❌ Reject
      </button>

    `;

  } else {

    actionButtons = `

      <span
        class="status ${escapeHTML(request.status)}"
      >
        ${escapeHTML(
          request.status.toUpperCase()
        )}
      </span>

    `;

  }


  return `

    <article class="request-card">

      <div class="request-info">

        <div class="request-top">

          <span class="project">
            ${escapeHTML(
              request.project_name
            )}
          </span>

          <span
            class="status ${escapeHTML(request.status)}"
          >
            ${escapeHTML(
              request.status.toUpperCase()
            )}
          </span>

        </div>


        <h2>
          @${escapeHTML(
            request.username
          )}
        </h2>


        <p>
          📁 Project:
          ${escapeHTML(
            request.project_name
          )}
        </p>


        <p>
          🕒 ${escapeHTML(date)}
        </p>


        ${
          request.proof_url
            ? `
              <a
                href="${escapeHTML(request.proof_url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="proof-link"
              >
                🖼️ Lihat Screenshot
              </a>
            `
            : `
              <span class="proof-link">
                ⚠️ Tidak ada screenshot
              </span>
            `
        }

      </div>


      <div class="actions">

        ${actionButtons}

      </div>

    </article>

  `;

}


// ==========================================
// APPROVE
// ==========================================

async function approveRequest(
  id
) {

  const confirmed =
    confirm(
      "Yakin ingin menyetujui verifikasi ini?"
    );


  if (!confirmed) {

    return;

  }


  const {
    error
  } =
    await supabaseClient
      .from("verification_requests")
      .update({

        status:
          "approved",

        reviewed_at:
          new Date().toISOString()

      })
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "Approve error:",
      error
    );


    alert(
      "❌ Gagal menyetujui.\n\n" +
      error.message
    );

    return;

  }


  alert(
    "Verifikasi berhasil disetujui! ✅"
  );


  await loadRequests();

}


// ==========================================
// REJECT
// ==========================================

async function rejectRequest(
  id
) {

  const confirmed =
    confirm(
      "Yakin ingin menolak verifikasi ini?"
    );


  if (!confirmed) {

    return;

  }


  const {
    error
  } =
    await supabaseClient
      .from("verification_requests")
      .update({

        status:
          "rejected",

        reviewed_at:
          new Date().toISOString()

      })
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "Reject error:",
      error
    );


    alert(
      "❌ Gagal menolak.\n\n" +
      error.message
    );

    return;

  }


  alert(
    "Verifikasi ditolak. ❌"
  );


  await loadRequests();

}


// ==========================================
// LOGOUT
// ==========================================

async function logoutAdmin() {

  const confirmed =
    confirm(
      "Yakin ingin logout?"
    );


  if (!confirmed) {

    return;

  }


  const {
    error
  } =
    await supabaseClient.auth.signOut();


  if (error) {

    console.error(
      "Logout error:",
      error
    );


    alert(
      "❌ Gagal logout.\n\n" +
      error.message
    );

    return;

  }


  window.location.href =
    "admin-login.html";

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(
  value
) {

  return String(value ?? "")
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================
// REFRESH
// ==========================================

refreshBtn.addEventListener(
  "click",
  loadRequests
);


// ==========================================
// LOGOUT BUTTON
// ==========================================

if (logoutBtn) {

  logoutBtn.addEventListener(
    "click",
    logoutAdmin
  );

}


// ==========================================
// INITIALIZATION
// ==========================================

async function initializeAdmin() {

  const isLoggedIn =
    await checkAdminLogin();


  if (!isLoggedIn) {

    return;

  }


  await loadRequests();

}


initializeAdmin();