import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (name) => slugify(name, { lower: true, strict: true });

const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data.name && (!data.slug || data.slug === originalDoc.slug)) {
          data.slug = generateSlug(data.name);
        }
      },
    ],
  },
};

export default Tags;