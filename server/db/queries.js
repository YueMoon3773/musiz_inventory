const pool = require('./pool');
require('dotenv').config();

const getAllData = async () => {
    const { rows } = await pool.query(`SELECT * FROM ${process.env.DB_TABLE_NAME}`);
    return rows;
};

const getDataByCondition = async (condition) => {
    const { rows } = await pool.query(`SELECT * FROM ${process.env.DB_TABLE_NAME} WHERE id = $1`, [condition]);
    return rows;
};

const getAllSongs = async () => {
    const { rows } = await pool.query('SELECT * FROM songs;');
    // console.log(rows);

    return rows;
};

const getAllArtists = async () => {
    const { rows } = await pool.query('SELECT * FROM artists;');
    return rows;
};

const getAllGenres = async () => {
    const { rows } = await pool.query('SELECT * FROM genres;');
    return rows;
};

const getAllSongsAndInfo = async () => {
    const { rows } = await pool.query(`
	SELECT 
		s.id, 
		s.song, 
		s.is_editable, 
		a.artists, 
		a.artist_ids, 
		g.genres,
		g.genre_ids
	FROM songs s 

	JOIN (
		SELECT 
			saa.song_id, 
			ARRAY_AGG(saa.artist ORDER BY saa.id) artists, 
			ARRAY_AGG(saa.id ORDER BY saa.id) artist_ids 
		FROM (
			SELECT DISTINCT 
				sa.song_id, 
				a.id, 
				a.artist 
			FROM song_artist sa 
			JOIN artists a ON a.id = sa.artist_id 
			ORDER BY sa.song_id
			) saa GROUP BY saa.song_id
	) a ON a.song_id = s.id

	JOIN(
		SELECT 
			sgg.song_id, 
			ARRAY_AGG(sgg.genre ORDER BY sgg.id) genres, 
			ARRAY_AGG(sgg.id ORDER BY sgg.id) genre_ids 
		FROM (
			SELECT DISTINCT 
				sg.song_id, 
				g.genre, 
				g.id 
			FROM genres g 
			JOIN song_genre sg ON sg.genre_id = g.id
			ORDER BY sg.song_id
			) sgg GROUP BY sgg.song_id
	) g ON g.song_id = s.id;
`);
    return rows;
};

const insertNewGenre = async (genreName) => {
    await pool.query(
        `
	INSERT INTO genres (genre, is_editable) VALUES
		($1, TRUE);
`,
        [genreName],
    );
};

const insertNewArtist = async (artistName) => {
    pool.query(
        `
	INSERT INTO artists (artist, is_editable) VALUES
		($1, TRUE);
	`,
        [artistName],
    );
};

module.exports = {
    getAllData,
    getAllSongs,
    getAllSongsAndInfo,
    getAllArtists,
    getAllGenres,
    getDataByCondition,
    insertNewGenre,
    insertNewArtist,
};
