import { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../media',
  },
  access: {
    read: () => true, // Allow all users to read media
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'credits',
      type: 'text',
    },
  ],
};

export default Media;