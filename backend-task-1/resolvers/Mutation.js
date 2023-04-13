const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");
async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}
async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
}

async function create(parent, args, context, info) {
  const { userId } = context;

  return await context.prisma.post.create({
    data: {
      title: args.title,
      body: args.body,
      postedBy: { connect: { id: userId } },
    },
  });
}

const update = async (parent, args, context, info) => {
  const updatepost = await context.prisma.post.update({
    where: { id: parseInt(args.id) },
    data: {
      title: args.title,
      body: args.body,
    },
  });
  return updatepost;
};
const deletepost = async (parent, args, context, info) => {
  const deletedPost = await context.prisma.post.delete({
    where: { id: parseInt(args.id) },
  });
  return deletedPost;
};
module.exports = {
  signup,
  login,
  create,
  update,
  deletepost,
};
