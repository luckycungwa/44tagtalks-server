import { CollectionConfig } from 'payload/types';
import slugify from 'slugify';

const generateSlug = (name) => slugify(name, { lower: true, strict: true });

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, //allow all users to read posts
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

export default Categories;