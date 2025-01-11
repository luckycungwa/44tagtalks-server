// src/routes/contentRoutes.js
import express from 'express';
import payload from 'payload';

const router = express.Router();

router.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  next();
});

// Route to get all posts
router.get('/posts', async (req, res) => {
  const { page = 1, limit = 16 } = req.query; // Get page and limit from query params, default to 1st page with 16 posts
  try {
    const posts = await payload.find({
      collection: 'posts',
      limit: parseInt(limit),
      page: parseInt(page),
      sort: '-publishDate',
      where: {
        publishDate: {
          lte: new Date(),
        },
      },
    });
    res.json(posts); // Return posts with pagination
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: error.message });
  }
});


// router.get('/posts', async (req, res) => {
//   try {
//     const posts = await payload.find({
//       collection: 'posts',
//     });
//     const slugs = posts.docs.map(post => post.slug);
//     res.json(slugs); // Return all slugs for debugging
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Route to get a post by slug
router.get('/posts/:id/:slug', async (req, res) => {
  const { id, slug } = req.params;

  console.log(`Received slug: ${slug}`); // Log received slug for debugging
  try {
    // Find post by ID
    const post = await payload.findByID({
      collection: 'posts',
      id,
      depth: 1,
    });
    console.log(`Post slug from database: ${post.slug}`); // Log post slug from database

    // Check if the slug matches the post
    if (post.slug !== slug) {
      console.log(`Slug mismatch: ${post.slug} !== ${slug}`); // Log slug mismatch
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get media by ID
router.get('/media/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const media = await payload.findOne({
      collection: 'media',
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to search posts
router.get('/posts/search', async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const posts = await payload.find({
      collection: 'posts',
      where: {
        or: [
          { title: { contains: search } }, // Search by title
          { body: { contains: search } },  // Search by body/content
        ],
      },
      limit: 16, // You can adjust this limit based on your need
    });

    res.json(posts.docs); // Return the matched posts
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search posts by title
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.search; // Get search term from query parameter

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Fetch posts matching the search term
    const results = await payload.find({
      collection: 'posts',
      where: {
        title: {
          contains: searchTerm, // Search for posts containing the search term in the title
        },
      },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Edit Post
// Route to update a post
// router.put('/posts/:id', async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   try {
//     // Verify user has permission (you can modify this based on your needs)
//     if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
//       return res.status(403).json({ error: 'Unauthorized to update posts' });
//     }

//     // Update the post
//     const updatedPost = await payload.update({
//       collection: 'posts',
//       id: id,
//       data: {
//         title: updateData.title,
//         body: updateData.body,
//         categories: updateData.categories,
//         media: updateData.media,
//         publishDate: updateData.publishDate,
//         // Add any other fields you want to be updatable
//       }
//     });

//     res.json(updatedPost);
//   } catch (error) {
//     console.error('Error updating post:', error);
//     res.status(500).json({ error: error.message });
//   }
// });



// Route to get comments for a specific post
router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await payload.find({
      collection: 'comments',
      where: {
        post: {
          equals: postId,
        },
      },
    });
    res.json(comments.docs); // Return the array of comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to submit a new comment
router.post('/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { userId, comment } = req.body; // Assuming userId is sent with the comment

  try {
    // Create a new comment
    const newComment = await payload.create({
      collection: 'comments',
      data: {
        post: postId,
        user: userId, // Reference to the user who commented
        comment,
      },
    });

    res.status(201).json(newComment); // Return the newly created comment
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;