import { Client, Databases } from "node-appwrite";

/**
 * @typedef {Object} URLEntry
 * @property {string} url
 *
 * @typedef {import('node-appwrite').Models.Document & URLEntry} URLEntryDocument
 */

class AppwriteService {
  constructor() {
    const client = new Client();
    client
      .setEndpoint(
        "https://cloud.appwrite.io/v1",
      )
      .setProject("65546fd72fba29d9f59e")
      .setKey("c868be055bd9871c8dbe0e618ce20d7985b5af5ff8088cbf3f681b7c481072df5a2748f8d8cd966559fed979d28338a55c42e452ed779a544bad524b43c773845647f5fa725c0fabbf8568647f20d30f8905521974088f53fdc521391bdf0b9bf7d5cd8540e29be7f0e9eaadad161fc78089681fc1b9f719d3073fb3462c2682");

    this.databases = new Databases(client);
  }

  /**
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async getURLEntry(shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.getDocument(
          '65548960a4456860b106',
          '6554897626f0d9db290c',
          shortCode,
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 404) throw err;
      return null;
    }
  }

  /**
   * @param {string} url
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async createURLEntry(url, shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.createDocument(
          '65548960a4456860b106',
          '6554897626f0d9db290c',
          shortCode,
          {
            url,
          },
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 409) throw err;
      return null;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async doesURLEntryDatabaseExist() {
    try {
      await this.databases.get('65548960a4456860b106');
      return true;
    } catch (err) {
      if (err.code !== 404) throw err;
      return false;
    }
  }

  async setupURLEntryDatabase() {
    try {
      await this.databases.create(
        '65548960a4456860b106',
        "URL Shortener",
      );
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createCollection(
        '65548960a4456860b106',
        '6554897626f0d9db290c',
        "URLs",
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createUrlAttribute(
        '65548960a4456860b106',
        '6554897626f0d9db290c',
        "url",
        true,
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
  }
}

export default AppwriteService;
