import bcrypt from "bcrypt"
import User from "../models/user.model.js";
import Role from "../models/role.model.js";

export async function up(queryInterface, Sequelize) {
  const encryptedPassword = await bcrypt.hash("superadminpassword", 10);
  await queryInterface.bulkInsert(
    "Users",
    [
      {
        username: "superadmin",
        email: "superadmin@example.com",
        password: encryptedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {}
  );
  const superAdmin = await User.findOne({where: {email: "superadmin@example.com"}})
  await Role.create({userId: superAdmin.id, roleName: "SUPER_ADMIN", isApproved: true})
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete(
    "Users",
    {
      email: "superadmin@example.com",
    },
    {}
  );
}
