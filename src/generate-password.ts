import { hash } from "bcryptjs";

const passwordTohash = "123456";

hash(passwordTohash, 6).then(console.log);
