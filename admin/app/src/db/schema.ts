import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const post = pgTable("post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").default("").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postTag = pgTable("post_tag", {
  id: text("id").primaryKey(),
  postId: text("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tag.id, { onDelete: "cascade" }),
});

export const contentType = pgTable("content_type", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  jsonSchema: text("json_schema").notNull(),
  fieldConfig: text("field_config"),
  autoFormVersion: integer("auto_form_version"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentItem = pgTable("content_item", {
  id: text("id").primaryKey(),
  contentTypeId: text("content_type_id")
    .notNull()
    .references(() => contentType.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  data: text("data").notNull(),
  authorId: text("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentRelation = pgTable("content_relation", {
  id: text("id").primaryKey(),
  sourceId: text("source_id")
    .notNull()
    .references(() => contentItem.id, { onDelete: "cascade" }),
  targetId: text("target_id")
    .notNull()
    .references(() => contentItem.id, { onDelete: "cascade" }),
  fieldName: text("field_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const form = pgTable("form", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  schema: text("schema").notNull(),
  successMessage: text("success_message"),
  redirectUrl: text("redirect_url"),
  status: text("status").default("active").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formSubmission = pgTable("form_submission", {
  id: text("id").primaryKey(),
  formId: text("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  data: text("data").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  submittedBy: text("submitted_by"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const kanbanBoard = pgTable("kanban_board", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ownerId: text("owner_id"),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kanbanColumn = pgTable("kanban_column", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").default(0).notNull(),
  boardId: text("board_id")
    .notNull()
    .references(() => kanbanBoard.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const kanbanTask = pgTable("kanban_task", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").default("MEDIUM").notNull(),
  order: integer("order").default(0).notNull(),
  columnId: text("column_id")
    .notNull()
    .references(() => kanbanColumn.id, { onDelete: "cascade" }),
  assigneeId: text("assignee_id"),
  completedAt: timestamp("completed_at"),
  isArchived: boolean("is_archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const comment = pgTable("comment", {
  id: text("id").primaryKey(),
  resourceId: text("resource_id").notNull(),
  resourceType: text("resource_type").notNull(),
  parentId: text("parent_id"),
  authorId: text("author_id").notNull(),
  body: text("body").notNull(),
  status: text("status").default("pending").notNull(),
  likes: integer("likes").default(0).notNull(),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentLike = pgTable("comment_like", {
  id: text("id").primaryKey(),
  commentId: text("comment_id")
    .notNull()
    .references(() => comment.id, { onDelete: "cascade" }),
  authorId: text("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  folderId: text("folder_id").references(() => mediaFolder.id, {
    onDelete: "cascade",
  }),
  alt: text("alt"),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaFolder = pgTable("media_folder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id").references(() => mediaFolder.id, {
    onDelete: "cascade",
  }),
  tenantId: text("tenant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postRelations = relations(post, ({ many }) => ({
  postTags: many(postTag),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  postTags: many(postTag),
}));

export const postTagRelations = relations(postTag, ({ one }) => ({
  post: one(post, {
    fields: [postTag.postId],
    references: [post.id],
  }),
  tag: one(tag, {
    fields: [postTag.tagId],
    references: [tag.id],
  }),
}));

export const contentTypeRelations = relations(contentType, ({ many }) => ({
  contentItems: many(contentItem),
}));

export const contentItemRelations = relations(contentItem, ({ one, many }) => ({
  contentType: one(contentType, {
    fields: [contentItem.contentTypeId],
    references: [contentType.id],
  }),
  contentRelations: many(contentRelation),
}));

export const contentRelationSourceIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.sourceId],
      references: [contentItem.id],
    }),
  }),
);

export const contentRelationTargetIdRelations = relations(
  contentRelation,
  ({ one }) => ({
    contentItem: one(contentItem, {
      fields: [contentRelation.targetId],
      references: [contentItem.id],
    }),
  }),
);

export const formRelations = relations(form, ({ many }) => ({
  formSubmissions: many(formSubmission),
}));

export const formSubmissionRelations = relations(formSubmission, ({ one }) => ({
  form: one(form, {
    fields: [formSubmission.formId],
    references: [form.id],
  }),
}));

export const kanbanBoardRelations = relations(kanbanBoard, ({ many }) => ({
  kanbanColumns: many(kanbanColumn),
}));

export const kanbanColumnRelations = relations(
  kanbanColumn,
  ({ one, many }) => ({
    kanbanBoard: one(kanbanBoard, {
      fields: [kanbanColumn.boardId],
      references: [kanbanBoard.id],
    }),
    kanbanTasks: many(kanbanTask),
  }),
);

export const kanbanTaskRelations = relations(kanbanTask, ({ one }) => ({
  kanbanColumn: one(kanbanColumn, {
    fields: [kanbanTask.columnId],
    references: [kanbanColumn.id],
  }),
}));

export const commentRelations = relations(comment, ({ many }) => ({
  commentLikes: many(commentLike),
}));

export const commentLikeRelations = relations(commentLike, ({ one }) => ({
  comment: one(comment, {
    fields: [commentLike.commentId],
    references: [comment.id],
  }),
}));

export const mediaAssetRelations = relations(mediaAsset, ({ one }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaAsset.folderId],
    references: [mediaFolder.id],
  }),
}));

export const mediaFolderRelations = relations(mediaFolder, ({ one, many }) => ({
  mediaFolder: one(mediaFolder, {
    fields: [mediaFolder.parentId],
    references: [mediaFolder.id],
  }),
  mediaAssets: many(mediaAsset),
}));