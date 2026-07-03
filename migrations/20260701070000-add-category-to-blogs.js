export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Blogs", "category", {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Technology",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("Blogs", "category");
}
