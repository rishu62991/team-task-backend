const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    // For now, we'll fetch all projects. 
    // In a real app, you'd filter by user ID from the session/token.
    const projects = await Project.find()
      .populate('creatorId', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const formattedProjects = projects.map(p => ({
      ...p,
      id: p._id.toString(),
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST new project
router.post('/', async (req, res) => {
  try {
    const { name, description, memberIds, status, creatorId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      creatorId, // Expecting this from frontend for now
      members: Array.from(new Set([...(memberIds || []), creatorId])),
      status: status || "ACTIVE",
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
