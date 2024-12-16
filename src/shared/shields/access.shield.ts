import {
  DNextFunc,
  DRequest,
  DResponse,
  ForbiddenException,
  UnauthorizedException,
} from "@dolphjs/dolph/common";
import { verifyJWTwithHMAC } from "@dolphjs/dolph/utilities";

export const AccessShield = async (
  req: DRequest,
  res: DResponse,
  next: DNextFunc
) => {
  const token = req.headers["access"] as string;

  if (!token)
    return next(new ForbiddenException("Provide a valid access token"));

  const heading = token.split(" ")[0];
  const accessToken = token.split(" ")[1];

  if (heading !== "Litpad")
    throw new ForbiddenException("Provide a valid access token");

  try {
    await verifyJWTwithHMAC({
      token: accessToken,
      secret: process.env.SECRET,
    });

    next();
  } catch (e: any) {
    next(new UnauthorizedException(e));
  }
};
