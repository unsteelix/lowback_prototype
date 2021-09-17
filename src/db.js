import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

const TypeError = 'DB_Error';

class DB {
    constructor() {
        this.jsonDB = new JsonDB(new Config('./database/db.json', true, true, '/'));
    }

    get(path) {
        try {
            return this.jsonDB.getData(path);
        } catch (e) {
            throw new Error(`${TypeError} [GET]:` + e);
        }
    }

    set(path, data) {
        try {
            this.jsonDB.push(path, data);
            return this.get(path);
        } catch (e) {
            throw new Error(`${TypeError} [SET]:` + e);
        }
    }

    merge(path, data) {
        try {
            this.jsonDB.push(path, data, false);
            return this.get(path);
        } catch (e) {
            throw new Error(`${TypeError} [MERGE]:` + e);
        }
    }

    delete(path) {
        try {
            this.jsonDB.delete(path);
        } catch (e) {
            throw new Error(`${TypeError} [DELETE]:` + e);
        }
    }

    reload() {
        try {
            this.jsonDB.reload();
        } catch (e) {
            throw new Error(`${TypeError} [RELOAD]:` + e);
        }
    }

    count(path) {
        try {
            return this.jsonDB.count(path);
        } catch (e) {
            throw new Error(`${TypeError} [COUNT]:` + e);
        }
    }

    getIndex(path) {
        try {
            return this.jsonDB.getIndex(path);
        } catch (e) {
            throw new Error(`${TypeError} [GETINDEX]:` + e);
        }
    }

}

const db = new DB();

export default db;
