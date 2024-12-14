create schema if not exists core;
SET search_path TO core;

------- 1 ------- 
create table if not exists core.tm_type_products
(
    id        serial
        constraint tm_type_products_pk
            primary key,
    category  varchar not null,
    id_images uuid
);

alter table core.tm_type_products
    owner to postgres;

------- 2 ------- 

create table tm_user_type
(
    id        serial
        primary key,
    type_user varchar not null
);


---------- 3 --------------
create table if not exists core.tp_person
(
    id              serial
        primary key,
    names           varchar not null,
    last_name       varchar not null,
    email           varchar not null
        unique,
    birthday        date,
    address         varchar,
    document_number varchar not null,
    type_document   varchar not null,
    country         varchar
);

alter table core.tp_person
    owner to postgres;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--------- 4 ----------

create table if not exists core.tp_products
(
    title           text not null
        unique,
    price           double precision default 0,
    description     text,
    stock           integer          default 0,
    sizes           text[],
    gender          text,
    id_type_product integer,
    id_images       uuid             default uuid_generate_v4()
        constraint unique_id_images
            unique,
    id              serial
        constraint tp_products_pk
            primary key
);

alter table core.tp_products
    owner to postgres;

--------- 5 -------------
create table if not exists core.tp_user
(
    id           serial
        primary key,
    username     varchar              not null
        unique,
    password     varchar              not null,
    id_type_user integer default 2    not null
        constraint fk_tm_user_type
            references core.tm_user_type
            on delete cascade,
    token_app    varchar,
    isactive     boolean default true not null,
    roles        text[],
    refreshtoken varchar
);

alter table core.tp_user
    owner to postgres;


---------- 6 --------
create table if not exists core.ts_images
(
    id     serial
        constraint ts_products_images_pkey
            primary key,
    url      text                                                                not null,
    id_image uuid                                                                not null
);

alter table core.ts_images
    owner to postgres;


------ datos ----- 
 

insert into core.tm_type_products (id, category, id_images)
values  (1, 'anillos', null),
        (2, 'collares', null),
        (3, 'pendientes', null),
        (4, 'dijes', null),
        (5, 'pulseras', null);


insert into core.tm_user_type (id, type_user)
values  (1, 'administrador'),
        (2, 'usuario');

insert into core.tp_person (id, names, last_name, email, birthday, address, document_number, type_document, country)
values  (1, 'Ana', 'Sánchez', 'ana.sanchez@example.com', '1988-03-12', 'Calle de las Joyas 101', '987654321', 'DNI', 'España'),
        (2, 'Carlos', 'Ramírez', 'carlos.ramirez@example.com', '1995-06-25', 'Avenida del Diamante 202', '123456789', 'DNI', 'México'),
        (3, 'Sofía', 'Torres', 'sofia.torres@example.com', '2001-09-30', 'Boulevard de la Plata 303', '456789123', 'DNI', 'Argentina');



