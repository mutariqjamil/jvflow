import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Utility function to authenticate user
async function authenticateUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No access token provided' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  return { user, error };
}

// Health check endpoint
app.get("/make-server-df4644bf/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth routes
app.post("/make-server-df4644bf/auth/signup", async (c) => {
  try {
    const { email, password, phone, name, registrationType } = await c.req.json();
    
    const userData: any = {
      password,
      user_metadata: { 
        name,
        registration_type: registrationType,
        phone: phone || null,
        trial_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 days trial
        subscription_status: 'trial'
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    };

    if (registrationType === 'email') {
      userData.email = email;
    } else if (registrationType === 'phone') {
      userData.phone = phone;
      userData.email = `${phone}@jvflow.temp`; // Temporary email for phone registration
    }

    const { data, error } = await supabase.auth.admin.createUser(userData);
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: userData.email,
      phone: phone || null,
      name,
      registration_type: registrationType,
      trial_start_date: userData.user_metadata.trial_start_date,
      trial_end_date: userData.user_metadata.trial_end_date,
      subscription_status: 'trial',
      created_at: new Date().toISOString()
    });

    return c.json({ 
      user: data.user, 
      message: 'User created successfully. Trial period started (31 days).' 
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Organization routes
app.post("/make-server-df4644bf/organizations", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, description, industry } = await c.req.json();
    
    const organizationId = crypto.randomUUID();
    const organization = {
      id: organizationId,
      name,
      description,
      industry,
      owner_id: user.id,
      created_at: new Date().toISOString(),
      subscription_status: 'trial',
      trial_end_date: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
    };

    await kv.set(`organization:${organizationId}`, organization);
    
    // Add user as organization owner
    await kv.set(`org_member:${organizationId}:${user.id}`, {
      organization_id: organizationId,
      user_id: user.id,
      role: 'owner',
      permissions: ['*'], // Full permissions for owner
      joined_at: new Date().toISOString()
    });

    // Update user's organizations list
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      const organizations = userProfile.organizations || [];
      organizations.push(organizationId);
      await kv.set(`user:${user.id}`, { ...userProfile, organizations });
    }

    return c.json({ organization });
  } catch (error) {
    console.log('Create organization error:', error);
    return c.json({ error: 'Internal server error creating organization' }, 500);
  }
});

app.get("/make-server-df4644bf/organizations", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    const organizationIds = userProfile?.organizations || [];
    
    const organizations = [];
    for (const orgId of organizationIds) {
      const org = await kv.get(`organization:${orgId}`);
      if (org) {
        const memberData = await kv.get(`org_member:${orgId}:${user.id}`);
        organizations.push({ ...org, user_role: memberData?.role });
      }
    }

    return c.json({ organizations });
  } catch (error) {
    console.log('Get organizations error:', error);
    return c.json({ error: 'Internal server error fetching organizations' }, 500);
  }
});

// Project routes
app.post("/make-server-df4644bf/projects", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { organization_id, name, description, location, budget, payment_plan } = await c.req.json();
    
    // Check if user has permission to create projects in this organization
    const memberData = await kv.get(`org_member:${organization_id}:${user.id}`);
    if (!memberData || !['owner', 'admin', 'project_manager'].includes(memberData.role)) {
      return c.json({ error: 'Insufficient permissions to create projects' }, 403);
    }

    const projectId = crypto.randomUUID();
    const project = {
      id: projectId,
      organization_id,
      name,
      description,
      location,
      budget,
      payment_plan, // 'monthly' or 'one_time'
      payment_status: 'pending',
      created_by: user.id,
      created_at: new Date().toISOString(),
      status: 'planning'
    };

    await kv.set(`project:${projectId}`, project);
    
    // Add to organization's projects
    const organization = await kv.get(`organization:${organization_id}`);
    if (organization) {
      const projects = organization.projects || [];
      projects.push(projectId);
      await kv.set(`organization:${organization_id}`, { ...organization, projects });
    }

    return c.json({ project });
  } catch (error) {
    console.log('Create project error:', error);
    return c.json({ error: 'Internal server error creating project' }, 500);
  }
});

app.get("/make-server-df4644bf/projects", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const organizationId = c.req.query('organization_id');
    if (!organizationId) {
      return c.json({ error: 'Organization ID required' }, 400);
    }

    // Check user access to organization
    const memberData = await kv.get(`org_member:${organizationId}:${user.id}`);
    if (!memberData) {
      return c.json({ error: 'No access to this organization' }, 403);
    }

    const organization = await kv.get(`organization:${organizationId}`);
    const projectIds = organization?.projects || [];
    
    const projects = [];
    for (const projectId of projectIds) {
      const project = await kv.get(`project:${projectId}`);
      if (project) {
        projects.push(project);
      }
    }

    return c.json({ projects });
  } catch (error) {
    console.log('Get projects error:', error);
    return c.json({ error: 'Internal server error fetching projects' }, 500);
  }
});

// User invitation routes
app.post("/make-server-df4644bf/invitations", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { organization_id, email, phone, role, permissions, project_ids } = await c.req.json();
    
    // Check if user has permission to invite others
    const memberData = await kv.get(`org_member:${organization_id}:${user.id}`);
    if (!memberData || !['owner', 'admin'].includes(memberData.role)) {
      return c.json({ error: 'Insufficient permissions to send invitations' }, 403);
    }

    const invitationId = crypto.randomUUID();
    const invitation = {
      id: invitationId,
      organization_id,
      invited_by: user.id,
      email,
      phone,
      role,
      permissions,
      project_ids: project_ids || [],
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days expiry
    };

    await kv.set(`invitation:${invitationId}`, invitation);

    // In a real implementation, you would send email/SMS here
    console.log(`Invitation sent to ${email || phone} for organization ${organization_id}`);

    return c.json({ invitation, message: 'Invitation sent successfully' });
  } catch (error) {
    console.log('Send invitation error:', error);
    return c.json({ error: 'Internal server error sending invitation' }, 500);
  }
});

app.post("/make-server-df4644bf/invitations/:id/accept", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const invitationId = c.req.param('id');
    const invitation = await kv.get(`invitation:${invitationId}`);
    
    if (!invitation) {
      return c.json({ error: 'Invitation not found' }, 404);
    }

    if (invitation.status !== 'pending') {
      return c.json({ error: 'Invitation already processed' }, 400);
    }

    if (new Date() > new Date(invitation.expires_at)) {
      return c.json({ error: 'Invitation has expired' }, 400);
    }

    // Add user to organization
    await kv.set(`org_member:${invitation.organization_id}:${user.id}`, {
      organization_id: invitation.organization_id,
      user_id: user.id,
      role: invitation.role,
      permissions: invitation.permissions,
      project_ids: invitation.project_ids,
      joined_at: new Date().toISOString()
    });

    // Update user's organizations list
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      const organizations = userProfile.organizations || [];
      if (!organizations.includes(invitation.organization_id)) {
        organizations.push(invitation.organization_id);
        await kv.set(`user:${user.id}`, { ...userProfile, organizations });
      }
    }

    // Mark invitation as accepted
    await kv.set(`invitation:${invitationId}`, { ...invitation, status: 'accepted', accepted_at: new Date().toISOString() });

    return c.json({ message: 'Invitation accepted successfully' });
  } catch (error) {
    console.log('Accept invitation error:', error);
    return c.json({ error: 'Internal server error accepting invitation' }, 500);
  }
});

// Billing routes
app.post("/make-server-df4644bf/billing/setup", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { organization_id, payment_method, billing_details } = await c.req.json();
    
    // Check if user has billing permissions
    const memberData = await kv.get(`org_member:${organization_id}:${user.id}`);
    if (!memberData || !['owner', 'admin', 'billing_manager'].includes(memberData.role)) {
      return c.json({ error: 'Insufficient permissions for billing setup' }, 403);
    }

    const billingId = crypto.randomUUID();
    const billing = {
      id: billingId,
      organization_id,
      payment_method, // 'google_pay', 'card', etc.
      billing_details,
      setup_by: user.id,
      created_at: new Date().toISOString(),
      status: 'active'
    };

    await kv.set(`billing:${organization_id}`, billing);

    // Update organization subscription status
    const organization = await kv.get(`organization:${organization_id}`);
    if (organization) {
      await kv.set(`organization:${organization_id}`, {
        ...organization,
        subscription_status: 'active',
        billing_setup_at: new Date().toISOString()
      });
    }

    return c.json({ billing, message: 'Billing setup completed successfully' });
  } catch (error) {
    console.log('Billing setup error:', error);
    return c.json({ error: 'Internal server error setting up billing' }, 500);
  }
});

// Role and permissions management
app.post("/make-server-df4644bf/organizations/:id/members/:userId/role", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const organizationId = c.req.param('id');
    const targetUserId = c.req.param('userId');
    const { role, permissions } = await c.req.json();
    
    // Check if user has permission to manage roles
    const memberData = await kv.get(`org_member:${organizationId}:${user.id}`);
    if (!memberData || !['owner', 'admin'].includes(memberData.role)) {
      return c.json({ error: 'Insufficient permissions to manage roles' }, 403);
    }

    // Update target user's role
    const targetMemberData = await kv.get(`org_member:${organizationId}:${targetUserId}`);
    if (!targetMemberData) {
      return c.json({ error: 'User not found in organization' }, 404);
    }

    await kv.set(`org_member:${organizationId}:${targetUserId}`, {
      ...targetMemberData,
      role,
      permissions,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    });

    return c.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.log('Update role error:', error);
    return c.json({ error: 'Internal server error updating role' }, 500);
  }
});

// Get user profile with organizations and roles
app.get("/make-server-df4644bf/profile", async (c) => {
  try {
    const { user, error: authError } = await authenticateUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Get user's organizations with roles
    const organizationIds = userProfile.organizations || [];
    const organizations = [];
    
    for (const orgId of organizationIds) {
      const org = await kv.get(`organization:${orgId}`);
      const memberData = await kv.get(`org_member:${orgId}:${user.id}`);
      if (org && memberData) {
        organizations.push({
          ...org,
          user_role: memberData.role,
          user_permissions: memberData.permissions,
          user_project_ids: memberData.project_ids
        });
      }
    }

    return c.json({
      user: userProfile,
      organizations,
      trial_days_remaining: userProfile.trial_end_date ? 
        Math.max(0, Math.ceil((new Date(userProfile.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0
    });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error fetching profile' }, 500);
  }
});

Deno.serve(app.fetch);