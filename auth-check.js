// auth-check.js - Authentication Guard Script
(function() {
  'use strict';

  // List of protected pages that require authentication
  const protectedPages = ['cart.html', 'shop.html', 'account.html', 'admin.html', 'checkout.html'];
  
  // Get current page
  const currentPage = window.location.pathname.split('/').pop();
  
  // Check if current page is protected
  const isProtectedPage = protectedPages.some(page => currentPage.includes(page));

  if (isProtectedPage) {
    // Check authentication status
    const isLoggedIn = localStorage.getItem('jaylawLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('jaylawCurrentUser'));

    if (!isLoggedIn || isLoggedIn !== 'true' || !currentUser) {
      // User is not authenticated - redirect to auth page
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `auth.html?redirect=${currentPage}`;
      return;
    }

    // Special check for admin page
    if (currentPage.includes('admin.html')) {
      if (!currentUser.isAdmin) {
        alert('⛔ Access Denied!\n\nYou do not have administrator privileges.');
        window.location.href = 'index.html';
        return;
      }
    }

    // User is authenticated - add logout functionality to header
    addAuthUI();
  }

  // Add authentication UI elements
  function addAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('jaylawCurrentUser'));
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertAuthUI);
    } else {
      insertAuthUI();
    }

    function insertAuthUI() {
      const nav = document.querySelector('nav');
      if (!nav) return;

      // Remove existing Account link if present
      const existingAccountLink = nav.querySelector('a[href="account.html"]');
      if (existingAccountLink) {
        existingAccountLink.remove();
      }

      // Create user menu
      const userMenu = document.createElement('div');
      userMenu.className = 'user-menu';
      userMenu.innerHTML = `
        <style>
          .user-menu {
            position: relative;
            display: inline-block;
          }
          
          .user-menu-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 15px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 25px;
            color: var(--gold);
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .user-menu-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }

          .user-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold) 0%, #E5C158 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: var(--coffee-dark);
            font-size: 0.9em;
          }

          .user-name {
            font-weight: 600;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .dropdown-menu {
            position: absolute;
            top: 120%;
            right: 0;
            background: rgba(62, 39, 35, 0.98);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 15px;
            min-width: 220px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
          }

          .user-menu:hover .dropdown-menu,
          .dropdown-menu:hover {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .dropdown-item {
            padding: 12px 20px;
            color: var(--gold);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .dropdown-item:last-child {
            border-bottom: none;
          }

          .dropdown-item:hover {
            background: rgba(212, 175, 55, 0.1);
            padding-left: 25px;
          }

          .dropdown-item i {
            width: 20px;
            text-align: center;
          }

          .logout-btn {
            color: #E53935 !important;
            cursor: pointer;
          }

          .logout-btn:hover {
            background: rgba(229, 57, 53, 0.1);
          }

          @media (max-width: 768px) {
            .user-name {
              display: none;
            }
          }
        </style>

        <div class="user-menu-btn">
          <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
          <span class="user-name">${currentUser.name.split(' ')[0]}</span>
          <i class="fas fa-chevron-down" style="font-size: 0.8em;"></i>
        </div>

        <div class="dropdown-menu">
          <a href="account.html" class="dropdown-item">
            <i class="fas fa-user"></i>
            <span>My Account</span>
          </a>
          <a href="account.html?tab=orders" class="dropdown-item">
            <i class="fas fa-shopping-bag"></i>
            <span>My Orders</span>
          </a>
          <a href="account.html?tab=wishlist" class="dropdown-item">
            <i class="fas fa-heart"></i>
            <span>Wishlist</span>
          </a>
          ${currentUser.isAdmin ? `
          <a href="admin.html" class="dropdown-item">
            <i class="fas fa-crown"></i>
            <span>Admin Panel</span>
          </a>
          ` : ''}
          <a href="account.html?tab=settings" class="dropdown-item">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </a>
          <div class="dropdown-item logout-btn" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      `;

      nav.appendChild(userMenu);
    }
  }

  // Global logout function
  window.handleLogout = function() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('jaylawLoggedIn');
      localStorage.removeItem('jaylawCurrentUser');
      window.location.href = 'index.html';
    }
  };

})();