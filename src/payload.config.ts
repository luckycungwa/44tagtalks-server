import path from 'path';
import { payloadCloud } from '@payloadcms/plugin-cloud';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { slateEditor } from '@payloadcms/richtext-slate';
import { buildConfig } from 'payload/config';
// Collections
import Users from './collections/Users';
import Categories from './collections/Categories';
import Comments from './collections/Comments';
import Media from './collections/Media';
import Posts from './collections/Posts';
import Tags from './collections/Tags';
import Authors from './collections/Authors';
import SocialShares from './collections/SocialShares';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Categories, Comments, Media, Posts, Tags, Authors, SocialShares], //collections here
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});