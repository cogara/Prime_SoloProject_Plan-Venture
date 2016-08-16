-- Create User Table
CREATE TABLE "users" (
    "id" serial,
    "username" varchar(20) NOT NULL,
    "password" text NOT NULL,
    "email" varchar(80),
    "phone" text,
    PRIMARY KEY ("id"),
    UNIQUE ("username"),
    UNIQUE ("email")
);

-- create trip table
CREATE TABLE "trips" (
    "id" serial,
    "trip_name" text NOT NULL,
    "organizer_id" int NOT NULL,
    "date" date,
    "duration" int,
    "access_code" text,
    "location" varchar(40),
    PRIMARY KEY ("id"),
    UNIQUE ("trip_name"),
    FOREIGN KEY ("organizer_id") REFERENCES "users"("id")
);

CREATE TABLE "trip_messages" (
    "id" serial,
    "user_id" int NOT NULL,
    "trip_id" int NOT NULL,
    "message" varchar(250),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id")
);

CREATE TABLE "trip_equipment" (
    "id" serial,
    "trip_id" int NOT NULL,
    "equipment" text NOT NULL,
    "is_group" boolean,
    "responsible" int,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("responsible") REFERENCES "users"("id"),
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id")
);

CREATE TABLE "trip_assignments" (
    "id" serial,
    "trip_id" int NOT NULL,
    "user_id" int NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id"),
    FOREIGN KEY ("trip_id") REFERENCES "trips"("id")
);

CREATE TABLE "default_equipment" (
    "id" serial,
    "equipment" varchar(20) NOT NULL,
    "user_id" int NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
);
