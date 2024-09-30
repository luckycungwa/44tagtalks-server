import { CollectionConfig } from 'payload/types'

const Comments : CollectionConfig = {
    slug: 'comments',
    fields: [
      {
        name: 'post',
        type: 'relationship',
        relationTo: 'posts',
      },
      {
        name: 'user',
        type: 'relationship',
        relationTo: 'users',
      },
      {
        name: 'comment',
        type: 'text',
        required: true,
      },
    ],
  };
  
  export default Comments;
  