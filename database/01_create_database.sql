create table if not exists public.user(
  id uuid,
  birthdate date not null,
  name varchar(100) not null,
  email varchar(255) not null unique,
  password varchar(255) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  constraint pk_customer primary key (id)
);
