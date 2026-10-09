-- =====================================================================
--  On the Road — stored procedures, functions and triggers
--  Every name and signature here is the one the backend calls.
-- =====================================================================

-- ---------------------------------------------------------------------
--  Helper: write a row to the audit log
-- ---------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE write_log(p_username VARCHAR, p_plsql VARCHAR, p_params TEXT)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO log_table (username, called_plsql, calling_parameters)
    VALUES (COALESCE(p_username, 'system'), p_plsql, p_params);
END;
$$;

-- ---------------------------------------------------------------------
--  Ratings (home page "Top Reviewed" sections)
--  POST /hotel/gettopreviewedtouristspots -> CALL update_average_ratings($1)
--  POST /hotel/gettopreviewedhotels       -> CALL update_average_hotel_ratings($1)
-- ---------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE update_average_ratings(p_username VARCHAR)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE tourist_spot ts
       SET average_rating = COALESCE((
               SELECT ROUND(AVG(c.rating), 1)
                 FROM tourist_spot_blog_comment c
                WHERE c.spot_id = ts.spot_id), 0);

    CALL write_log(p_username, 'update_average_ratings', 'username => ' || COALESCE(p_username, 'NULL'));
END;
$$;

CREATE OR REPLACE PROCEDURE update_average_hotel_ratings(p_username VARCHAR)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE hotel h
       SET average_rating = COALESCE((
               SELECT ROUND(AVG(r.rating), 1)
                 FROM reviews r
                WHERE r.business_username = h.username), 0);

    CALL write_log(p_username, 'update_average_hotel_ratings', 'username => ' || COALESCE(p_username, 'NULL'));
END;
$$;

-- ---------------------------------------------------------------------
--  Bookings
--  Approving a booking (PENDING -> ONGOING) takes the rooms out of stock,
--  finishing it (ONGOING -> COMPLETED) puts them back.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_booking_room_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_left INTEGER;
BEGIN
    IF OLD.payment_completion_status = 'PENDING' AND NEW.payment_completion_status = 'ONGOING' THEN
        SELECT available_rooms_left INTO v_left
          FROM hotel_rooms
         WHERE hotel_id = NEW.hotel_id AND room_type = NEW.room_type
           FOR UPDATE;

        IF v_left < NEW.no_of_rooms THEN
            RAISE EXCEPTION 'Only % % room(s) left, cannot approve booking %',
                v_left, NEW.room_type, NEW.booking_id;
        END IF;

        UPDATE hotel_rooms
           SET available_rooms_left = available_rooms_left - NEW.no_of_rooms
         WHERE hotel_id = NEW.hotel_id AND room_type = NEW.room_type;

    ELSIF OLD.payment_completion_status = 'ONGOING' AND NEW.payment_completion_status = 'COMPLETED' THEN
        UPDATE hotel_rooms
           SET available_rooms_left = available_rooms_left + NEW.no_of_rooms
         WHERE hotel_id = NEW.hotel_id AND room_type = NEW.room_type;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_room_stock
AFTER UPDATE OF payment_completion_status ON hotel_room_booking
FOR EACH ROW EXECUTE FUNCTION trg_booking_room_stock();

-- POST /hotel/triggerProcedure -> CALL check_and_update_payment_completion_status()
-- Closes every approved stay whose check-out date has passed.
CREATE OR REPLACE PROCEDURE check_and_update_payment_completion_status()
LANGUAGE plpgsql AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE hotel_room_booking
       SET payment_completion_status = 'COMPLETED'
     WHERE payment_completion_status = 'ONGOING'
       AND check_out_date < CURRENT_DATE;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    IF v_count > 0 THEN
        CALL write_log('system', 'check_and_update_payment_completion_status',
                       v_count || ' booking(s) completed');
    END IF;
END;
$$;

-- ---------------------------------------------------------------------
--  Admin revenue chart: the platform keeps a 5% commission
--  POST /admin/revenue -> SELECT * FROM calculate_monthly_revenue()
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_monthly_revenue()
RETURNS TABLE (month_name TEXT, revenue NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT TRIM(TO_CHAR(DATE_TRUNC('month', b.booking_date), 'Month')),
           ROUND(SUM(b.total_bill) * 0.05, 2)
      FROM hotel_room_booking b
     WHERE b.payment_completion_status IN ('ONGOING', 'COMPLETED')
       AND EXTRACT(YEAR FROM b.booking_date) = EXTRACT(YEAR FROM CURRENT_DATE)
     GROUP BY DATE_TRUNC('month', b.booking_date)
     ORDER BY DATE_TRUNC('month', b.booking_date);
END;
$$;

-- ---------------------------------------------------------------------
--  Tourist spot lookups
-- ---------------------------------------------------------------------
-- POST /touristSpot/fetchDivisionWiseSpots/myDivision
CREATE OR REPLACE FUNCTION find_spots_under_division(p_division VARCHAR)
RETURNS TABLE (
    spot_id INTEGER, name VARCHAR, blog_description TEXT, image TEXT,
    average_rating NUMERIC, district_name VARCHAR, division_name VARCHAR
)
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT ts.spot_id, ts.name, ts.blog_description, ts.image, ts.average_rating,
           d.name, dv.name
      FROM tourist_spot ts
      JOIN unions u     ON ts.union_id = u.union_id
      JOIN upazillas up ON u.upazilla_id = up.upazilla_id
      JOIN districts d  ON up.district_id = d.district_id
      JOIN divisions dv ON d.division_id = dv.division_id
     WHERE dv.name ILIKE p_division
     ORDER BY ts.average_rating DESC, ts.name;
END;
$$;

-- POST /touristSpotInfo/Details/fetchneighboringspots/:spot_id
-- Other spots in the same division, the ones in the same district first.
CREATE OR REPLACE FUNCTION find_neighboring_spots(p_spot_id INTEGER)
RETURNS TABLE (
    spot_id INTEGER, name VARCHAR, blog_description TEXT, image TEXT,
    average_rating NUMERIC, district_name VARCHAR
)
LANGUAGE plpgsql AS $$
DECLARE
    v_district INTEGER;
    v_division INTEGER;
BEGIN
    SELECT d.district_id, d.division_id INTO v_district, v_division
      FROM tourist_spot ts
      JOIN unions u     ON ts.union_id = u.union_id
      JOIN upazillas up ON u.upazilla_id = up.upazilla_id
      JOIN districts d  ON up.district_id = d.district_id
     WHERE ts.spot_id = p_spot_id;

    RETURN QUERY
    SELECT ts.spot_id, ts.name, ts.blog_description, ts.image, ts.average_rating, d.name
      FROM tourist_spot ts
      JOIN unions u     ON ts.union_id = u.union_id
      JOIN upazillas up ON u.upazilla_id = up.upazilla_id
      JOIN districts d  ON up.district_id = d.district_id
     WHERE d.division_id = v_division
       AND ts.spot_id <> p_spot_id
     ORDER BY (d.district_id = v_district) DESC, ts.average_rating DESC
     LIMIT 6;
END;
$$;

-- ---------------------------------------------------------------------
--  Suspicious users
--  A traveller is flagged after three denied bookings or three one-star
--  reviews/comments; the admin can clear the flag.
-- ---------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE flag_if_suspicious(p_username VARCHAR, p_reason TEXT)
LANGUAGE plpgsql AS $$
DECLARE
    v_denied   INTEGER;
    v_onestars INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_denied
      FROM hotel_room_booking
     WHERE client_username = p_username AND payment_completion_status = 'DENIED';

    SELECT (SELECT COUNT(*) FROM reviews WHERE client_username = p_username AND rating = 1)
         + (SELECT COUNT(*) FROM tourist_spot_blog_comment WHERE client_username = p_username AND rating = 1)
      INTO v_onestars;

    IF v_denied >= 3 OR v_onestars >= 3 THEN
        UPDATE client_user SET sus = 'yes' WHERE username = p_username AND sus = 'no';
        IF FOUND THEN
            CALL write_log(p_username, 'flag_if_suspicious', p_reason);
        END IF;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION trg_flag_on_denied_booking()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.payment_completion_status = 'DENIED' AND OLD.payment_completion_status <> 'DENIED' THEN
        CALL flag_if_suspicious(NEW.client_username, 'denied bookings');
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_flag_on_denied_booking
AFTER UPDATE OF payment_completion_status ON hotel_room_booking
FOR EACH ROW EXECUTE FUNCTION trg_flag_on_denied_booking();

CREATE OR REPLACE FUNCTION trg_flag_on_one_star()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.rating = 1 THEN
        CALL flag_if_suspicious(NEW.client_username, 'one-star ' || TG_TABLE_NAME);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_flag_on_one_star_review
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION trg_flag_on_one_star();

CREATE TRIGGER trg_flag_on_one_star_comment
AFTER INSERT ON tourist_spot_blog_comment
FOR EACH ROW EXECUTE FUNCTION trg_flag_on_one_star();

-- POST /admin/removeFromSusList/:username -> CALL remove_user_from_sus_list($1)
CREATE OR REPLACE PROCEDURE remove_user_from_sus_list(p_username VARCHAR)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE client_user SET sus = 'no' WHERE username = p_username;
    CALL write_log('Admin', 'remove_user_from_sus_list', 'username => ' || p_username);
END;
$$;

-- ---------------------------------------------------------------------
--  Deleted travellers are archived so the admin can restore them
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_archive_deleted_client()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO deleted_client_user (
        username, password, first_name, last_name, house_no, road_no, road_name,
        district, division, zip_code, phone_no, email, profile_photo, date_of_birth, created_on)
    VALUES (
        OLD.username, OLD.password, OLD.first_name, OLD.last_name, OLD.house_no, OLD.road_no,
        OLD.road_name, OLD.district, OLD.division, OLD.zip_code, OLD.phone_no, OLD.email,
        OLD.profile_photo, OLD.date_of_birth, OLD.created_on)
    ON CONFLICT (username) DO UPDATE SET deleted_on = CURRENT_TIMESTAMP;

    CALL write_log(OLD.username, 'trg_archive_deleted_client', 'username => ' || OLD.username);
    RETURN OLD;
END;
$$;

CREATE TRIGGER trg_archive_deleted_client
BEFORE DELETE ON client_user
FOR EACH ROW EXECUTE FUNCTION trg_archive_deleted_client();

-- ---------------------------------------------------------------------
--  Deleting a hotel/restaurant frees its business username
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_release_business_username()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM business_entity WHERE username = OLD.username;
    CALL write_log(OLD.username, 'trg_release_business_username', TG_TABLE_NAME || ' => ' || OLD.username);
    RETURN OLD;
END;
$$;

CREATE TRIGGER trg_release_hotel_username
AFTER DELETE ON hotel
FOR EACH ROW EXECUTE FUNCTION trg_release_business_username();

CREATE TRIGGER trg_release_restaurant_username
AFTER DELETE ON restaurant
FOR EACH ROW EXECUTE FUNCTION trg_release_business_username();

-- ---------------------------------------------------------------------
--  Keep last_updated_on honest
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_touch_last_updated()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.last_updated_on := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_client     BEFORE UPDATE ON client_user FOR EACH ROW EXECUTE FUNCTION trg_touch_last_updated();
CREATE TRIGGER trg_touch_hotel      BEFORE UPDATE ON hotel       FOR EACH ROW EXECUTE FUNCTION trg_touch_last_updated();
CREATE TRIGGER trg_touch_restaurant BEFORE UPDATE ON restaurant  FOR EACH ROW EXECUTE FUNCTION trg_touch_last_updated();
