const pool = require('./pool');
require('dotenv').config();

const getAllSongs = async () => {
    const { rows } = await pool.query('SELECT * FROM songs;');
    // console.log(rows);

    return rows;
};

const getAllArtists = async (orderDirection) => {
    const baseSQL = 'SELECT * FROM artists';
    let sql = '';

    if (orderDirection === 'default') {
        sql = baseSQL + `;`;
    } else {
        sql =
            baseSQL +
            `
            ORDER BY artist ${orderDirection};
        `;
    }

    const { rows } = await pool.query(sql);
    return rows;
};

const getAllGenres = async (orderDirection) => {
    const baseSQL = 'SELECT * FROM genres';
    let sql = '';

    if (orderDirection === 'default') {
        sql = baseSQL + `;`;
    } else {
        sql =
            baseSQL +
            `
            ORDER BY genre ${orderDirection};
        `;
    }

    const { rows } = await pool.query(sql);
    return rows;
};

const getAllSongsAndInfo = async (orderType, orderDirection) => {
    const baseSQL = `
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
	    ) g ON g.song_id = s.id
    `;
    let sql = '';

    if (orderType === 'default' || orderDirection === 'default') {
        sql = baseSQL + `;`;
    } else {
        sql =
            baseSQL +
            `
            ORDER BY ${orderType} ${orderDirection};
        `;
    }

    // console.log({ sql });

    const { rows } = await pool.query(sql);
    return rows;
};

const getOneSongAndInfoBySongId = async (songId) => {
    const { rows } = await pool.query(
        `
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
        ) g ON g.song_id = s.id WHERE s.id = $1;
    `,
        [songId],
    );
    return rows;
};

const insertNewGenre = async (genreValue) => {
    await pool.query(
        `
	INSERT INTO genres (genre, is_editable) VALUES
		($1, TRUE);
    `,
        [genreValue],
    );
};

const insertNewArtist = async (artistValue) => {
    await pool.query(
        `
	INSERT INTO artists (artist, is_editable) VALUES
		($1, TRUE);
	`,
        [artistValue],
    );
};

const getArtistOrGenreIdByItsValue = async (valueType, itemValue) => {
    const { rows } = await pool.query(
        `
        	SELECT id FROM ${valueType}s WHERE ${valueType} = $1;
    	`,
        [itemValue],
    );
    return rows;
};

const insertSongSingleRelationship = async (songId, valueType, itemValue) => {
    const itemValueId = await getArtistOrGenreIdByItsValue(valueType, itemValue);
    // console.log({ itemValue, itemValueId });

    if (itemValueId.length <= 0) {
        throw new Error(`Cannot find ${valueType}: ${itemValue} in ${valueType}s TABLE.`);
    }

    await pool.query(
        `
        	INSERT INTO song_${valueType} (song_id, ${valueType}_id, is_editable) VALUES
        		($1, $2, TRUE);
        `,
        [songId, itemValueId[0].id],
    );
};

const insertNewSong = async (songName, artistValue, genreValue) => {
    const { rows: newlyAddedSongId } = await pool.query(
        `
    	INSERT INTO songs (song, is_editable) VALUES
    		($1, TRUE)
			RETURNING id;
    `,
        [songName],
    );

    if (newlyAddedSongId.length === 0) {
        throw new Error('Cannot find the newly added song');
    }

    // console.log({ newlyAddedSongId });
    // console.log(newlyAddedSongId[0].id);

    artistValue.forEach(async (item) => {
        await insertSongSingleRelationship(newlyAddedSongId[0].id, 'artist', item);
    });

    genreValue.forEach(async (item) => {
        await insertSongSingleRelationship(newlyAddedSongId[0].id, 'genre', item);
    });
};

const deleteGenreOrArtistById = async (target, id) => {
    await pool.query(
        `
		DELETE FROM ${target}s
		WHERE id = $1;
	`,
        [id],
    );
};

const deleteSongById = async (id) => {
    await pool.query(
        `
		DELETE FROM songs
		WHERE id = $1;
	`,
        [id],
    );
};

const updateSongNameById = async (id, songName) => {
    await pool.query(
        `
		UPDATE songs
		SET song = $2
		WHERE id = $1;
	`,
        [id, songName],
    );
};

const updateSongSingleRelationship = async (songId, valueType, itemToUpdate) => {
    const itemToUpdateId = await getArtistOrGenreIdByItsValue(valueType, itemToUpdate.value);
    // console.log({ itemToUpdate, itemToUpdateId });

    if (itemToUpdateId.length <= 0) {
        throw new Error(`Cannot find ${valueType}: ${itemToUpdateId} in ${valueType}s TABLE.`);
    }

    if (itemToUpdateId[0].id === itemToUpdate.id) return;

    await pool.query(
        `
		UPDATE song_${valueType}
		SET ${valueType}_id = $1
		WHERE
			song_id = $2 AND
			${valueType}_id = $3;
	`,
        [itemToUpdateId[0].id, songId, itemToUpdate.id],
    );
};

const deleteSongRelationship = async (songId, relationShipId, relationshipType) => {
    await pool.query(
        `
		DELETE FROM song_${relationshipType}
		WHERE
			song_id = $1 AND 
			${relationshipType}_id = $2;
	`,
        [songId, relationShipId],
    );
};

const updateSongAndAllRelationships = async (
    songId,
    songName,
    artistValue,
    deletedArtistIds,
    genreValue,
    deletedGenreIds,
) => {
    await updateSongNameById(songId, songName);

    let relationshipType = '';

    artistValue.forEach(async (item) => {
        relationshipType = 'artist';
        if (item[`${relationshipType}_id`] === null) {
            await insertSongSingleRelationship(songId, relationshipType, item.value);
        } else if (typeof item[`${relationshipType}_id`] === 'number') {
            await updateSongSingleRelationship(songId, relationshipType, item);
        }
    });

    if (deletedArtistIds.length > 0) {
        deletedArtistIds.forEach(async (item) => {
            await deleteSongRelationship(songId, item, relationshipType);
        });
    }

    genreValue.forEach(async (item) => {
        relationshipType = 'genre';
        if (item[`${relationshipType}_id`] === null) {
            await insertSongSingleRelationship(songId, relationshipType, item.value);
        } else if (typeof item[`${relationshipType}_id`] === 'number') {
            await updateSongSingleRelationship(songId, relationshipType, item);
        }
    });

    if (deletedGenreIds.length > 0) {
        deletedGenreIds.forEach(async (item) => {
            await deleteSongRelationship(songId, item, relationshipType);
        });
    }
};

const getOneGenreOrArtistDetailsById = async (target, targetId) => {
    const { rows } = await pool.query(
        `
        SELECT * FROM ${target}s
        WHERE id = $1;
    `,
        [targetId],
    );

    return rows;
};

const updateGenreOrArtistById = async (target, targetId, targetValue) => {
    await pool.query(
        `
        UPDATE ${target}s
        SET ${target} = $1
        WHERE id = $2;
    `,
        [targetValue, targetId],
    );
};

const getAllSongsByGenreOrArtist = async (targetType, targetId) => {
    let target = '';
    if (targetType === 'genre') {
        target = 'g.genre_ids';
    } else if (targetType === 'artist') {
        target = 'a.artist_ids';
    }

    const { rows } = await pool.query(
        `
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
        ) g ON g.song_id = s.id
        WHERE $1 = ANY(${target});
    `,
        [targetId],
    );

    return rows;
};

module.exports = {
    getAllSongs,
    getAllSongsAndInfo,
    getOneSongAndInfoBySongId,
    getAllArtists,
    getAllGenres,
    insertNewGenre,
    insertNewArtist,
    insertNewSong,
    deleteGenreOrArtistById,
    deleteSongById,
    updateSongAndAllRelationships,
    getOneGenreOrArtistDetailsById,
    updateGenreOrArtistById,
    getAllSongsByGenreOrArtist,
};
