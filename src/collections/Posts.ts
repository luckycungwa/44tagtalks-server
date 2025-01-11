import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (title) => slugify(title, { lower: true, strict: true }).replace(/^\/+|\/+$/g, '');  //make title into slug (behind the hood )

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Allow all users to read posts
    // update: ({ req: { user } }) => Boolean(user), // Only logged-in users can edit
    // admin previledges
    update: ({ req: { user } }) => {
      // Allow admins full access and users to edit their own posts
      if (user?.role === 'admin') return true;
      return false; // Restrict other users
    },
    create: ({ req: { user } }) => {
      // Allow admins to create posts
      if (user?.role === 'admin') return true;
      return false;
    },
    delete: ({ req: { user } }) => {
      // Allow admins to delete posts
      if (user?.role === 'admin') return true;
      return false;
    }

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
    {
      name: 'likes',
      type: 'number',
      defaultValue: 0,
    },
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