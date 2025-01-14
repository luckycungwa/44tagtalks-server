import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (title) => slugify(title, { lower: true, strict: true }).replace(/^\/+|\/+$/g, '');

const isAdminOrEditor = (user) => user?.role === 'admin' || user?.role === 'editor';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true, // Allow everyone to read
    update: ({ req: { user } }) => Boolean(user), // Only logged-in users can edit
    // create: ({ req: { user } }) => {
    //   if (user && user.role === 'admin') return true;
    //   return { id: { equals: user.id } };
    // }, // Only admins and editors can update
    create: ({ req }) => isAdminOrEditor(req.user), // Only admins and editors can create
    delete: ({ req }) => req.user?.role === 'admin', // Only admins can delete
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
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.title && (!data.slug || data.slug === originalDoc.slug)) {
          data.slug = generateSlug(data.title);
        }
      },
    ],
  },
};

export default Posts;
