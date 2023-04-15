feed = (parent, args, context) => {
    return context.prisma.post.findMany();
}

module.exports = {
    feed,
}