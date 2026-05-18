/* =======================================================
   EDUNOTIFY  –  script.js  (Firebase Edition)
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────────────
       ROLE CONFIG
    ───────────────────────────────────────────────────── */
    const roleConfig = {
        student:    { label: 'Student',     icon: 'fa-solid fa-user-graduate',   badgeClass: '',                 btnClass: '',              navColor: '#667eea' },
        professor:  { label: 'Professor',   icon: 'fa-solid fa-chalkboard-user', badgeClass: 'badge-professor',  btnClass: 'btn-professor', navColor: '#a18cd1' },
        admin:      { label: 'Admin',       icon: 'fa-solid fa-user-gear',       badgeClass: 'badge-admin',      btnClass: 'btn-admin',     navColor: '#f5576c' },
        superadmin: { label: 'Super Admin', icon: 'fa-solid fa-shield-halved',   badgeClass: 'badge-superadmin', btnClass: 'btn-superadmin',navColor: '#43e97b' },
    };

    const roleNavItems = {
        student:    [
            { icon: 'fa-solid fa-grid-2',        label: 'Overview',   id: 'overview' },
            { icon: 'fa-solid fa-bell',           label: 'Notices',    id: 'notices',  badge: '3' },
            { icon: 'fa-solid fa-calendar-days',  label: 'Schedule',   id: 'schedule' },
            { icon: 'fa-solid fa-chart-bar',      label: 'Grades',     id: 'grades' },
            { icon: 'fa-solid fa-user',           label: 'Profile',    id: 'profile' },
        ],
        professor:  [
            { icon: 'fa-solid fa-grid-2',         label: 'Overview',   id: 'overview' },
            { icon: 'fa-solid fa-chalkboard',     label: 'Courses',    id: 'courses' },
            { icon: 'fa-solid fa-bullhorn',       label: 'Notices',    id: 'notices' },
            { icon: 'fa-solid fa-calendar-days',  label: 'Schedule',   id: 'schedule' },
            { icon: 'fa-solid fa-user',           label: 'Profile',    id: 'profile' },
        ],
        admin:      [
            { icon: 'fa-solid fa-grid-2',         label: 'Overview',   id: 'overview' },
            { icon: 'fa-solid fa-users',          label: 'Users',      id: 'users' },
            { icon: 'fa-solid fa-bullhorn',       label: 'Broadcast',  id: 'broadcast' },
            { icon: 'fa-solid fa-chart-pie',      label: 'Reports',    id: 'reports' },
            { icon: 'fa-solid fa-gear',           label: 'Settings',   id: 'settings' },
        ],
        superadmin: [
            { icon: 'fa-solid fa-grid-2',         label: 'Overview',   id: 'overview' },
            { icon: 'fa-solid fa-database',       label: 'All Users',  id: 'allusers' },
            { icon: 'fa-solid fa-shield-halved',  label: 'Security',   id: 'security' },
            { icon: 'fa-solid fa-server',         label: 'System',     id: 'system' },
            { icon: 'fa-solid fa-gear',           label: 'Settings',   id: 'settings' },
        ],
    };

    const rolePlaceholders = {
        student: 'student@institution.edu', professor: 'prof@institution.edu',
        admin: 'admin@institution.edu',     superadmin: 'super@institution.edu',
    };

    /* ─────────────────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────────────────── */
    function showToast(msg, type = 'success') {
        toast.textContent = '';
        toastIcon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
        toast.appendChild(toastIcon);
        toast.appendChild(document.createTextNode(' ' + msg));
        toast.className = `toast toast-${type} show`;
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function setError(el, msg) {
        if (msg) { el.textContent = msg; el.classList.add('visible'); }
        else      { el.textContent = ''; el.classList.remove('visible'); }
    }

    function getFirebaseError(code) {
        const map = {
            'auth/user-not-found':      'No account found with this email.',
            'auth/wrong-password':      'Incorrect password. Please try again.',
            'auth/invalid-email':       'Please enter a valid email address.',
            'auth/too-many-requests':   'Too many attempts. Try again later.',
            'auth/email-already-in-use':'An account with this email already exists.',
            'auth/weak-password':       'Password must be at least 6 characters.',
            'auth/invalid-credential':  'Invalid email or password.',
            'auth/network-request-failed': 'Network error. Check your connection.',
        };
        return map[code] || 'Something went wrong. Please try again.';
    }

    /* ─────────────────────────────────────────────────────
       DOM REFS – Login
    ───────────────────────────────────────────────────── */
    const splash      = document.getElementById('splash-screen');
    const appWrap     = document.getElementById('app-wrapper');
    const tabLogin    = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const tabIndicator= document.getElementById('tab-indicator');
    const loginSide   = document.getElementById('login-side');
    const registerSide= document.getElementById('register-side');
    const leftTitle   = document.getElementById('left-title');
    const leftSub     = document.getElementById('left-sub');
    const stepRole    = document.getElementById('step-role');
    const stepLogin   = document.getElementById('step-login');
    const roleCards   = document.querySelectorAll('#roles-grid .role-card');
    const formTitle   = document.getElementById('form-title');
    const roleBadge   = document.getElementById('role-badge');
    const badgeIcon   = document.getElementById('badge-icon');
    const badgeLabel  = document.getElementById('badge-label');
    const userIdInput = document.getElementById('userId');
    const submitBtn   = document.getElementById('submit-btn');
    const loginForm   = document.getElementById('login-form');
    const loginError  = document.getElementById('login-error');
    const backBtn     = document.getElementById('back-btn');
    const pwToggle    = document.getElementById('pw-toggle');
    const pwInput     = document.getElementById('password');
    const regStepRole = document.getElementById('reg-step-role');
    const regStepForm = document.getElementById('reg-step-form');
    const regRoleCards= document.querySelectorAll('#reg-roles-grid .role-card');
    const regRoleBadge= document.getElementById('reg-role-badge');
    const regBadgeIcon= document.getElementById('reg-badge-icon');
    const regBadgeLabel=document.getElementById('reg-badge-label');
    const regFormRole = document.getElementById('reg-form-role');
    const regForm     = document.getElementById('register-form');
    const regError    = document.getElementById('reg-error');
    const regSubmitBtn= document.getElementById('reg-submit-btn');
    const regBackBtn  = document.getElementById('reg-back-btn');
    const regPwToggle = document.getElementById('reg-pw-toggle');
    const regPwInput  = document.getElementById('reg-password');
    const toast       = document.getElementById('toast');
    const toastIcon   = document.getElementById('toast-icon');

    /* ─────────────────────────────────────────────────────
       DOM REFS – Dashboard
    ───────────────────────────────────────────────────── */
    const dashWrapper   = document.getElementById('dashboard-wrapper');
    const dashNavMenu   = document.getElementById('dash-nav-menu');
    const dashPageTitle = document.getElementById('dash-page-title');
    const dashAvatar    = document.getElementById('dash-avatar');
    const dashUname     = document.getElementById('dash-uname');
    const dashUrole     = document.getElementById('dash-urole');
    const signoutBtn    = document.getElementById('signout-btn');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const dashSidebar   = document.getElementById('dash-sidebar');

    let currentLoginRole    = null;
    let currentRegisterRole = null;

    /* ─────────────────────────────────────────────────────
       1. SPLASH → LOGIN
    ───────────────────────────────────────────────────── */
    setTimeout(() => {
        splash.classList.add('slide-up');
        setTimeout(() => {
            appWrap.classList.add('show');
            document.body.style.overflow = 'auto';
        }, 300);
    }, 3400);

    /* ─────────────────────────────────────────────────────
       2. TABS
    ───────────────────────────────────────────────────── */
    function switchTab(tab) {
        if (tab === 'login') {
            tabLogin.classList.add('active'); tabRegister.classList.remove('active');
            tabIndicator.classList.remove('on-register');
            loginSide.classList.add('active-side'); registerSide.classList.remove('active-side');
            leftTitle.textContent = 'Welcome back.';
            leftSub.textContent   = 'Sign in to access your personalised academic portal, receive instant notifications, and stay connected with your institution.';
        } else {
            tabRegister.classList.add('active'); tabLogin.classList.remove('active');
            tabIndicator.classList.add('on-register');
            registerSide.classList.add('active-side'); loginSide.classList.remove('active-side');
            leftTitle.textContent = 'Join EduNotify.';
            leftSub.textContent   = 'Create your account in seconds. Select your role, fill in your details, and start receiving smart academic notifications.';
        }
    }
    tabLogin.addEventListener('click',    () => switchTab('login'));
    tabRegister.addEventListener('click', () => switchTab('register'));

    /* ─────────────────────────────────────────────────────
       3. LOGIN – Role selection
    ───────────────────────────────────────────────────── */
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            currentLoginRole = card.dataset.role;
            const cfg = roleConfig[currentLoginRole];
            formTitle.textContent   = `${cfg.label} Login`;
            roleBadge.className     = `role-badge ${cfg.badgeClass}`;
            badgeIcon.className     = cfg.icon;
            badgeLabel.textContent  = cfg.label;
            userIdInput.placeholder = rolePlaceholders[currentLoginRole];
            submitBtn.className     = `submit-btn ${cfg.btnClass}`;
            setError(loginError, '');
            loginForm.reset();
            stepRole.classList.remove('active-step');
            stepLogin.classList.add('active-step');
            setTimeout(() => userIdInput.focus(), 80);
        });
    });

    backBtn.addEventListener('click', () => {
        stepLogin.classList.remove('active-step');
        stepRole.classList.add('active-step');
        loginForm.reset(); setError(loginError, '');
        currentLoginRole = null;
    });

    pwToggle.addEventListener('click', () => {
        const isText = pwInput.type === 'text';
        pwInput.type = isText ? 'password' : 'text';
        pwToggle.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    });

    /* ─────────────────────────────────────────────────────
       4. LOGIN SUBMIT – Firebase Auth
    ───────────────────────────────────────────────────── */
    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        setError(loginError, '');

        const identifier = userIdInput.value.trim().toLowerCase();
        const password   = pwInput.value;
        if (!identifier || !password) { setError(loginError, 'Please enter your ID/email and password.'); return; }

        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Signing in…</span>';
        submitBtn.disabled  = true;

        try {
            let emailToUse = identifier;

            // If identifier looks like an ID (not an email), look up email in Firestore
            if (!identifier.includes('@')) {
                const snap = await db.collection('users')
                    .where('institutionId', '==', identifier)
                    .where('role', '==', currentLoginRole)
                    .limit(1).get();
                if (snap.empty) { setError(loginError, 'No account found with this Institution ID.'); return; }
                emailToUse = snap.docs[0].data().email;
            }

            const credential = await auth.signInWithEmailAndPassword(emailToUse, password);
            const doc        = await db.collection('users').doc(credential.user.uid).get();

            if (!doc.exists) {
                await auth.signOut();
                setError(loginError, 'Account profile not found. Please register again.');
                return;
            }

            const userData = doc.data();
            if (userData.role !== currentLoginRole) {
                await auth.signOut();
                setError(loginError, `This account is a ${roleConfig[userData.role]?.label} account. Please select the correct role.`);
                return;
            }

            if (document.getElementById('remember-me').checked) {
                localStorage.setItem('edunotify_remember', JSON.stringify({ role: userData.role, email: userData.email }));
            }

            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Success!</span>';
            showToast(`Welcome back, ${userData.firstName}!`, 'success');
            setTimeout(() => showDashboard(userData), 900);

        } catch (err) {
            setError(loginError, getFirebaseError(err.code));
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Sign In</span><i class="fa-solid fa-arrow-right"></i>';
                submitBtn.disabled  = false;
            }, 1200);
        }
    });

    /* ─────────────────────────────────────────────────────
       5. REGISTER – Role selection
    ───────────────────────────────────────────────────── */
    regRoleCards.forEach(card => {
        card.addEventListener('click', () => {
            currentRegisterRole = card.dataset.role;
            const cfg = roleConfig[currentRegisterRole];
            regRoleBadge.className    = `role-badge ${cfg.badgeClass}`;
            regBadgeIcon.className    = cfg.icon;
            regBadgeLabel.textContent = cfg.label;
            regFormRole.textContent   = cfg.label;
            regSubmitBtn.className    = `submit-btn ${cfg.btnClass}`;
            setError(regError, '');
            regForm.reset();
            regStepRole.classList.remove('active-step');
            regStepForm.classList.add('active-step');
            setTimeout(() => document.getElementById('reg-first').focus(), 80);
        });
    });

    regBackBtn.addEventListener('click', () => {
        regStepForm.classList.remove('active-step');
        regStepRole.classList.add('active-step');
        regForm.reset(); setError(regError, '');
        currentRegisterRole = null;
    });

    regPwToggle.addEventListener('click', () => {
        const isText = regPwInput.type === 'text';
        regPwInput.type = isText ? 'password' : 'text';
        regPwToggle.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
    });

    /* ─────────────────────────────────────────────────────
       6. REGISTER SUBMIT – Firebase Auth + Firestore
    ───────────────────────────────────────────────────── */
    regForm.addEventListener('submit', async e => {
        e.preventDefault();
        setError(regError, '');

        const firstName    = document.getElementById('reg-first').value.trim();
        const lastName     = document.getElementById('reg-last').value.trim();
        const institutionId= document.getElementById('reg-id').value.trim();
        const email        = document.getElementById('reg-email').value.trim().toLowerCase();
        const password     = document.getElementById('reg-password').value;
        const confirmPw    = document.getElementById('reg-confirm').value;

        if (!firstName || !lastName)        { setError(regError, 'Please enter your first and last name.'); return; }
        if (!institutionId)                 { setError(regError, 'Please enter your Institution ID.'); return; }
        if (!email || !email.includes('@')) { setError(regError, 'Please enter a valid email address.'); return; }
        if (password.length < 8)            { setError(regError, 'Password must be at least 8 characters.'); return; }
        if (password !== confirmPw)         { setError(regError, 'Passwords do not match.'); return; }

        regSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Creating account…</span>';
        regSubmitBtn.disabled  = true;

        try {
            // Check duplicate Institution ID for same role
            const idCheck = await db.collection('users')
                .where('institutionId', '==', institutionId)
                .where('role', '==', currentRegisterRole)
                .limit(1).get();

            if (!idCheck.empty) {
                setError(regError, 'An account with this Institution ID already exists for this role.');
                return;
            }

            // Create Firebase Auth user
            const credential = await auth.createUserWithEmailAndPassword(email, password);

            // Save profile to Firestore
            await db.collection('users').doc(credential.user.uid).set({
                uid:           credential.user.uid,
                firstName,
                lastName,
                institutionId,
                email,
                role:          currentRegisterRole,
                registered:    firebase.firestore.FieldValue.serverTimestamp(),
            });

            regSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Account created!</span>';
            showToast(`Welcome, ${firstName}! Please sign in.`, 'success');

            // Sign out so user goes through login with role check
            await auth.signOut();

            setTimeout(() => {
                regSubmitBtn.innerHTML = '<span>Create Account</span><i class="fa-solid fa-arrow-right"></i>';
                regSubmitBtn.disabled  = false;
                regForm.reset(); setError(regError, '');
                regStepForm.classList.remove('active-step');
                regStepRole.classList.add('active-step');
                currentRegisterRole = null;
                switchTab('login');
            }, 1800);

        } catch (err) {
            setError(regError, getFirebaseError(err.code));
            regSubmitBtn.innerHTML = '<span>Create Account</span><i class="fa-solid fa-arrow-right"></i>';
            regSubmitBtn.disabled  = false;
        }
    });

    /* ─────────────────────────────────────────────────────
       7. AUTH STATE OBSERVER – persist sessions
    ───────────────────────────────────────────────────── */
    auth.onAuthStateChanged(async user => {
        if (user) {
            try {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists) {
                    splash.classList.add('slide-up');
                    appWrap.style.display = 'none';
                    showDashboard(doc.data());
                }
            } catch (e) { /* not connected yet, show login */ }
        }
    });

    /* ─────────────────────────────────────────────────────
       8. DASHBOARD – Show / render
    ───────────────────────────────────────────────────── */
    function showDashboard(userData) {
        appWrap.style.display = 'none';
        dashWrapper.classList.remove('dash-hidden');
        document.body.classList.add('in-dashboard');
        renderDashboard(userData);
    }

    function renderDashboard(userData) {
        const cfg = roleConfig[userData.role];

        // Topbar user info
        dashAvatar.textContent = userData.firstName[0].toUpperCase();
        dashAvatar.style.background = `linear-gradient(135deg, ${cfg.navColor}, ${cfg.navColor}99)`;
        dashUname.textContent  = `${userData.firstName} ${userData.lastName}`;
        dashUrole.textContent  = cfg.label;

        // Greeting name in each role panel
        const greetEl = document.getElementById(`greet-${userData.role}`);
        if (greetEl) greetEl.textContent = userData.firstName;

        // Build sidebar nav
        buildSideNav(userData.role);

        // Show correct role dashboard
        document.querySelectorAll('.role-dash').forEach(d => d.classList.add('dash-hidden'));
        const panel = document.getElementById(`dash-${userData.role}`);
        if (panel) panel.classList.remove('dash-hidden');

        // Super Admin: load live users
        if (userData.role === 'superadmin') loadLiveUsers();

        // Set sidebar accent colour
        document.documentElement.style.setProperty('--dash-accent', cfg.navColor);
    }

    function buildSideNav(role) {
        const items = roleNavItems[role] || [];
        dashNavMenu.innerHTML = items.map((item, i) => `
            <a href="#" class="dash-nav-item ${i === 0 ? 'active' : ''}" data-section="${item.id}">
                <i class="${item.icon}"></i>
                <span>${item.label}</span>
                ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>
        `).join('');

        dashNavMenu.querySelectorAll('.dash-nav-item').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                dashNavMenu.querySelectorAll('.dash-nav-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                dashPageTitle.textContent = link.querySelector('span').textContent;
            });
        });
    }

    /* ─────────────────────────────────────────────────────
       9. SIGN OUT
    ───────────────────────────────────────────────────── */
    signoutBtn.addEventListener('click', async () => {
        signoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Signing out…</span>';
        await auth.signOut();
        localStorage.removeItem('edunotify_remember');
        dashWrapper.classList.add('dash-hidden');
        document.body.classList.remove('in-dashboard');
        appWrap.style.display = '';
        appWrap.classList.add('show');
        document.body.style.overflow = 'auto';
        // Reset login form state
        stepLogin.classList.remove('active-step');
        stepRole.classList.add('active-step');
        loginForm.reset(); setError(loginError, '');
        currentLoginRole = null;
        signoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i><span>Sign Out</span>';
        showToast('Signed out successfully.', 'success');
    });

    /* ─────────────────────────────────────────────────────
       10. SIDEBAR TOGGLE (mobile)
    ───────────────────────────────────────────────────── */
    sidebarToggle.addEventListener('click', () => {
        dashSidebar.classList.toggle('collapsed');
    });

    /* ─────────────────────────────────────────────────────
       11. SUPER ADMIN – Load live users from Firestore
    ───────────────────────────────────────────────────── */
    async function loadLiveUsers() {
        const container = document.getElementById('live-users-table');
        if (!container) return;
        container.innerHTML = '<p class="loading-msg"><i class="fa-solid fa-spinner fa-spin"></i> Loading…</p>';

        const refreshBtn = document.getElementById('refresh-users');
        if (refreshBtn) refreshBtn.addEventListener('click', e => { e.preventDefault(); loadLiveUsers(); });

        try {
            const snap = await db.collection('users').orderBy('registered', 'desc').limit(20).get();
            if (snap.empty) { container.innerHTML = '<p class="loading-msg">No users registered yet.</p>'; return; }

            const rows = snap.docs.map(d => {
                const u = d.data();
                const roleLabel = roleConfig[u.role]?.label || u.role;
                const date = u.registered?.toDate ? u.registered.toDate().toLocaleDateString() : 'N/A';
                return `<tr>
                    <td>${u.firstName} ${u.lastName}</td>
                    <td><span class="role-pill ${u.role}">${roleLabel}</span></td>
                    <td>${u.institutionId}</td>
                    <td>${u.email}</td>
                    <td>${date}</td>
                </tr>`;
            }).join('');

            container.innerHTML = `
                <table class="user-table">
                    <thead><tr><th>Name</th><th>Role</th><th>ID</th><th>Email</th><th>Joined</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>`;
        } catch (err) {
            container.innerHTML = `<p class="loading-msg" style="color:#f5576c"><i class="fa-solid fa-triangle-exclamation"></i> Error loading users.</p>`;
        }
    }

    /* ─────────────────────────────────────────────────────
       12. REMEMBER ME – pre-fill on load
    ───────────────────────────────────────────────────── */
    const remembered = JSON.parse(localStorage.getItem('edunotify_remember') || 'null');
    if (remembered) {
        const { role, email } = remembered;
        currentLoginRole = role;
        const cfg = roleConfig[role];
        formTitle.textContent   = `${cfg.label} Login`;
        roleBadge.className     = `role-badge ${cfg.badgeClass}`;
        badgeIcon.className     = cfg.icon;
        badgeLabel.textContent  = cfg.label;
        userIdInput.placeholder = rolePlaceholders[role];
        userIdInput.value       = email;
        submitBtn.className     = `submit-btn ${cfg.btnClass}`;
        document.getElementById('remember-me').checked = true;
        stepRole.classList.remove('active-step');
        stepLogin.classList.add('active-step');
    }

    /* ─────────────────────────────────────────────────────
       13. NOTICE FORMS (demo)
    ───────────────────────────────────────────────────── */
    document.getElementById('prof-notice-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Notice posted successfully!', 'success');
        e.target.reset();
    });

    document.getElementById('admin-notice-form')?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Broadcast sent to all users!', 'success');
        e.target.reset();
    });

});
