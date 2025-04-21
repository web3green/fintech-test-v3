create table "public"."admin_credentials" (
    "id" uuid not null default gen_random_uuid(),
    "username" text not null,
    "password" text not null,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."admin_credentials" enable row level security;

create table "public"."article_reactions" (
    "id" uuid not null default uuid_generate_v4(),
    "article_id" uuid not null,
    "reaction_type" text not null,
    "user_id" text not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."article_reactions" enable row level security;

create table "public"."articles" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null,
    "category" text not null,
    "resource_name" text,
    "resource_url" text,
    "article_format" text,
    "published" boolean default false,
    "date" date default CURRENT_DATE,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."articles" enable row level security;

create table "public"."blog_posts" (
    "id" uuid not null default uuid_generate_v4(),
    "title_en" text not null,
    "title_ru" text not null,
    "content_en" text not null,
    "content_ru" text not null,
    "excerpt_en" text not null,
    "excerpt_ru" text not null,
    "image_url" text,
    "author" text not null,
    "category" text not null,
    "reading_time" text not null,
    "tags" text[] default '{}'::text[],
    "featured" boolean default false,
    "color_scheme" text not null default 'blue'::text,
    "published" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."blog_posts" enable row level security;

CREATE UNIQUE INDEX admin_credentials_pkey ON public.admin_credentials USING btree (id);

CREATE INDEX admin_credentials_username_idx ON public.admin_credentials USING btree (username);

CREATE UNIQUE INDEX admin_credentials_username_key ON public.admin_credentials USING btree (username);

CREATE INDEX article_reactions_article_id_idx ON public.article_reactions USING btree (article_id);

CREATE UNIQUE INDEX article_reactions_article_id_reaction_type_user_id_key ON public.article_reactions USING btree (article_id, reaction_type, user_id);

CREATE UNIQUE INDEX article_reactions_pkey ON public.article_reactions USING btree (id);

CREATE INDEX article_reactions_user_id_idx ON public.article_reactions USING btree (user_id);

CREATE UNIQUE INDEX articles_pkey ON public.articles USING btree (id);

CREATE INDEX blog_posts_category_idx ON public.blog_posts USING btree (category);

CREATE INDEX blog_posts_created_at_idx ON public.blog_posts USING btree (created_at);

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE INDEX blog_posts_published_idx ON public.blog_posts USING btree (published);

alter table "public"."admin_credentials" add constraint "admin_credentials_pkey" PRIMARY KEY using index "admin_credentials_pkey";

alter table "public"."article_reactions" add constraint "article_reactions_pkey" PRIMARY KEY using index "article_reactions_pkey";

alter table "public"."articles" add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."admin_credentials" add constraint "admin_credentials_username_key" UNIQUE using index "admin_credentials_username_key";

alter table "public"."article_reactions" add constraint "article_reactions_article_id_fkey" FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE not valid;

alter table "public"."article_reactions" validate constraint "article_reactions_article_id_fkey";

alter table "public"."article_reactions" add constraint "article_reactions_article_id_reaction_type_user_id_key" UNIQUE using index "article_reactions_article_id_reaction_type_user_id_key";

alter table "public"."article_reactions" add constraint "article_reactions_reaction_type_check" CHECK ((reaction_type = ANY (ARRAY['like'::text, 'dislike'::text, 'useful'::text]))) not valid;

alter table "public"."article_reactions" validate constraint "article_reactions_reaction_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."admin_credentials" to "anon";

grant insert on table "public"."admin_credentials" to "anon";

grant references on table "public"."admin_credentials" to "anon";

grant select on table "public"."admin_credentials" to "anon";

grant trigger on table "public"."admin_credentials" to "anon";

grant truncate on table "public"."admin_credentials" to "anon";

grant update on table "public"."admin_credentials" to "anon";

grant delete on table "public"."admin_credentials" to "authenticated";

grant insert on table "public"."admin_credentials" to "authenticated";

grant references on table "public"."admin_credentials" to "authenticated";

grant select on table "public"."admin_credentials" to "authenticated";

grant trigger on table "public"."admin_credentials" to "authenticated";

grant truncate on table "public"."admin_credentials" to "authenticated";

grant update on table "public"."admin_credentials" to "authenticated";

grant delete on table "public"."admin_credentials" to "service_role";

grant insert on table "public"."admin_credentials" to "service_role";

grant references on table "public"."admin_credentials" to "service_role";

grant select on table "public"."admin_credentials" to "service_role";

grant trigger on table "public"."admin_credentials" to "service_role";

grant truncate on table "public"."admin_credentials" to "service_role";

grant update on table "public"."admin_credentials" to "service_role";

grant delete on table "public"."article_reactions" to "anon";

grant insert on table "public"."article_reactions" to "anon";

grant references on table "public"."article_reactions" to "anon";

grant select on table "public"."article_reactions" to "anon";

grant trigger on table "public"."article_reactions" to "anon";

grant truncate on table "public"."article_reactions" to "anon";

grant update on table "public"."article_reactions" to "anon";

grant delete on table "public"."article_reactions" to "authenticated";

grant insert on table "public"."article_reactions" to "authenticated";

grant references on table "public"."article_reactions" to "authenticated";

grant select on table "public"."article_reactions" to "authenticated";

grant trigger on table "public"."article_reactions" to "authenticated";

grant truncate on table "public"."article_reactions" to "authenticated";

grant update on table "public"."article_reactions" to "authenticated";

grant delete on table "public"."article_reactions" to "service_role";

grant insert on table "public"."article_reactions" to "service_role";

grant references on table "public"."article_reactions" to "service_role";

grant select on table "public"."article_reactions" to "service_role";

grant trigger on table "public"."article_reactions" to "service_role";

grant truncate on table "public"."article_reactions" to "service_role";

grant update on table "public"."article_reactions" to "service_role";

grant delete on table "public"."articles" to "anon";

grant insert on table "public"."articles" to "anon";

grant references on table "public"."articles" to "anon";

grant select on table "public"."articles" to "anon";

grant trigger on table "public"."articles" to "anon";

grant truncate on table "public"."articles" to "anon";

grant update on table "public"."articles" to "anon";

grant delete on table "public"."articles" to "authenticated";

grant insert on table "public"."articles" to "authenticated";

grant references on table "public"."articles" to "authenticated";

grant select on table "public"."articles" to "authenticated";

grant trigger on table "public"."articles" to "authenticated";

grant truncate on table "public"."articles" to "authenticated";

grant update on table "public"."articles" to "authenticated";

grant delete on table "public"."articles" to "service_role";

grant insert on table "public"."articles" to "service_role";

grant references on table "public"."articles" to "service_role";

grant select on table "public"."articles" to "service_role";

grant trigger on table "public"."articles" to "service_role";

grant truncate on table "public"."articles" to "service_role";

grant update on table "public"."articles" to "service_role";

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

create policy "Admin can read own credentials"
on "public"."admin_credentials"
as permissive
for select
to authenticated
using (((auth.uid())::text = 'admin'::text));


create policy "Admin can update own credentials"
on "public"."admin_credentials"
as permissive
for update
to authenticated
using (((auth.uid())::text = 'admin'::text));


create policy "Anonymous users can add reactions"
on "public"."article_reactions"
as permissive
for insert
to anon
with check ((user_id ~~ 'anon_%'::text));


create policy "Anyone can read reactions"
on "public"."article_reactions"
as permissive
for select
to public
using (true);


create policy "Users can add their reactions"
on "public"."article_reactions"
as permissive
for insert
to authenticated
with check (((auth.uid())::text = user_id));


create policy "Users can delete their own reactions"
on "public"."article_reactions"
as permissive
for delete
to public
using ((((auth.uid())::text = user_id) OR (user_id ~~ 'anon_%'::text)));


create policy "Articles are viewable by everyone"
on "public"."articles"
as permissive
for select
to public
using (true);


create policy "Admin can delete blog posts"
on "public"."blog_posts"
as permissive
for delete
to authenticated
using (((auth.uid())::text = 'admin'::text));


create policy "Admin can insert blog posts"
on "public"."blog_posts"
as permissive
for insert
to authenticated
with check (((auth.uid())::text = 'admin'::text));


create policy "Admin can read all blog posts"
on "public"."blog_posts"
as permissive
for select
to authenticated
using (((auth.uid())::text = 'admin'::text));


create policy "Admin can update blog posts"
on "public"."blog_posts"
as permissive
for update
to authenticated
using (((auth.uid())::text = 'admin'::text));


create policy "Anyone can read published blog posts"
on "public"."blog_posts"
as permissive
for select
to public
using ((published = true));


create policy "Authenticated users can manage posts"
on "public"."blog_posts"
as permissive
for all
to authenticated, anon
using (true)
with check (true);


CREATE TRIGGER update_admin_credentials_updated_at BEFORE UPDATE ON public.admin_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_blog_posts_updated_at();


