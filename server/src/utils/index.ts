import { sign } from "jsonwebtoken";

export const generateJwtToken = (payload: string | object | Buffer) => {
  return sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const getPagination = <T>({
  list,
  limit,
  page,
  total,
}: {
  list: T;
  page: number;
  limit: number;
  total: number;
}) => {
  return {
    pageMeta: {
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    },
    list,
  };
};
