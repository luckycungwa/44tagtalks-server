import express from 'express';
import payload from 'payload';
import multer from 'multer';
import path from 'path';
import userAuthentication from '../middleware/userAuthentication';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to like a post
router.post('/like/:postId', userAuthentication, async (req, res) => {
  const { postId } = req.params;

  try {
    // Find the user
    const user = req.user;

    // Check if the post is already liked
    if (user.likes.some(like => like.post.equals(postId))) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    // Add the post to user's likes
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        likes: [...user.likes, { post: postId }],
      },
    });

    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = { username, email };

    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const newFilename = `${req.file.filename}${fileExt}`;
      fs.renameSync(req.file.path, `uploads/${newFilename}`);
      updateData.image = `/uploads/${newFilename}`;
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: req.user.id,
      data: updateData,
    });

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;