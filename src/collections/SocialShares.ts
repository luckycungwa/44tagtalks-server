import { CollectionConfig } from 'payload/types';

const SocialShares: CollectionConfig = {
  slug: 'social-shares',
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      name: 'platform',
      type: 'select',
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Instagram', value: 'instagram' },
      ],
      required: true,
    },
    {
      name: 'shareCount',
      type: 'number',
      defaultValue: 0,
    },
  ],
};

export default SocialShares;