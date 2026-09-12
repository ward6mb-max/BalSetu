const supabase = require("../config/supabaseClient");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, full_name, role, phone } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password, and role are required." });
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    const userId = authData.user.id;

    const newUserProfile = await prisma.users.create({
      data: {
        id: userId,
        email,
        full_name: full_name || null,
        role,
        phone: phone || null,
      },
    });

    // Create role-specific profile row
    if (role === "ORGANISATION") {
      await prisma.organisations.create({
        data: {
          user_id: userId,
          organisation_name: full_name || "Unnamed Organisation",
          email,
          phone: phone || null,
        },
      });
    } else if (role === "PROSPECTIVE_PARENT") {
      await prisma.prospective_parents.create({
        data: {
          user_id: userId,
          parent_reference: `PARENT-${Date.now()}`,
        },
      });
    } else if (role === "VOLUNTEER") {
      await prisma.volunteers.create({
        data: {
          user_id: userId,
          volunteer_code: `VOL-${Date.now()}`,
          volunteer_type: "MENTOR", // default; can be changed later
        },
      });
    }

    res.status(201).json({ message: "User registered successfully", user: newUserProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong.", details: err.message });
  }
};

// LOGIN stays the same as before
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: "Login successful",
      access_token: data.session.access_token,
      user: data.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { register, login };