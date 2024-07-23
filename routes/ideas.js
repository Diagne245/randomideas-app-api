const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.status(200).json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// get single idea
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.status(200).json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// add idea
router.post('/', async (req, res) => {
  const idea = new Idea({
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  });
  try {
    const savedIdea = await idea.save();
    res.status(200).json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    // case username matches the idea username
    if (idea.username === req.body.username) {
      const updatedIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        { new: true }
      );
      return res.status(200).json({ success: true, data: updatedIdea });
    }
    // case username doesn't matches the idea username
    return res.status(403).json({
      success: false,
      error: 'You are not authorized to update that resource',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// delete an idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    // case username matches the idea
    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, data: {} });
    }
    // case username doesn't matches the idea
    return res.status(403).json({
      success: false,
      error: 'You are not authorized to delete that resource',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
