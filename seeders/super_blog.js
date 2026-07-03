import User from "../models/user.model.js";

export async function up(queryInterface, Sequelize) {
  const superAdmin = await User.findOne({where: {email: "superadmin@example.com"}});
  if (superAdmin) {
    await queryInterface.bulkInsert(
      "Blogs",
      [
        {
          title: "The Genesis of Our Platform",
          content: "Welcome to the ultimate blogging platform. This is the super blog that starts it all. Here you will find amazing stories, insights, and technical deep dives from the creator.",
          category: "Technology",
          authorId: superAdmin.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  }
}

export async function down(queryInterface, Sequelize) {
  const superAdmin = await User.findOne({where: {email: "superadmin@example.com"}});
  if (superAdmin) {
    await queryInterface.bulkDelete(
      "Blogs",
      {
        authorId: superAdmin.id,
      },
      {}
    );
  }
}
