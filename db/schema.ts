import {sqliteTable,text,integer,primaryKey} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('records',{id:text('id').primaryKey(),owner:text('owner').notNull(),kind:text('kind').notNull(),data:text('data').notNull(),updated:text('updated').notNull()});
export const administrators=sqliteTable('administrators',{slot:text('slot').primaryKey(),userId:text('user_id').notNull()});
export const aiUsage=sqliteTable('ai_usage',{owner:text('owner').notNull(),hour:text('hour').notNull(),count:integer('count').notNull()},table=>[primaryKey({columns:[table.owner,table.hour]})]);
export const accountUsers=sqliteTable('account_users',{id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),passwordHash:text('password_hash').notNull(),role:text('role').notNull(),createdAt:text('created_at').notNull()});
export const accountSessions=sqliteTable('account_sessions',{tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().references(()=>accountUsers.id,{onDelete:'cascade'}),expiresAt:integer('expires_at').notNull()});
export const authAttempts=sqliteTable('auth_attempts',{key:text('key').notNull(),bucket:integer('bucket').notNull(),count:integer('count').notNull(),expiresAt:integer('expires_at').notNull()},table=>[primaryKey({columns:[table.key,table.bucket]})]);
