import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (title) => slugify(title, { lower: true, strict: true }).replace(/^\/+|\/+$/g, '');  //make title into slug (behind the hood )

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  // Admin priveleges
  access: {
    read: () => true,
    update: ({ req }) => {
      if (req.user) {
        console.log('User attempting update:', req.user);
        return true; // Allow any authenticated user in admin panel to update
      }
      return false;
    },
    create: ({ req }) => {
      if (req.user) return true;
      return false;
    },
    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true;
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