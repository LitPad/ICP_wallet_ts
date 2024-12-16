import { generateJWTwithHMAC } from "@dolphjs/dolph/utilities";

export const generateTokenForResponses = async () => {
  const expires = new Date(Date.now() + 80000);

  const token = await generateJWTwithHMAC({
    payload: {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expires.getTime() / 1000),
      sub: "",
      info: "",
    },
    secret: process.env.SECRET,
  });

  return token;
};
