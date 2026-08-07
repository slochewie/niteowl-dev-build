create table "mediaFolder" ("id" text not null primary key, "name" text not null, "parentId" text references "mediaFolder" ("id") on delete cascade, "tenantId" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null);

create table "mediaAsset" ("id" text not null primary key, "filename" text not null, "originalName" text not null, "mimeType" text not null, "size" integer not null, "url" text not null, "folderId" text references "mediaFolder" ("id") on delete cascade, "alt" text, "tenantId" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null);
