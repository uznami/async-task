CREATE SCHEMA "app";
CREATE SCHEMA "user";

CREATE TABLE "app"."tables" (
    "table_id" VARCHAR PRIMARY KEY,
    "name" VARCHAR,
    "data_source" JSON
);

CREATE TABLE "app"."steps" (
    "step_id" VARCHAR PRIMARY KEY,
    "table_id" VARCHAR REFERENCES "app"."tables",
    "order" INT,
    "command" VARCHAR,
    "args" JSON,
    "cache" JSON
);

CREATE TABLE "app"."charts" (
    "chart_id" VARCHAR PRIMARY KEY,
    "name" VARCHAR,
    "step_id" VARCHAR REFERENCES "app"."steps",
    "pinned" BOOLEAN,
    "chart_type" VARCHAR,
    "params" JSON
);
