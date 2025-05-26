import { equal } from "assert";
import { PrismaClient, Prisma } from "../../../generated/prisma";

const prisma = new PrismaClient();
const getAllFromDB = async (params: any, options: any) => {
  const andCondition: Prisma.AdminWhereInput[] = [];
  const searchableFields = ["name", "email"];
  const { searchTerm, ...filterData } = params;
  const { page, limit } = options;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  if (params.searchTerm) {
    andCondition.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData) {
    Object.keys(filterData).forEach((key) => {
      andCondition.push({
        [key]: {
          equals: filterData[key],
          mode: "insensitive",
        },
      });
    });
  }

  const result = await prisma.admin.findMany({
    where: {
      AND: andCondition,
    },
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
    orderBy: options.sortBy
      ? { [options.sortBy]: options.sortOrder }
      : {
          createdAt: "desc",
        },
  });

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: await prisma.admin.count({
        where: {
          AND: andCondition,
        },
      }),
    },
    data: result,
  };
};

//get Single Admin From DB

const getSingleAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error("Admin not found");
  }

  return result;
};

//update admin
const updateAdminFromDB = async (id: string, data: any) => {
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  if (!result) {
    throw new Error("Admin not found");
  }

  return result;
};

export const adminService = {
  getAllFromDB,
  getSingleAdminFromDB,
  updateAdminFromDB,
};
