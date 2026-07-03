export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Likes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    blogId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Likes");
}
