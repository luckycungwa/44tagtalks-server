import { CollectionConfig } from 'payload/types';

const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Allow all users to read media
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'text', // Store the image URL
      required: false,
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};

export default Authors;