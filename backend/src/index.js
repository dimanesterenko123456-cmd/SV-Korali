// src/index.js
// import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constans/index.js';
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
