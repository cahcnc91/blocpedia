create table "Users"
(
  id          serial                   not null
    constraint "Users_pkey"
      primary key,
  email       varchar(255)             not null
    constraint "Users_email_key"
      unique,
  password    varchar(255)             not null,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  role        varchar(255)
);

create table "Wikis"
(
  id          serial                   not null
    constraint "Wikis_pkey"
      primary key,
  title       varchar(255)             not null,
  body        varchar(255)             not null,
  private     boolean default false,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "userId"    integer                  not null
    constraint "Wikis_userId_fkey"
      references "Users"
      on delete cascade
);

create table "Collaborators"
(
  id          serial                   not null
    constraint "Collaborators_pkey"
      primary key,
  "wikiId"    integer                  not null
    constraint "Collaborators_wikiId_fkey"
      references "Wikis"
      on delete cascade,
  "userId"    integer                  not null
    constraint "Collaborators_userId_fkey"
      references "Users"
      on delete cascade,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null
);

