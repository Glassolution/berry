
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://shfhvlogmkfnqxcuumfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const email = 'glassolutionenterprise@gmail.com';
const password = 'password123'; // Temporary password

async function createUser() {
  console.log(`Attempting to create user: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Glass Solution Enterprise',
      },
    },
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('User created successfully:', data);
    console.log('User ID:', data.user?.id);
  }
}

createUser();
