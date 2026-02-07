// Register a new admin user
function registerAdmin(name, email, password) {
  let users = JSON.parse(localStorage.getItem('jaylawUsers')) || [];
  
  const adminUser = {
    id: Date.now(),
    name: name,
    email: email,
    password: password,
    isAdmin: true,
    createdAt: new Date().toISOString()
  };
  
  users.push(adminUser);
  localStorage.setItem('jaylawUsers', JSON.stringify(users));
  
  console.log('✅ Admin user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
}

// Example usage (run in browser console):
// registerAdmin('Admin User', 'admin@jaylawklassic.com', 'Admin@2024');