// Temporary in-memory storage — will switch to Prisma once DB is connected
const children = [];
let nextId = 1;

// CREATE a child profile
const createChild = (req, res) => {
  try {
    const {
      age,
      educationLevel,
      educationalGoals,
      financialNeeds,
      mentorshipNeeded,
      adoptionStatus,
    } = req.body;

    if (!age || !educationLevel) {
      return res.status(400).json({ error: "Age and education level are required." });
    }

    const newChild = {
      id: nextId++,
      protectedId: `CHILD-${Date.now()}`, // placeholder for a protected/anonymized ID
      age,
      educationLevel,
      educationalGoals: educationalGoals || "",
      financialNeeds: financialNeeds || "",
      mentorshipNeeded: mentorshipNeeded || false,
      adoptionStatus: adoptionStatus || "not-applicable",
      createdBy: req.user.userId,
    };

    children.push(newChild);

    res.status(201).json({ message: "Child profile created successfully", child: newChild });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

// GET all child profiles (list view — protects sensitive info)
const getAllChildren = (req, res) => {
  const publicView = children.map((c) => ({
    id: c.id,
    protectedId: c.protectedId,
    age: c.age,
    educationLevel: c.educationLevel,
    adoptionStatus: c.adoptionStatus,
  }));

  res.json({ children: publicView });
};

// GET one child profile by ID (fuller detail — later we'll restrict by role)
const getChildById = (req, res) => {
  const child = children.find((c) => c.id === parseInt(req.params.id));

  if (!child) {
    return res.status(404).json({ error: "Child profile not found." });
  }

  res.json({ child });
};

module.exports = { createChild, getAllChildren, getChildById };