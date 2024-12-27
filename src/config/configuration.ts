import { url } from "inspector";
import { join } from "path";

export default () => {
  const dev = {
    app: {
      port: Number(process.env.DEV_APP_PORT) || 3010
    },
    db: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: Number(process.env.DEV_DB_PORT) || 27017,
      name: process.env.DEV_DB_NAME || 'kumquat_bep4than_dev'
    },
    converterService: {
      url: process.env.DEV_CONVERTER_SERVICE_URL || 'http://localhost:3009'
    }
  };

  const pro = {
    app: {
      port: Number(process.env.PRO_APP_PORT)
    },
    db: {
      host: process.env.PRO_DB_HOST,
      port: Number(process.env.PRO_DB_PORT),
      name: process.env.PRO_DB_NAME
    },
    converterService: {
      url: process.env.PRO_CONVERTER_SERVICE_URL || 'http://10.8.0.2:3009'
    }
  };

  const folder = {
    album: join(__dirname, '../..', process.env.ALBUM_FOLDER).replace(/\\/g, "/")
  }

  const config = process.env.NODE_ENV?.trim() === 'pro' ? pro : dev;

  return { ...config, folder };
}