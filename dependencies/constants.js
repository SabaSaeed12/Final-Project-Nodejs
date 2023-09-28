
const credentials = require('./credentials');
const MONGODB_USERNAME = credentials.MONGODB_USERNAME;
const MONGODB_PASSWORD = credentials.MONGODB_PASSWORD;
const MONGODB_HOST =  credentials.MONGODB_HOST;
const MONGODB_DATABASE =credentials. MONGODB_DATABASE ;
const JWT_SECRET = credentials.JWT_SECRET;
const PORT = credentials.PORT;
const ALLOWED_VALIDATION_SCHEMA_SCOPES = {
  BODY: "BODY",
  PARAMS: "PARAMS",
  QUERY: "QUERY",
  NONE: "NONE",
};

const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}`;

const mongoOptions = {
    //  useCreateIndex: true,
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true,
    //  //useFindAndModify: false,
    
};

module.exports = {
  ALLOWED_VALIDATION_SCHEMA_SCOPES,
  MONGODB_URI,
  mongoOptions,
  JWT_SECRET,
  PORT
};
