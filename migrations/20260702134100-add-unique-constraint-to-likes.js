export async function up(queryInterface, Sequelize) {
  await queryInterface.addIndex("Likes", ["userId", "blogId"], {
    unique: true,
    name: "likes_userId_blogId_unique"
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeIndex("Likes", "likes_userId_blogId_unique");
}
