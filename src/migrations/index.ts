import * as migration_20260403_153719_initial from './20260403_153719_initial';
import * as migration_20260403_205719_vastgoed_collections from './20260403_205719_vastgoed_collections';
import * as migration_20260403_212800_simplified_header from './20260403_212800_simplified_header';
import * as migration_20260404_134400_s3_storage from './20260404_134400_s3_storage';
import * as migration_20260404_203500_form_submissions_and_drafts from './20260404_203500_form_submissions_and_drafts';
import * as migration_20260407_120000_cms_driven_content from './20260407_120000_cms_driven_content';
import * as migration_20260407_140000_logo_wit from './20260407_140000_logo_wit';
import * as migration_20260407_160000_drop_slug_unique from './20260407_160000_drop_slug_unique';

export const migrations = [
  {
    up: migration_20260403_153719_initial.up,
    down: migration_20260403_153719_initial.down,
    name: '20260403_153719_initial',
  },
  {
    up: migration_20260403_205719_vastgoed_collections.up,
    down: migration_20260403_205719_vastgoed_collections.down,
    name: '20260403_205719_vastgoed_collections',
  },
  {
    up: migration_20260403_212800_simplified_header.up,
    down: migration_20260403_212800_simplified_header.down,
    name: '20260403_212800_simplified_header',
  },
  {
    up: migration_20260404_134400_s3_storage.up,
    down: migration_20260404_134400_s3_storage.down,
    name: '20260404_134400_s3_storage',
  },
  {
    up: migration_20260404_203500_form_submissions_and_drafts.up,
    down: migration_20260404_203500_form_submissions_and_drafts.down,
    name: '20260404_203500_form_submissions_and_drafts',
  },
  {
    up: migration_20260407_120000_cms_driven_content.up,
    down: migration_20260407_120000_cms_driven_content.down,
    name: '20260407_120000_cms_driven_content',
  },
  {
    up: migration_20260407_140000_logo_wit.up,
    down: migration_20260407_140000_logo_wit.down,
    name: '20260407_140000_logo_wit',
  },
  {
    up: migration_20260407_160000_drop_slug_unique.up,
    down: migration_20260407_160000_drop_slug_unique.down,
    name: '20260407_160000_drop_slug_unique',
  },
];
