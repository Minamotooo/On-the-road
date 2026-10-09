-- =====================================================================
--  On the Road — database schema
--  Rebuilt from the queries used by the Express backend (backend/*.js)
--  and the original CSV table exports.
-- =====================================================================

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- ---------------------------------------------------------------------
--  Administrative geography of Bangladesh
--  division -> district -> upazilla -> union
-- ---------------------------------------------------------------------
CREATE TABLE divisions (
    division_id   INTEGER PRIMARY KEY,
    name          VARCHAR(50)  NOT NULL UNIQUE,
    bn_name       VARCHAR(50),
    url           TEXT,          -- cover image shown on the tourist spot page
    website       VARCHAR(100)   -- official divisional website
);

CREATE TABLE districts (
    district_id   INTEGER PRIMARY KEY,
    division_id   INTEGER NOT NULL REFERENCES divisions (division_id),
    name          VARCHAR(50) NOT NULL,
    bn_name       VARCHAR(50),
    lat           NUMERIC(10, 7),
    lon           NUMERIC(10, 7),
    url           VARCHAR(100)
);

CREATE TABLE upazillas (
    upazilla_id   INTEGER PRIMARY KEY,
    district_id   INTEGER NOT NULL REFERENCES districts (district_id),
    name          VARCHAR(50) NOT NULL,
    bn_name       VARCHAR(50),
    url           VARCHAR(100)
);

CREATE TABLE unions (
    union_id      INTEGER PRIMARY KEY,
    upazilla_id   INTEGER NOT NULL REFERENCES upazillas (upazilla_id),
    name          VARCHAR(50) NOT NULL,
    bn_name       VARCHAR(50),
    url           VARCHAR(100)
);

-- ---------------------------------------------------------------------
--  Travellers
-- ---------------------------------------------------------------------
CREATE TABLE client_user (
    username        VARCHAR(50) PRIMARY KEY,
    password        VARCHAR(100) NOT NULL,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    house_no        VARCHAR(20),
    road_no         VARCHAR(20),
    road_name       VARCHAR(100),
    district        VARCHAR(50),
    division        VARCHAR(50),
    zip_code        VARCHAR(10),
    phone_no        VARCHAR(20),
    email           VARCHAR(100) NOT NULL UNIQUE,
    profile_photo   TEXT,
    date_of_birth   DATE,
    created_on      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sus             VARCHAR(3) NOT NULL DEFAULT 'no' CHECK (sus IN ('yes', 'no'))
);

-- Rows land here through the trg_archive_deleted_client trigger
CREATE TABLE deleted_client_user (
    username        VARCHAR(50) PRIMARY KEY,
    password        VARCHAR(100) NOT NULL,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    house_no        VARCHAR(20),
    road_no         VARCHAR(20),
    road_name       VARCHAR(100),
    district        VARCHAR(50),
    division        VARCHAR(50),
    zip_code        VARCHAR(10),
    phone_no        VARCHAR(20),
    email           VARCHAR(100) NOT NULL,
    profile_photo   TEXT,
    date_of_birth   DATE,
    created_on      TIMESTAMP,
    deleted_on      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
--  Businesses (hotels, restaurants, ...) share one username space
-- ---------------------------------------------------------------------
CREATE TABLE business_entity (
    username       VARCHAR(50) PRIMARY KEY,
    business_type  VARCHAR(20) NOT NULL
        CHECK (business_type IN ('Hotel', 'Restaurant', 'Tour Guide', 'Transport Agency'))
);

CREATE TABLE hotel (
    hotel_id        SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE
                    REFERENCES business_entity (username) ON DELETE CASCADE,
    password        VARCHAR(100) NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name            VARCHAR(100) NOT NULL,
    union_id        INTEGER NOT NULL REFERENCES unions (union_id),
    address         VARCHAR(200),
    phone_no        VARCHAR(20),
    email           VARCHAR(100),
    photo           TEXT,
    description     TEXT,
    average_rating  NUMERIC(2, 1) NOT NULL DEFAULT 0
);

CREATE TABLE hotel_rooms (
    hotel_id              INTEGER NOT NULL REFERENCES hotel (hotel_id) ON DELETE CASCADE,
    room_type             VARCHAR(50) NOT NULL,
    available_rooms_left  INTEGER NOT NULL CHECK (available_rooms_left >= 0),
    price_per_night       NUMERIC(10, 2) NOT NULL CHECK (price_per_night > 0),
    capacity              INTEGER NOT NULL CHECK (capacity > 0),
    amenities             TEXT,
    image                 TEXT,
    PRIMARY KEY (hotel_id, room_type)
);

CREATE TABLE hotel_room_booking (
    booking_id                 SERIAL PRIMARY KEY,
    client_username            VARCHAR(50) NOT NULL
                               REFERENCES client_user (username) ON DELETE CASCADE,
    hotel_id                   INTEGER NOT NULL,
    room_type                  VARCHAR(50) NOT NULL,
    no_of_rooms                INTEGER NOT NULL CHECK (no_of_rooms > 0),
    check_in_date              DATE NOT NULL,
    check_out_date             DATE NOT NULL,
    total_bill                 NUMERIC(12, 2) NOT NULL,
    payment_completion_status  VARCHAR(10) NOT NULL DEFAULT 'PENDING'
        CHECK (payment_completion_status IN ('PENDING', 'ONGOING', 'COMPLETED', 'DENIED')),
    booking_date               DATE NOT NULL DEFAULT CURRENT_DATE,
    CHECK (check_out_date > check_in_date),
    FOREIGN KEY (hotel_id, room_type)
        REFERENCES hotel_rooms (hotel_id, room_type) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE restaurant (
    restaurant_id   SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL UNIQUE
                    REFERENCES business_entity (username) ON DELETE CASCADE,
    password        VARCHAR(100) NOT NULL,
    created_on      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name            VARCHAR(100) NOT NULL,
    cuisine         VARCHAR(50),
    union_id        INTEGER NOT NULL REFERENCES unions (union_id),
    plot_no         VARCHAR(20),
    road_no         VARCHAR(20),
    road_name       VARCHAR(100),
    zip_code        VARCHAR(10),
    phone_no        VARCHAR(20),
    email           VARCHAR(100),
    image           TEXT,
    price_point     VARCHAR(3) NOT NULL DEFAULT '$$' CHECK (price_point IN ('$', '$$', '$$$')),
    description     TEXT
);

-- Hotel (and other business) reviews
CREATE TABLE reviews (
    review_id          SERIAL PRIMARY KEY,
    rating             INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment            TEXT,
    image              TEXT,
    business_username  VARCHAR(50) NOT NULL
                       REFERENCES business_entity (username) ON DELETE CASCADE,
    client_username    VARCHAR(50) NOT NULL
                       REFERENCES client_user (username) ON DELETE CASCADE,
    review_date        DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ---------------------------------------------------------------------
--  Tourist spots and their blog comments
-- ---------------------------------------------------------------------
CREATE TABLE tourist_spot (
    spot_id           SERIAL PRIMARY KEY,
    union_id          INTEGER NOT NULL REFERENCES unions (union_id),
    name              VARCHAR(100) NOT NULL,
    blog_description  TEXT,
    image             TEXT,
    average_rating    NUMERIC(2, 1) NOT NULL DEFAULT 0
);

CREATE TABLE tourist_spot_blog_comment (
    comment_id       SERIAL PRIMARY KEY,
    client_username  VARCHAR(50) NOT NULL
                     REFERENCES client_user (username) ON DELETE CASCADE,
    spot_id          INTEGER NOT NULL REFERENCES tourist_spot (spot_id) ON DELETE CASCADE,
    comment_content  TEXT NOT NULL,
    rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment_date     DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ---------------------------------------------------------------------
--  Tour guides and transport (in the original export, not used by the UI yet)
-- ---------------------------------------------------------------------
CREATE TABLE tour_guide (
    tour_guide_id     SERIAL PRIMARY KEY,
    username          VARCHAR(50) NOT NULL UNIQUE
                      REFERENCES business_entity (username) ON DELETE CASCADE,
    password          VARCHAR(100) NOT NULL,
    created_on        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_on   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    first_name        VARCHAR(50),
    last_name         VARCHAR(50),
    district_id       INTEGER REFERENCES districts (district_id),
    phone_no          VARCHAR(20),
    email             VARCHAR(100),
    booking_fee       NUMERIC(10, 2),
    date_of_birth     DATE,
    language_spoken1  VARCHAR(30),
    language_spoken2  VARCHAR(30),
    language_spoken3  VARCHAR(30),
    profile_photo     TEXT,
    about_info        TEXT
);

CREATE TABLE tour_guide_booking (
    booking_id                 SERIAL PRIMARY KEY,
    client_username            VARCHAR(50) NOT NULL
                               REFERENCES client_user (username) ON DELETE CASCADE,
    tour_guide_id              INTEGER NOT NULL REFERENCES tour_guide (tour_guide_id) ON DELETE CASCADE,
    hiring_date                DATE NOT NULL,
    total_bill                 NUMERIC(12, 2),
    payment_completion_status  VARCHAR(10) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE transport_agency (
    transport_agency_id  SERIAL PRIMARY KEY,
    username             VARCHAR(50) NOT NULL UNIQUE
                         REFERENCES business_entity (username) ON DELETE CASCADE,
    password             VARCHAR(100) NOT NULL,
    created_on           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_on      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name                 VARCHAR(100),
    phone_no             VARCHAR(20),
    email                VARCHAR(100),
    agency_logo          TEXT,
    service_type         VARCHAR(30)
);

CREATE TABLE vehicle (
    vehicle_id           SERIAL PRIMARY KEY,
    transport_agency_id  INTEGER NOT NULL
                         REFERENCES transport_agency (transport_agency_id) ON DELETE CASCADE,
    vehicle_type         VARCHAR(30),
    from_union_id        INTEGER REFERENCES unions (union_id),
    to_union_id          INTEGER REFERENCES unions (union_id),
    starting_point       VARCHAR(100),
    drop_off_point       VARCHAR(100),
    starting_date        DATE,
    starting_time        TIME,
    arrival_date         DATE,
    arrival_time         TIME,
    ticket_price         NUMERIC(10, 2)
);

CREATE TABLE transport_ticket_booking (
    booking_id                 SERIAL PRIMARY KEY,
    client_username            VARCHAR(50) NOT NULL
                               REFERENCES client_user (username) ON DELETE CASCADE,
    vehicle_id                 INTEGER NOT NULL REFERENCES vehicle (vehicle_id) ON DELETE CASCADE,
    transport_agency_id        INTEGER NOT NULL
                               REFERENCES transport_agency (transport_agency_id) ON DELETE CASCADE,
    no_of_seats                INTEGER NOT NULL CHECK (no_of_seats > 0),
    total_bill                 NUMERIC(12, 2),
    payment_completion_status  VARCHAR(10) NOT NULL DEFAULT 'PENDING'
);

-- ---------------------------------------------------------------------
--  Audit log written by the stored procedures and triggers
-- ---------------------------------------------------------------------
CREATE TABLE log_table (
    log_id              SERIAL PRIMARY KEY,
    username            VARCHAR(50),
    time_called         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    called_plsql        VARCHAR(100) NOT NULL,
    calling_parameters  TEXT
);

CREATE INDEX idx_districts_division  ON districts (division_id);
CREATE INDEX idx_upazillas_district  ON upazillas (district_id);
CREATE INDEX idx_unions_upazilla     ON unions (upazilla_id);
CREATE INDEX idx_hotel_union         ON hotel (union_id);
CREATE INDEX idx_spot_union          ON tourist_spot (union_id);
CREATE INDEX idx_comment_spot        ON tourist_spot_blog_comment (spot_id);
CREATE INDEX idx_reviews_business    ON reviews (business_username);
CREATE INDEX idx_booking_hotel       ON hotel_room_booking (hotel_id);
CREATE INDEX idx_booking_client      ON hotel_room_booking (client_username);
