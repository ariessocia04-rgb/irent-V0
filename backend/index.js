const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Supabase with Service Role Key for administrative tasks
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'iRent Backend' });
});

// Admin: Create Tenant (Requires Service Role)
app.post('/api/admin/create-tenant', async (req, res) => {
  const { email, password, fullName, roomId } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // 2. Create Profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      email,
      role: 'tenant'
    });

    if (profileError) throw profileError;

    // 3. Set Role
    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: 'tenant'
    });

    if (roleError) throw roleError;

    // 4. Update Room if provided
    if (roomId) {
      await supabase.from('rooms').update({
        tenant_id: userId,
        tenant_name: fullName,
        status: 'occupied'
      }).eq('id', roomId);
    }

    res.json({ success: true, userId });
  } catch (err) {
    console.error('Error creating tenant:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
