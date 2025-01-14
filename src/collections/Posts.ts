import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (title) => slugify(title, { lower: true, strict: true }).replace(/^\/+|\/+$/g, '');  //make title into slug (behind the hood )

// Utility to check roles
const isAdmin = (user) => user?.role === 'admin';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  // Admin priveleges
  access: {
    read: () => true,
    update: ({ req }) => !!req.user, // Any authenticated user can update
    create: ({ req }) => !!req.user, // Any authenticated user can create
    delete: ({ req }) => isAdmin(req.user), // Only admins can delete
  },
  
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    // {
    //   name: 'likes',
    //   type: 'number',
    //   defaultValue: 0,
    // },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.title && (!data.slug || data.slug === originalDoc.slug)) {
          data.slug = generateSlug(data.title); // Removed slashes to avoid mismatch
        }
      },
    ],
  },
};

export default Posts;