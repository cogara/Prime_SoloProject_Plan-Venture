-- Create User Table
CREATE TABLE "users" (
    "id" serial,
    "username" varchar(20) NOT NULL,
    "password" text NOT NULL,
    "email" varchar(80),
    PRIMARY KEY ("id"),
    UNIQUE ("username"),
    UNIQUE ('email')
);

-- create trip table
CREATE TABLE "public"."trip_testing" (
    "id" serial,
    "user" int,
    PRIMARY KEY ("id"),
    CONSTRAINT "User ID" FOREIGN KEY ("users") REFERENCES "public"."users"("id"),
    UNIQUE ("user")
);
