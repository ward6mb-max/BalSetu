const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE a child profile
const createChild = async (req, res) => {
  try {
    const { age_group, education_level, sibling_group_id } = req.body;

    // Find the organisation linked to the logged-in user
    const organisation = await prisma.organisations.findFirst({
      where: { user_id: req.user.id },
    });

    if (!organisation) {
      return res.status(400).json({ error: "No organisation profile found for this user." });
    }

    const newChild = await prisma.children.create({
      data: {
        child_code: `CHILD-${Date.now()}`,
        age_group: age_group || null,
        education_level: education_level || null,
        organisation_id: organisation.id,
        sibling_group_id: sibling_group_id || null,
      },
    });

    res.status(201).json({ message: "Child profile created successfully", child: newChild });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong.", details: err.message });
  }
};

// GET all child profiles (basic public-safe view)
const getAllChildren = async (req, res) => {
  try {
    const children = await prisma.children.findMany({
      select: {
        id: true,
        child_code: true,
        age_group: true,
        education_level: true,
        general_status: true,
      },
    });

    res.json({ children });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// GET one child profile by ID
const getChildById = async (req, res) => {
  try {
    const child = await prisma.children.findUnique({
      where: { id: req.params.id },
      include: {
        educational_needs: true,
        funding_goals: true,
      },
    });

    if (!child) {
      return res.status(404).json({ error: "Child profile not found." });
    }

    res.json({ child });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = { createChild, getAllChildren, getChildById };