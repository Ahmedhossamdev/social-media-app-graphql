const Post = require("../../models/Post");
const checkAuth = require("./../../util/check-auth");
const { AuthenticationError , UserInputError} = require('apollo-server');


module.exports = {
    Mutation: {
        createComment: async (_, {postId, body}, context) => {
            //console.log("Test");
            //console.log(context)
            const {username} = checkAuth(context);
            //console.log(username);
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty',
                    }
                });
            }
            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString(),
                })
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        deleteComment: async (_, {postId, commentId}, context) => {
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post
                }
                // saver check
                else {
                    throw new AuthenticationError('Action now allowed');
                }
            }
            else {
                throw new UserInputError('Post not found');
            }
        }
    }
}