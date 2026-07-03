export async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "aboutMe", {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: "",
    });
}

export async function down(queryInterface) {
    await queryInterface.removeColumn("Users", "aboutMe");
}
