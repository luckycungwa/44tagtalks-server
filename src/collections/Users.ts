import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: () => true,  // Allow everyone to create users (for registration)
    update: ({ req: { user } }) => {
      if (user && user.role === 'admin') return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => {
      return user && user.role === 'admin';
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: false,
      options: [
        'user',
        'admin',
        'editor',
        'developer',
      ],
    },
    {
      name: 'image', //for user image
      type: 'text', // store the image URL
      required: false, // optional
    },
  ],
};

export default Users;
