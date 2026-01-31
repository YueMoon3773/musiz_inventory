#! /usr/bin/env node

// const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

const createSQL = `
CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    artist TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (artist)
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (genre)
);

CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    song TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS song_artist (
    song_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_song_artist
        PRIMARY KEY (song_id, artist_id),

    CONSTRAINT fk_song_artist_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_song_artist_artist
        FOREIGN KEY (artist_id)
        REFERENCES artists(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS song_genre (
    song_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_song_genre
        PRIMARY KEY (song_id, genre_id),

    CONSTRAINT fk_song_genre_song
        FOREIGN KEY (song_id)
        REFERENCES songs(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_song_genre_genre
        FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE
);
`;

const insertSQL = `
INSERT INTO artists (artist, is_editable) VALUES
    ('lady gaga', FALSE),
    ('taylor swift', FALSE),
    ('sabrina carpenter', FALSE),
    ('adele', FALSE),
    ('lana del rey', FALSE),
    ('bruno mars', FALSE),
    ('ariana grande', FALSE),
    ('the weeknd', FALSE),
    ('chris stapleton', FALSE)
ON CONFLICT (artist) DO NOTHING;

INSERT INTO genres (genre, is_editable) VALUES
    ('pop', FALSE),
    ('r&b', FALSE),
    ('country', FALSE),
    ('dance-pop', FALSE),
    ('electro-pop', FALSE),
    ('disco', FALSE),
    ('rock', FALSE),
    ('funk', FALSE),
    ('soul', FALSE),
    ('edm', FALSE)
ON CONFLICT (genre) DO NOTHING;

INSERT INTO songs (song, is_editable) VALUES
    ('born this way', FALSE),
    ('vanish into you', FALSE),
    ('die with a smile', FALSE),
    ('blank space', FALSE),
    ('red', FALSE),
    ('save your tears', FALSE),
    ('twilight zone', FALSE),
    ('rain on me', FALSE),
    ('espresso', FALSE),
    ('manchild', FALSE),
    ('someone like you', FALSE),
    ('skyfall', FALSE),
    ('set fire to the rain', FALSE),
    ('one last time', FALSE),
    ('born to die', FALSE),
    ('summertime sadness', FALSE),
    ('the lazy song', FALSE),
    ('just the way you are', FALSE),
    ('break free', FALSE),
    ('bad romance', FALSE),
    ('hair', FALSE),
    ('easy on me', FALSE)
ON CONFLICT (song) DO NOTHING;

INSERT INTO song_artist (song_id, artist_id, is_editable) VALUES
    (1, 1, FALSE),
    (2, 1, FALSE),
    (3, 1, FALSE),
    (3, 6, FALSE),
    (4, 2, FALSE),
    (5, 2, FALSE),
    (6, 7, FALSE),
    (6, 8, FALSE),
    (7, 7, FALSE),
    (8, 1, FALSE),
    (8, 7, FALSE),
    (9, 3, FALSE),
    (10, 3, FALSE),
    (11, 4, FALSE),
    (12, 4, FALSE),
    (13, 4, FALSE),
    (14, 7, FALSE),
    (15, 5, FALSE),
    (16, 5, FALSE),
    (17, 6, FALSE),
    (18, 6, FALSE),
    (19, 7, FALSE),
    (20, 1, FALSE),
    (21, 1, FALSE),
    (22, 4, FALSE),
    (22, 9, FALSE)
ON CONFLICT (song_id, artist_id) DO NOTHING;

INSERT INTO song_genre (song_id, genre_id, is_editable) VALUES
    (1, 5, FALSE),
    (2, 6, FALSE),
    (2, 7, FALSE),
    (3, 1, FALSE),
    (4, 5, FALSE),
    (5, 3, FALSE),
    (6, 2, FALSE),
    (7, 2, FALSE),
    (8, 4, FALSE),
    (8, 6, FALSE),
    (9, 6, FALSE),
    (9, 8, FALSE),
    (10, 1, FALSE),
    (10, 3, FALSE),
    (11, 9, FALSE),
    (12, 9, FALSE),
    (13, 1, FALSE),
    (14, 10, FALSE),
    (14, 4, FALSE),
    (15, 1, FALSE),
    (16, 1, FALSE),
    (17, 9, FALSE),
    (18, 1, FALSE),
    (19, 2, FALSE),
    (19, 1, FALSE),
    (20, 4, FALSE),
    (20, 2, FALSE),
    (21, 6, FALSE),
    (21, 7, FALSE),
    (22, 1, FALSE),
    (22, 9, FALSE)
ON CONFLICT (song_id, genre_id) DO NOTHING;
`;

async function populateDb() {
    // const ssl = process.env.DB_CA
    //     ? { require: true, rejectUnauthorized: true, ca: process.env.DB_CA.replace(/\\n/g, '\n') }
    //     : { require: true, rejectUnauthorized: false };

    console.log('PREPARING DB...');
    const client = new Client({
        connectionString: `${process.env.DB_URL}`,
        ssl: {
            rejectUnauthorized: false,
            // ca: fs.readFileSync('./ca.pem').toString(),
        },
    });
    console.log('DONE SETTING CONNECTION STRING');

    await client.connect();
    console.log('CONNECTED TO DB');

    await client.query(createSQL);
    console.log('CREATED TABLES');

    await client.query(insertSQL);
    console.log('INSERTED DATA INTO TABLES');

    await client.end();
    console.log('DB SET UP DONE');
}

// populateDb();
module.exports = populateDb;
