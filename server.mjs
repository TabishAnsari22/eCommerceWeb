import express, { request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import fs from "fs";
import multer from "multer";
import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "ecommercewebsite-221ee",
  private_key_id: "44eadc5647bc4131e5f8788b279dec9ea8f325ce",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6r+JGYVSFBgO2\n7m9/gQR9Co76V2QCA8m044i7dntlcBajA37PF03yTPQw4rxVLm3mxawPFSS3VfyK\nBtY8jkMMF28+9yv7IKBMVn08/aRlU8qHfGhDhDzWejbN0F1suRmwvkiDKIv202nA\nDheh/HSjK5m3oyGvehRkBhFM8v08i2iIAscNhF5A7he1R5S+ooDwVlx9a8Pj8E6G\nLkMS5Pe4kx2nVetQVKDj5CYGlWjsJGcf3EctQdaudfIxv+T101lk5tCVcQ+JNfVI\njrWqxJ3H2/VgYip3NB1zNmu2JY93INCtrlnovlVv5jM1WXYmhPjL9aS8RSbf+1wu\njFSwcO+NAgMBAAECggEAIH7uqHkXNPuFyIErC9r5nMlqd2WgXSBrKy9DFPyMAK14\n50G7wFEKap+eDudcyIgHLdkhONPhmv8e8Si9AHfz8EYhAWkVcQZuGLOiY6w0AkZK\nVfigDoaVb3EBGqTHKl5y/Bq3NQtpB5snyHw7fWEcLW3wuTAudCTQKVQMDWSrk27V\nkPW7oAD+h/I8I+QQp/EgZiZllcjlRqio7izpBQmgfJhM68bdhWP0W7/ol1wYkv1R\nfK1xbuCZeIUGGnxgBLjYAdEWCcP642eVxRNDjHuhw7tlQcIyAw9xbVtMPvkIdBrf\nGTDdkfm+hQ+m394FrgtR/53rx1TC/+aVQBYxbTHsgQKBgQDoUV4vQE81woTxXxKX\nR72gTGatxW1c6lweXah+2GQwYr2+DII4MsPybqaM286Z3PZ+9KaVur7EK1qeeM6T\nUBc/AQqOUAdJ33GBfMxuKjWR8Iq+74xknDlA8AjMyegcdEo+Q+xrQIfFAlA4RiOt\n4aMIGCfsNf939ay29udwIn4bDQKBgQDNt7jIQeLn6+ZC6CKtYkxW0x9v4VMe7s8F\nP9kI3umzUZMSTjDFrIldo14S5yK0qrmhRzNhFy1HUvcu6G8EDk0ZhzJzs1V1rNqG\nTlpWATJ0iVZRdjSBsOpeG38LlMPLE8YUNEVAHY4ZvhsC31jBX2QQEJ2Dtyc07Ee4\nDuu4to8GgQKBgHkm3cgkcGpnu66oVuifmAs9bJqYh7TZ3xpS22jy7iSxiaPPoCUw\njDEkdSSmCHMC4WVJrooM7ikdNs/HzmrSbJ0FrPyUTYi/xtCxRWb6Ch/GYoS6Jevd\n8Jml0+EANlSIbKNWBrfT2jnqP+1o3nhyX/P7rO4pJsXnT5/G2OEIi90NAoGBALif\nty26u+rK8wd/EIgtHTgbGC6vuYqcZp1edOkaLgFqJ6UZGXp+43VvReGPIL2mLx0I\nKptrUo6dbgviPKgWManEhUoDW6JVtHUu4rInNuIR068ed/chEOXOpZF+PM4H/BBr\n7O6i18JQtCs6yYwakVI9py/r8zrzB1avxWwsI2aBAoGBAMz0bILRnZE37uY7AjV6\nhC72yFF9kcGHWDZCNovy2MKaRD+n/8CNWd60FyaZaUD/6itj4glO9K9vQ3NUc1Na\nHzBYUVZ8akmGlsKC5SHHdirpfdopNNSbWabyycl/O8PmcCxFng/0WGwZ0fPB+vVP\ntmxs02JAUNxJeDmmrBR1bs00\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-sxl6e@ecommercewebsite-221ee.iam.gserviceaccount.com",
  client_id: "101421594492267569163",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-sxl6e%40ecommercewebsite-221ee.iam.gserviceaccount.com",
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommercewebsite-221ee.firebaseio.com",
});
const bucket = admin
  .storage()
  .bucket("gs://ecommercewebsite-221ee.appspot.com");

const storageConfig = multer.diskStorage({
  // https://www.npmjs.com/package/multer#diskstorage
  destination: "./uploads/",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storageConfig });

let dbURI =
  process.env.MONGODBURI ||
  "mongodb+srv://tabish:1234@cluster0.wtc3jvl.mongodb.net/loginform?retryWrites=true&w=majority";
const SECRET = process.env.SECRET || "topsecret";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://ecommercewebsite-221ee.web.app",
      "*",
    ],
    credentials: true,
  })
);

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },

  // age: { type: Number, min: 18, max: 60, default: 18 },
  // isMarried: { type: Boolean, default: false },

  createdOn: { type: Date, default: Date.now },
});

const userModel = mongoose.model("user", userSchema);

const productSchema = new mongoose.Schema({
  // name: { type: String, required: true },
  productPicture: { type: String, required: true },
  title: { type: String },
  price: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
  // code: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});
const productModel = mongoose.model("products", productSchema);

app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }

  userModel.findOne(
    { email: body.email },
    "email firstName lastName age password",
    (err, user) => {
      if (!err) {
        console.log("user: ", user);

        if (user) {
          varifyHash(body.password, user.password).then((isMatched) => {
            if (isMatched) {
              var token = jwt.sign(
                {
                  _id: user._id,
                  email: user.email,
                  iat: Math.floor(Date.now() / 1000) - 30,

                  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                SECRET
              );

              console.log("token:", token);

              res.cookie("Token", token, {
                maxAge: 86_400_000,
                httpOnly: true,
              });

              res.send({
                message: "Login successful",
                profile: {
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  gender: user.gender,
                  address: user.address,
                  _id: user._id,
                },
              });

              return;
            } else {
              console.log("user not found: ");
              res.status(401).send({ message: "Incorrect email.or password," });
              return;
            }
          });
        } else {
          // user not found

          console.log("user not found: ");
          res.status(401).send({ message: "Incorrect email.or password," });
          return;
        }
      } else {
        console.log("db error: ", err);
        res.status(500).send({ message: "Login failed please try later" });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.cookie("Token", "", {
    maxAge: 0,
    httpOnly: true,
  });

  res.send({ message: "Logout successful" });
});

app.post("/signup", (req, res) => {
  let body = req.body;

  if (
    !body.firstName ||
    !body.lastName ||
    !body.email ||
    !body.password ||
    !body.gender ||
    !body.address
  ) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                    "gender": "male"
                    "address": "address"
                }`
    );
    return;
  }

  userModel.findOne({ email: body.email }, (err, user) => {
    if (!err) {
      console.log("user: ", user);

      if (user) {
        // user already exist
        console.log("user already exist: ", user);
        res.status(400).send({
          message: "user already exist, please try a different email",
        });
        return;
      } else {
        // user not already exist

        stringToHash(body.password).then((hashString) => {
          userModel.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email.toLowerCase(),
            password: hashString,
            gender: body.gender,
            address: body.address,
          });
          (err, result) => {
            if (!err) {
              console.log("data saved: ", result);
              res.status(201).send({ message: "user is created" });
            } else {
              console.log("db error: ", err);
              res.status(500).send({ message: "internal server error" });
            }
          };
        });
      }
    } else {
      console.log("db error: ", err);
      res.status(500).send({ message: "db error in query" });
    }
  });
});

app.use(function (req, res, next) {
  console.log("req.cookies: ", req.cookies);

  if (!req.cookies.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }
  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401).send("token expired");
      } else {
        console.log("token approved");
        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

app.get("/profile", async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.body.token._id }).exec();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "error getting users" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await productModel.find({}).exec();
    console.log("all product: ", products);

    res.send({
      message: "all products",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to get product",
    });
  }
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id }).exec();
    console.log("product: ", product);

    res.send({
      message: "product",
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to get product",
    });
  }
});

app.post("/product", upload.any(), async (req, res) => {
  console.log("prouct received: ", req.files);
  try {
    bucket.upload(
      req.files[0].path,
      {
        destination: `productPicture/${req.files[0].filename}`,
      },

      function (err, file, apiResponse) {
        // console.log("apiResponse",apiResponse);
        if (!err) {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then(async (urlData, err) => {
              console.log("==>", urlData, err);
              if (!err) {
                console.log("public downloadable url: ", urlData);

                const newProduct = new productModel({
                  productPicture: urlData[0],
                  title: req.body.title,
                  price: req.body.price,
                  condition: req.body.condition,
                  description: req.body.description,
                  createdBy: req.body.createdBy,
                });

                await newProduct.save();

                try {
                  fs.unlinkSync(req.files[0].path);
                } catch (err) {
                  console.error(err);
                }
                res.send({
                  message: "product added",
                  data: "Product created successfully",
                });
              }
            });
        } else {
          console.log("err: ", err);
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "faild to added product",
    });
  }
});

app.put("/product/:id", async (req, res) => {
  console.log("product to be edited: ", req.body);

  const update = {};
  if (req.body.productPicture) update.productPicture = req.body.productPicture;
  if (req.body.title) update.title = req.body.title;
  if (req.body.price) update.price = req.body.price;
  if (req.body.condition) update.condition = req.body.condition;
  if (req.body.description) update.description = req.body.description;

  try {
    const updated = await productModel
      .findOneAndUpdate({ _id: req.params.id }, update, { new: true })
      .exec();
    console.log("updated product: ", updated);

    res.send({
      message: "product updated successfuly",
      data: updated,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to upadate product",
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  console.log("prouct delete: ", req.body);

  try {
    const deleted = await productModel.deleteOne({ _id: req.params.id });
    console.log("product deleted: ", deleted);

    res.send({
      message: "product deleted",
      data: deleted,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to delete product",
    });
  }
});

app.use((req, res) => {
  res.status(404).send("404 not found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/UserPage", upload.any(), async (req, res) => {
  console.log("UserPage received: ", req.files);
  try {
    bucket.upload(
      req.files[0].path,
      {
        destination: `productPicture/${req.files[0].filename}`,
      },

      function (err, file, apiResponse) {
        // console.log("apiResponse",apiResponse);
        if (!err) {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2491",
            })
            .then(async (urlData, err) => {
              console.log("==>", urlData, err);
              if (!err) {
                console.log("public downloadable url: ", urlData);

                const newProduct = new productModel({
                  productPicture: urlData[0],
                  title: req.body.title,
                  price: req.body.price,
                  condition: req.body.condition,
                  description: req.body.description,
                });

                await newProduct.save();

                try {
                  fs.unlinkSync(req.files[0].path);
                } catch (err) {
                  console.error(err);
                }
                res.send({
                  message: "UserPage added",
                  data: "UserPage created successfully",
                });
              }
            });
        } else {
          console.log("err: ", err);
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message: "faild to added UserPage",
    });
  }
});

app.get("/UserPage", async (req, res) => {
  try {
    const UserPage = await productModel.find({}).exec();
    console.log("all UserPage: ", UserPage);

    res.send({
      message: "all UserPage",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      message: "faild to get UserPage",
    });
  }
});

// /////////////////////////////////////////////////////////////////////////////////////////////////

mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
